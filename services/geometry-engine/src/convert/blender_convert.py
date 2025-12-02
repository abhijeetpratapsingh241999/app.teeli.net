"""Blender Conversion Module

Uses Blender's Python API for format conversion between:
- GLB/GLTF (preferred for web)
- FBX (Autodesk)
- OBJ (legacy)
- STL (3D printing)
- DAE (Collada)
- Blend (Blender native)

Requires Blender to be installed and accessible.
"""

import subprocess
import os
import json
from pathlib import Path
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Supported formats
INPUT_FORMATS = ['.fbx', '.obj', '.stl', '.dae', '.blend', '.gltf', '.glb']
OUTPUT_FORMATS = ['.glb', '.gltf', '.obj', '.stl', '.fbx']


class BlenderConverter:
    """Blender-based 3D format converter"""
    
    def __init__(self, blender_path: Optional[str] = None):
        """
        Initialize converter
        
        Args:
            blender_path: Path to Blender executable (auto-detect if None)
        """
        self.blender_path = blender_path or self._find_blender()
        if not self.blender_path:
            raise RuntimeError("Blender not found. Please install Blender.")
        
        logger.info(f"Using Blender at: {self.blender_path}")
    
    def convert(
        self,
        input_path: str,
        output_path: str,
        options: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Convert 3D model from one format to another
        
        Args:
            input_path: Source file path
            output_path: Destination file path
            options: Conversion options (scale, axes, etc.)
        
        Returns:
            Conversion result with metadata
        """
        input_ext = Path(input_path).suffix.lower()
        output_ext = Path(output_path).suffix.lower()
        
        # Validate formats
        if input_ext not in INPUT_FORMATS:
            raise ValueError(f"Unsupported input format: {input_ext}")
        if output_ext not in OUTPUT_FORMATS:
            raise ValueError(f"Unsupported output format: {output_ext}")
        
        # Generate Blender Python script
        script = self._generate_script(input_path, output_path, options or {})
        script_path = Path(output_path).parent / "_blender_script.py"
        
        try:
            # Write temporary script
            with open(script_path, 'w') as f:
                f.write(script)
            
            # Run Blender in background
            result = self._run_blender(script_path)
            
            return {
                'success': True,
                'input': input_path,
                'output': output_path,
                'size': os.path.getsize(output_path) if os.path.exists(output_path) else 0
            }
        
        except Exception as e:
            logger.error(f"Conversion failed: {e}")
            return {
                'success': False,
                'error': str(e)
            }
        
        finally:
            # Cleanup temporary script
            if script_path.exists():
                script_path.unlink()
    
    def _generate_script(
        self,
        input_path: str,
        output_path: str,
        options: Dict[str, Any]
    ) -> str:
        """Generate Blender Python script for conversion"""
        input_ext = Path(input_path).suffix.lower()
        output_ext = Path(output_path).suffix.lower()
        
        script = f"""
import bpy
import sys

# Clear default scene
bpy.ops.wm.read_homefile(use_empty=True)

# Import model
try:
    if '{input_ext}' == '.fbx':
        bpy.ops.import_scene.fbx(filepath='{input_path}')
    elif '{input_ext}' == '.obj':
        bpy.ops.import_scene.obj(filepath='{input_path}')
    elif '{input_ext}' in ['.gltf', '.glb']:
        bpy.ops.import_scene.gltf(filepath='{input_path}')
    elif '{input_ext}' == '.stl':
        bpy.ops.import_mesh.stl(filepath='{input_path}')
    else:
        print(f"Unsupported input format: {input_ext}")
        sys.exit(1)
    
    # Apply transformations
    scale = {options.get('scale', 1.0)}
    for obj in bpy.context.scene.objects:
        obj.scale = (scale, scale, scale)
    
    # Export model
    if '{output_ext}' == '.glb':
        bpy.ops.export_scene.gltf(
            filepath='{output_path}',
            export_format='GLB'
        )
    elif '{output_ext}' == '.gltf':
        bpy.ops.export_scene.gltf(
            filepath='{output_path}',
            export_format='GLTF_SEPARATE'
        )
    elif '{output_ext}' == '.obj':
        bpy.ops.export_scene.obj(filepath='{output_path}')
    elif '{output_ext}' == '.stl':
        bpy.ops.export_mesh.stl(filepath='{output_path}')
    elif '{output_ext}' == '.fbx':
        bpy.ops.export_scene.fbx(filepath='{output_path}')
    
    print("Conversion successful")
    sys.exit(0)

except Exception as e:
    print(f"Error: {{e}}")
    sys.exit(1)
"""
        return script
    
    def _run_blender(self, script_path: Path) -> str:
        """Execute Blender with Python script"""
        cmd = [
            self.blender_path,
            '--background',
            '--python', str(script_path)
        ]
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode != 0:
            raise RuntimeError(f"Blender failed: {result.stderr}")
        
        return result.stdout
    
    def _find_blender(self) -> Optional[str]:
        """Auto-detect Blender installation"""
        # Common Blender paths
        paths = [
            'blender',  # In PATH
            '/usr/bin/blender',  # Linux
            '/usr/local/bin/blender',
            'C:\\Program Files\\Blender Foundation\\Blender\\blender.exe',  # Windows
            '/Applications/Blender.app/Contents/MacOS/Blender'  # macOS
        ]
        
        for path in paths:
            try:
                result = subprocess.run(
                    [path, '--version'],
                    capture_output=True,
                    timeout=5
                )
                if result.returncode == 0:
                    return path
            except (FileNotFoundError, subprocess.TimeoutExpired):
                continue
        
        return None


if __name__ == '__main__':
    # Test conversion
    logging.basicConfig(level=logging.INFO)
    
    try:
        converter = BlenderConverter()
        print("Blender converter initialized successfully")
    except RuntimeError as e:
        print(f"Error: {e}")
