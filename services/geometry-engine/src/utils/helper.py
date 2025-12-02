"""Helper Utilities for Geometry Processing

Common utilities for 3D mesh processing:
- File I/O (load/save meshes)
- Math utilities (vectors, matrices)
- Validation helpers
- Performance profiling
- Logging setup
"""

import os
import json
import time
import hashlib
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple
from functools import wraps
import numpy as np

logger = logging.getLogger(__name__)


# ===== File I/O Utilities =====

def get_file_hash(filepath: str) -> str:
    """Calculate MD5 hash of file for caching"""
    hash_md5 = hashlib.md5()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def validate_file_path(filepath: str, allowed_extensions: List[str]) -> bool:
    """
    Validate file exists and has allowed extension
    
    Args:
        filepath: Path to validate
        allowed_extensions: List of allowed extensions (e.g. ['.glb', '.obj'])
    
    Returns:
        True if valid, False otherwise
    """
    path = Path(filepath)
    
    if not path.exists():
        logger.error(f"File not found: {filepath}")
        return False
    
    if path.suffix.lower() not in allowed_extensions:
        logger.error(f"Invalid extension: {path.suffix}")
        return False
    
    return True


def ensure_directory(dirpath: str) -> Path:
    """Create directory if it doesn't exist"""
    path = Path(dirpath)
    path.mkdir(parents=True, exist_ok=True)
    return path


# ===== Math Utilities =====

def calculate_face_normal(
    v0: np.ndarray,
    v1: np.ndarray,
    v2: np.ndarray
) -> np.ndarray:
    """
    Calculate face normal from three vertices
    
    Args:
        v0, v1, v2: Triangle vertices as numpy arrays
    
    Returns:
        Normalized face normal vector
    """
    edge1 = v1 - v0
    edge2 = v2 - v0
    normal = np.cross(edge1, edge2)
    
    # Normalize
    length = np.linalg.norm(normal)
    if length > 0:
        normal /= length
    
    return normal


def calculate_triangle_area(
    v0: np.ndarray,
    v1: np.ndarray,
    v2: np.ndarray
) -> float:
    """Calculate area of triangle"""
    edge1 = v1 - v0
    edge2 = v2 - v0
    cross = np.cross(edge1, edge2)
    return 0.5 * np.linalg.norm(cross)


def calculate_bounding_box(
    vertices: np.ndarray
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Calculate axis-aligned bounding box
    
    Args:
        vertices: Nx3 array of vertex positions
    
    Returns:
        (min_point, max_point) as numpy arrays
    """
    min_point = np.min(vertices, axis=0)
    max_point = np.max(vertices, axis=0)
    return min_point, max_point


def normalize_mesh(vertices: np.ndarray, target_size: float = 1.0) -> np.ndarray:
    """
    Normalize mesh to fit in unit cube
    
    Args:
        vertices: Nx3 array of vertex positions
        target_size: Target size for longest dimension
    
    Returns:
        Normalized vertices
    """
    min_point, max_point = calculate_bounding_box(vertices)
    center = (min_point + max_point) / 2
    size = max_point - min_point
    scale = target_size / np.max(size)
    
    # Center and scale
    normalized = (vertices - center) * scale
    return normalized


# ===== Validation Helpers =====

def validate_mesh_data(mesh_data: Dict[str, Any]) -> Tuple[bool, List[str]]:
    """
    Validate mesh data structure
    
    Args:
        mesh_data: Dictionary with vertices, faces, etc.
    
    Returns:
        (is_valid, error_messages)
    """
    errors = []
    
    # Check required fields
    if 'vertices' not in mesh_data:
        errors.append("Missing 'vertices' field")
    if 'faces' not in mesh_data:
        errors.append("Missing 'faces' field")
    
    # Check data types
    if 'vertices' in mesh_data:
        vertices = np.array(mesh_data['vertices'])
        if vertices.ndim != 2 or vertices.shape[1] != 3:
            errors.append("Vertices must be Nx3 array")
    
    if 'faces' in mesh_data:
        faces = np.array(mesh_data['faces'])
        if faces.ndim != 2 or faces.shape[1] != 3:
            errors.append("Faces must be Nx3 array (triangles)")
    
    return len(errors) == 0, errors


# ===== Performance Utilities =====

def timer(func):
    """Decorator to time function execution"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        logger.info(f"{func.__name__} took {elapsed:.2f}s")
        return result
    return wrapper


class ProgressTracker:
    """Simple progress tracker for long operations"""
    
    def __init__(self, total: int, description: str = "Processing"):
        self.total = total
        self.current = 0
        self.description = description
        self.start_time = time.time()
    
    def update(self, increment: int = 1) -> None:
        """Update progress"""
        self.current += increment
        percent = (self.current / self.total) * 100
        elapsed = time.time() - self.start_time
        
        if self.current < self.total:
            eta = (elapsed / self.current) * (self.total - self.current)
            logger.info(
                f"{self.description}: {percent:.1f}% "
                f"({self.current}/{self.total}) ETA: {eta:.1f}s"
            )
        else:
            logger.info(
                f"{self.description}: Complete! "
                f"Total time: {elapsed:.2f}s"
            )


# ===== Logging Setup =====

def setup_logging(level: str = 'INFO', log_file: Optional[str] = None) -> None:
    """
    Configure logging for geometry engine
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR)
        log_file: Optional log file path
    """
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    
    handlers = [logging.StreamHandler()]
    if log_file:
        handlers.append(logging.FileHandler(log_file))
    
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format=log_format,
        handlers=handlers
    )


# ===== Configuration =====

class Config:
    """Configuration manager for geometry engine"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_defaults()
        if config_path:
            self.load(config_path)
    
    def _load_defaults(self) -> Dict[str, Any]:
        """Default configuration"""
        return {
            'max_file_size_mb': 500,
            'temp_dir': '/tmp/teeli',
            'cache_enabled': True,
            'parallel_processing': True,
            'num_workers': 4,
            'tolerance': 1e-6
        }
    
    def load(self, config_path: str) -> None:
        """Load configuration from JSON file"""
        with open(config_path, 'r') as f:
            user_config = json.load(f)
            self.config.update(user_config)
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        return self.config.get(key, default)


if __name__ == '__main__':
    # Test utilities
    setup_logging(level='INFO')
    
    # Test file hash
    print("Testing utilities...")
    
    # Test math
    v0 = np.array([0, 0, 0])
    v1 = np.array([1, 0, 0])
    v2 = np.array([0, 1, 0])
    normal = calculate_face_normal(v0, v1, v2)
    area = calculate_triangle_area(v0, v1, v2)
    print(f"Normal: {normal}, Area: {area}")
    
    # Test progress tracker
    tracker = ProgressTracker(100, "Test")
    for i in range(100):
        time.sleep(0.01)
        if i % 20 == 0:
            tracker.update(20)
