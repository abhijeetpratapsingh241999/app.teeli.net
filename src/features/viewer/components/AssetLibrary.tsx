'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Search, 
  Palette, 
  Lightbulb,
  Download,
  Eye,
  Grid3X3,
  Filter
} from 'lucide-react'
import { AssetManager, type Asset3D, type MaterialAsset, type LightingPreset } from '@/lib/assets/assetManager'
import { useViewerStore } from '../store/useViewerStore'

export default function AssetLibrary() {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'models' | 'materials' | 'lighting'>('models')
  const [searchQuery, setSearchQuery] = useState('')
  const [models, setModels] = useState<Asset3D[]>([])
  const [materials, setMaterials] = useState<MaterialAsset[]>([])
  const [lightingPresets, setLightingPresets] = useState<LightingPreset[]>([])
  const [loading, setLoading] = useState(false)

  const assetManager = new AssetManager()
  const viewerState = useViewerStore()

  useEffect(() => {
    if (open) {
      loadAssets()
    }
  }, [open])

  const loadAssets = async () => {
    setLoading(true)
    try {
      const [modelsData, materialsData, lightingData] = await Promise.all([
        assetManager.get3DAssets(),
        assetManager.getMaterials(),
        assetManager.getLightingPresets()
      ])
      
      setModels(modelsData)
      setMaterials(materialsData)
      setLightingPresets(lightingData)
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyMaterial = (material: MaterialAsset) => {
    // Apply material to selected mesh
    if (viewerState.selectedMeshId) {
      viewerState.updateMaterialColor(material.properties.color || '#ffffff')
      alert(`Applied ${material.name} material`)
    } else {
      alert('Please select a mesh first')
    }
  }

  const applyLightingPreset = (preset: LightingPreset) => {
    // Apply lighting preset to scene
    viewerState.setEnvironmentPreset(preset.environment as any)
    viewerState.setLightIntensity(preset.settings.intensity)
    viewerState.setEnvironmentRotation(preset.settings.rotation)
    viewerState.setBackgroundColor(preset.settings.backgroundColor)
    
    if (preset.settings.showBackground !== viewerState.showBackground) {
      viewerState.toggleBackground()
    }
    
    alert(`Applied ${preset.name} lighting preset`)
  }

  const loadModel = (model: Asset3D) => {
    if (model.fileUrl) {
      viewerState.setFileUrl(model.fileUrl)
      alert(`Loading ${model.name}...`)
    }
  }

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const filteredLighting = lightingPresets.filter(preset => 
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-zinc-200 hover:text-white hover:bg-zinc-700/50"
          title="Asset Library"
        >
          <Package className="size-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="size-5 text-blue-400" />
            Asset Library
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-zinc-400" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="size-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          {[
            { id: 'models', label: '3D Models', icon: Grid3X3 },
            { id: 'materials', label: 'Materials', icon: Palette },
            { id: 'lighting', label: 'Lighting', icon: Lightbulb }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* 3D Models Tab */}
          {activeTab === 'models' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredModels.map(model => (
                <div
                  key={model.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="aspect-square bg-zinc-800 flex items-center justify-center">
                    <Grid3X3 className="size-12 text-zinc-600" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-white text-sm mb-1">{model.name}</h3>
                    <p className="text-xs text-zinc-400 mb-2">{model.category}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {model.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500 mb-3">
                      <div>{model.metadata.triangles} triangles</div>
                      <div>{model.metadata.size}MB</div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => loadModel(model)}
                        className="flex-1 gap-1"
                      >
                        <Download className="size-3" />
                        Load
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filteredMaterials.map(material => (
                <div
                  key={material.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => applyMaterial(material)}
                >
                  <div 
                    className="aspect-square flex items-center justify-center"
                    style={{ backgroundColor: material.properties.color }}
                  >
                    <Palette className="size-12 text-white/20" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-white text-sm mb-1">{material.name}</h3>
                    <p className="text-xs text-zinc-400 mb-2 capitalize">{material.type}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {material.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500 space-y-1">
                      <div>Metalness: {material.properties.metalness}</div>
                      <div>Roughness: {material.properties.roughness}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lighting Tab */}
          {activeTab === 'lighting' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredLighting.map(preset => (
                <div
                  key={preset.id}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  onClick={() => applyLightingPreset(preset)}
                >
                  <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                    <Lightbulb className="size-12 text-zinc-600" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-1">{preset.name}</h3>
                    <p className="text-sm text-zinc-400 mb-3">{preset.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {preset.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500 space-y-1">
                      <div>Environment: {preset.environment}</div>
                      <div>Intensity: {preset.settings.intensity}</div>
                      <div>Rotation: {preset.settings.rotation}°</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}