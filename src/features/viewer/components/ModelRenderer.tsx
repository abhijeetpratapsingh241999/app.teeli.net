"use client";

import { Center, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

interface ModelRendererProps {
  fileUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [url]);

  return <primitive object={scene} />;
}

export default function ModelRenderer({ fileUrl }: ModelRendererProps) {
  return (
    <Center>
      <Model url={fileUrl} />
    </Center>
  );
}
