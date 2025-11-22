"use client";

import { EffectComposer, SSAO, Bloom, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useViewerStore } from "../store/useViewerStore";

export default function Effects() {
  const enableEffects = useViewerStore((state) => state.enableEffects);

  if (!enableEffects) return null;

  return (
    <EffectComposer>
      <SSAO 
        radius={0.1} 
        intensity={15} 
        luminanceInfluence={0.5}
      />
      <Bloom 
        luminanceThreshold={1} 
        intensity={0.8} 
        mipmapBlur 
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette 
        darkness={0.4} 
      />
    </EffectComposer>
  );
}
