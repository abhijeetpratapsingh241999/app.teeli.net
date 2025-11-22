interface CarbonMetrics {
  renderingEmissions: number // gCO2 per second
  storageEmissions: number // gCO2 per MB per year
  transferEmissions: number // gCO2 per MB transferred
  totalEmissions: number // gCO2
  sustainabilityScore: number // 0-100
  rating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  recommendations: string[]
}

interface ModelData {
  triangles: number
  textureMemory: number // MB
  fileSize: number // MB
  renderTime: number // seconds
  viewCount: number
}

export class CarbonCalculator {
  // Energy consumption constants (based on research)
  private static readonly GPU_POWER_CONSUMPTION = 250 // watts for average GPU
  private static readonly CPU_POWER_CONSUMPTION = 65 // watts for average CPU
  private static readonly CARBON_INTENSITY = 0.5 // kg CO2 per kWh (global average)
  private static readonly STORAGE_CARBON_FACTOR = 0.1 // gCO2 per MB per year
  private static readonly TRANSFER_CARBON_FACTOR = 0.5 // gCO2 per MB

  static calculateCarbonFootprint(data: ModelData): CarbonMetrics {
    // 1. Rendering emissions (based on GPU/CPU usage)
    const complexityFactor = Math.min(data.triangles / 100000, 5) // 1-5x multiplier
    const gpuUsage = 0.3 + (complexityFactor * 0.4) // 30-70% GPU usage
    const cpuUsage = 0.2 + (complexityFactor * 0.3) // 20-50% CPU usage
    
    const powerConsumption = (
      this.GPU_POWER_CONSUMPTION * gpuUsage + 
      this.CPU_POWER_CONSUMPTION * cpuUsage
    ) / 1000 // Convert to kW
    
    const energyPerSecond = powerConsumption * this.CARBON_INTENSITY // kg CO2/s
    const renderingEmissions = energyPerSecond * 1000 * data.renderTime // gCO2

    // 2. Storage emissions (cloud storage impact)
    const storageEmissions = data.fileSize * this.STORAGE_CARBON_FACTOR

    // 3. Transfer emissions (download/upload impact)
    const transferEmissions = data.fileSize * data.viewCount * this.TRANSFER_CARBON_FACTOR

    // 4. Total emissions
    const totalEmissions = renderingEmissions + storageEmissions + transferEmissions

    // 5. Sustainability scoring (0-100)
    let score = 100
    if (data.triangles > 100000) score -= 20
    if (data.textureMemory > 50) score -= 15
    if (data.fileSize > 10) score -= 15
    if (totalEmissions > 100) score -= 20
    if (totalEmissions > 500) score -= 20

    const sustainabilityScore = Math.max(0, score)

    // 6. Rating system
    let rating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
    if (sustainabilityScore >= 90) rating = 'A+'
    else if (sustainabilityScore >= 80) rating = 'A'
    else if (sustainabilityScore >= 70) rating = 'B'
    else if (sustainabilityScore >= 60) rating = 'C'
    else if (sustainabilityScore >= 50) rating = 'D'
    else rating = 'F'

    // 7. Recommendations
    const recommendations: string[] = []
    if (data.triangles > 100000) {
      recommendations.push('Reduce polygon count to lower GPU energy consumption')
    }
    if (data.textureMemory > 50) {
      recommendations.push('Compress textures to reduce storage and transfer emissions')
    }
    if (data.fileSize > 10) {
      recommendations.push('Optimize model size to reduce cloud storage impact')
    }
    if (totalEmissions > 100) {
      recommendations.push('Consider using LOD (Level of Detail) for better efficiency')
    }
    if (rating === 'F' || rating === 'D') {
      recommendations.push('Model needs significant optimization for sustainability')
    }

    return {
      renderingEmissions: Math.round(renderingEmissions * 100) / 100,
      storageEmissions: Math.round(storageEmissions * 100) / 100,
      transferEmissions: Math.round(transferEmissions * 100) / 100,
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      sustainabilityScore,
      rating,
      recommendations
    }
  }

  static getEmissionComparison(emissions: number) {
    // Fun comparisons for context
    const comparisons = [
      { threshold: 1, text: 'Less than charging a smartphone for 1 hour' },
      { threshold: 10, text: 'Equivalent to a 5-minute car ride' },
      { threshold: 50, text: 'Same as boiling water for tea 10 times' },
      { threshold: 100, text: 'Like watching Netflix for 2 hours' },
      { threshold: 500, text: 'Equivalent to a 50km car journey' },
      { threshold: 1000, text: 'Same as a short domestic flight' }
    ]

    for (const comp of comparisons) {
      if (emissions <= comp.threshold) {
        return comp.text
      }
    }
    return 'Significant environmental impact - optimization needed'
  }

  static getCarbonSavingTips() {
    return [
      'Use texture atlases instead of multiple small textures',
      'Implement LOD (Level of Detail) for complex models',
      'Compress textures using modern formats (WebP, AVIF)',
      'Remove unnecessary geometry and hidden faces',
      'Use instancing for repeated objects',
      'Optimize materials to reduce shader complexity',
      'Enable GPU-based occlusion culling',
      'Use progressive loading for large models'
    ]
  }
}

export type { CarbonMetrics, ModelData }