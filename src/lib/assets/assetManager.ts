export interface Asset3D {
  id: string
  name: string
  type: '3d-model' | 'material' | 'lighting'
  category: string
  thumbnail: string
  fileUrl?: string
  metadata: {
    format?: string
    size?: number
    triangles?: number
    materials?: number
  }
  tags: string[]
  createdAt: string
}

export interface MaterialAsset {
  id: string
  name: string
  type: 'pbr' | 'basic' | 'standard'
  properties: {
    color?: string
    metalness?: number
    roughness?: number
    normalMap?: string
    diffuseMap?: string
    specularMap?: string
  }
  thumbnail: string
  tags: string[]
}

export interface LightingPreset {
  id: string
  name: string
  description: string
  environment: string
  settings: {
    intensity: number
    ambientIntensity: number
    rotation: number
    backgroundColor: string
    showBackground: boolean
  }
  thumbnail: string
  tags: string[]
}

export class AssetManager {
  // Get 3D model assets
  async get3DAssets(): Promise<Asset3D[]> {
    return [
      {
        id: 'chair-modern',
        name: 'Modern Chair',
        type: '3d-model',
        category: 'Furniture',
        thumbnail: '/assets/thumbnails/chair-modern.jpg',
        fileUrl: '/assets/models/chair-modern.glb',
        metadata: { format: 'GLB', size: 2.1, triangles: 1200, materials: 2 },
        tags: ['furniture', 'chair', 'modern'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'table-wooden',
        name: 'Wooden Table',
        type: '3d-model',
        category: 'Furniture',
        thumbnail: '/assets/thumbnails/table-wooden.jpg',
        fileUrl: '/assets/models/table-wooden.glb',
        metadata: { format: 'GLB', size: 3.5, triangles: 2400, materials: 1 },
        tags: ['furniture', 'table', 'wood'],
        createdAt: new Date().toISOString()
      },
      {
        id: 'lamp-desk',
        name: 'Desk Lamp',
        type: '3d-model',
        category: 'Lighting',
        thumbnail: '/assets/thumbnails/lamp-desk.jpg',
        fileUrl: '/assets/models/lamp-desk.glb',
        metadata: { format: 'GLB', size: 1.8, triangles: 800, materials: 3 },
        tags: ['lighting', 'lamp', 'desk'],
        createdAt: new Date().toISOString()
      }
    ]
  }

  // Get material library
  async getMaterials(): Promise<MaterialAsset[]> {
    return [
      {
        id: 'wood-oak',
        name: 'Oak Wood',
        type: 'pbr',
        properties: {
          color: '#8B4513',
          metalness: 0.0,
          roughness: 0.8,
          normalMap: '/assets/materials/wood-oak-normal.jpg',
          diffuseMap: '/assets/materials/wood-oak-diffuse.jpg'
        },
        thumbnail: '/assets/materials/wood-oak-thumb.jpg',
        tags: ['wood', 'natural', 'brown']
      },
      {
        id: 'metal-steel',
        name: 'Brushed Steel',
        type: 'pbr',
        properties: {
          color: '#C0C0C0',
          metalness: 1.0,
          roughness: 0.3,
          normalMap: '/assets/materials/steel-normal.jpg'
        },
        thumbnail: '/assets/materials/steel-thumb.jpg',
        tags: ['metal', 'steel', 'industrial']
      },
      {
        id: 'fabric-cotton',
        name: 'Cotton Fabric',
        type: 'standard',
        properties: {
          color: '#F5F5DC',
          metalness: 0.0,
          roughness: 0.9
        },
        thumbnail: '/assets/materials/cotton-thumb.jpg',
        tags: ['fabric', 'soft', 'textile']
      },
      {
        id: 'glass-clear',
        name: 'Clear Glass',
        type: 'standard',
        properties: {
          color: '#FFFFFF',
          metalness: 0.0,
          roughness: 0.0
        },
        thumbnail: '/assets/materials/glass-thumb.jpg',
        tags: ['glass', 'transparent', 'clear']
      }
    ]
  }

  // Get lighting presets
  async getLightingPresets(): Promise<LightingPreset[]> {
    return [
      {
        id: 'studio-soft',
        name: 'Studio Soft',
        description: 'Soft studio lighting for product photography',
        environment: 'studio',
        settings: {
          intensity: 1.2,
          ambientIntensity: 0.4,
          rotation: 0,
          backgroundColor: '#f0f0f0',
          showBackground: true
        },
        thumbnail: '/assets/lighting/studio-soft.jpg',
        tags: ['studio', 'soft', 'photography']
      },
      {
        id: 'golden-hour',
        name: 'Golden Hour',
        description: 'Warm sunset lighting',
        environment: 'sunset',
        settings: {
          intensity: 0.8,
          ambientIntensity: 0.6,
          rotation: 45,
          backgroundColor: '#ff6b35',
          showBackground: true
        },
        thumbnail: '/assets/lighting/golden-hour.jpg',
        tags: ['sunset', 'warm', 'golden']
      },
      {
        id: 'city-night',
        name: 'City Night',
        description: 'Urban nighttime atmosphere',
        environment: 'city',
        settings: {
          intensity: 0.6,
          ambientIntensity: 0.3,
          rotation: 180,
          backgroundColor: '#1a1a2e',
          showBackground: true
        },
        thumbnail: '/assets/lighting/city-night.jpg',
        tags: ['city', 'night', 'urban']
      },
      {
        id: 'natural-daylight',
        name: 'Natural Daylight',
        description: 'Bright natural daylight',
        environment: 'dawn',
        settings: {
          intensity: 1.0,
          ambientIntensity: 0.5,
          rotation: 90,
          backgroundColor: '#87ceeb',
          showBackground: true
        },
        thumbnail: '/assets/lighting/daylight.jpg',
        tags: ['natural', 'daylight', 'bright']
      }
    ]
  }

  // Search assets
  async searchAssets(query: string, type?: string): Promise<Asset3D[]> {
    const assets = await this.get3DAssets()
    return assets.filter(asset => {
      const matchesQuery = asset.name.toLowerCase().includes(query.toLowerCase()) ||
                          asset.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      const matchesType = !type || asset.type === type
      return matchesQuery && matchesType
    })
  }
}