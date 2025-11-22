import { Html } from "@react-three/drei";

export default function LoadingState() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-zinc-900/90 backdrop-blur-lg border border-zinc-800">
        <div className="size-12 border-4 border-zinc-600 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-white font-medium">Loading Model...</p>
      </div>
    </Html>
  );
}
