"""Geometry Engine - Main Entry Point

HTTP API server for 3D geometry processing:
- Mesh diagnosis (analyze issues)
- Mesh repair (fix problems)
- Format conversion (GLB, OBJ, FBX, etc.)

Usage:
    python main.py                  # Start development server
    python main.py --port 8000      # Custom port
    python main.py --production     # Production mode
"""

import sys
import argparse
import logging
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from utils.helper import setup_logging, Config
from diagnose.index import diagnose_mesh
from repair.index import repair_mesh
from convert.blender_convert import BlenderConverter

logger = logging.getLogger(__name__)


class GeometryEngine:
    """Main geometry processing engine"""
    
    def __init__(self, config: Config):
        """Initialize geometry engine with configuration"""
        self.config = config
        self.converter = None
        
        # Initialize Blender converter if available
        try:
            self.converter = BlenderConverter()
            logger.info("Blender converter initialized")
        except RuntimeError as e:
            logger.warning(f"Blender not available: {e}")
    
    def diagnose(self, mesh_path: str) -> dict:
        """
        Diagnose mesh issues
        
        Args:
            mesh_path: Path to 3D model file
        
        Returns:
            Diagnosis report
        """
        logger.info(f"Diagnosing mesh: {mesh_path}")
        return diagnose_mesh(mesh_path)
    
    def repair(self, mesh_path: str, output_path: str, aggressive: bool = False) -> dict:
        """
        Repair mesh issues
        
        Args:
            mesh_path: Input mesh path
            output_path: Output mesh path
            aggressive: Apply aggressive repairs
        
        Returns:
            Repair report
        """
        logger.info(f"Repairing mesh: {mesh_path} -> {output_path}")
        return repair_mesh(mesh_path, output_path, aggressive)
    
    def convert(self, input_path: str, output_path: str, options: dict = None) -> dict:
        """
        Convert mesh format
        
        Args:
            input_path: Source file
            output_path: Destination file
            options: Conversion options
        
        Returns:
            Conversion result
        """
        if not self.converter:
            return {
                'success': False,
                'error': 'Blender converter not available'
            }
        
        logger.info(f"Converting: {input_path} -> {output_path}")
        return self.converter.convert(input_path, output_path, options or {})


def create_api_server(engine: GeometryEngine, port: int = 8000):
    """
    Create HTTP API server (using FastAPI)
    
    TODO: Implement FastAPI endpoints:
    - POST /diagnose - Upload and diagnose mesh
    - POST /repair - Upload and repair mesh
    - POST /convert - Convert mesh format
    - GET /health - Health check
    """
    try:
        from fastapi import FastAPI, UploadFile, File
        from fastapi.responses import JSONResponse
        import uvicorn
        
        app = FastAPI(
            title="Teeli Geometry Engine",
            description="3D Mesh Processing API",
            version="0.1.0"
        )
        
        @app.get("/")
        async def root():
            return {
                "service": "Teeli Geometry Engine",
                "version": "0.1.0",
                "status": "running"
            }
        
        @app.get("/health")
        async def health():
            return {
                "status": "healthy",
                "blender_available": engine.converter is not None
            }
        
        @app.post("/diagnose")
        async def api_diagnose(file: UploadFile = File(...)):
            # TODO: Save uploaded file temporarily
            # TODO: Run diagnosis
            # TODO: Return results
            return JSONResponse({
                "status": "not_implemented",
                "message": "Coming soon"
            })
        
        logger.info(f"Starting API server on port {port}...")
        uvicorn.run(app, host="0.0.0.0", port=port)
        
    except ImportError:
        logger.error("FastAPI not installed. Install with: pip install fastapi uvicorn")
        logger.info("Running in CLI mode only...")


def cli_mode(engine: GeometryEngine):
    """Interactive CLI mode for testing"""
    print("""
╔═══════════════════════════════════════╗
║   Teeli Geometry Engine CLI v0.1.0   ║
╚═══════════════════════════════════════╝

Commands:
  diagnose <file>              - Analyze mesh
  repair <input> <output>      - Repair mesh
  convert <input> <output>     - Convert format
  quit                         - Exit
    """)
    
    while True:
        try:
            cmd = input("\n> ").strip().split()
            if not cmd:
                continue
            
            action = cmd[0].lower()
            
            if action == 'quit' or action == 'exit':
                print("Goodbye!")
                break
            
            elif action == 'diagnose' and len(cmd) >= 2:
                result = engine.diagnose(cmd[1])
                print(f"\nResult: {result}")
            
            elif action == 'repair' and len(cmd) >= 3:
                result = engine.repair(cmd[1], cmd[2])
                print(f"\nResult: {result}")
            
            elif action == 'convert' and len(cmd) >= 3:
                result = engine.convert(cmd[1], cmd[2])
                print(f"\nResult: {result}")
            
            else:
                print("Invalid command. Type 'quit' to exit.")
        
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            logger.error(f"Error: {e}")


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Teeli Geometry Engine')
    parser.add_argument('--port', type=int, default=8000, help='API server port')
    parser.add_argument('--production', action='store_true', help='Production mode')
    parser.add_argument('--cli', action='store_true', help='CLI mode (no API server)')
    parser.add_argument('--log-level', default='INFO', help='Logging level')
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(level=args.log_level)
    
    # Load configuration
    config = Config()
    
    # Initialize engine
    logger.info("Initializing Geometry Engine...")
    engine = GeometryEngine(config)
    
    # Start in appropriate mode
    if args.cli:
        cli_mode(engine)
    else:
        create_api_server(engine, args.port)


if __name__ == '__main__':
    main()
