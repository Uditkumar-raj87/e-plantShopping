import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

function FloatingCluster() {
  const groupRef = useRef(null);

  const items = useMemo(
    () => [
      { key: "a", pos: [-3.8, 1.9, -2.1], scale: 0.62, color: "#e3b351" },
      { key: "b", pos: [-2.2, -1.3, -1.4], scale: 0.72, color: "#2a6c5b" },
      { key: "c", pos: [-0.9, 2.7, -2.7], scale: 0.55, color: "#f1d08c" },
      { key: "d", pos: [1.2, -2.3, -1.7], scale: 0.8, color: "#1d5a4c" },
      { key: "e", pos: [3.2, 1.2, -2.4], scale: 0.74, color: "#d39b2e" },
      { key: "f", pos: [2.6, -1.2, -1.1], scale: 0.65, color: "#7ea690" },
      { key: "g", pos: [0.3, 0.3, -3.1], scale: 0.9, color: "#295f50" }
    ],
    []
  );

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.06;
  });

  return (
    <group ref={groupRef}>
      {items.map((item, index) => (
        <Float
          key={item.key}
          speed={0.9 + (index % 3) * 0.25}
          rotationIntensity={0.45}
          floatIntensity={1.2}
        >
          <mesh position={item.pos} scale={item.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={item.color}
              roughness={0.25}
              metalness={0.15}
              transparent
              opacity={0.78}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function BackgroundScene() {
  return (
    <div className="scene-background" aria-hidden="true">
      <Canvas className="scene-canvas" camera={{ position: [0, 0, 7], fov: 52 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <pointLight position={[3, 2, 5]} intensity={1.1} color="#ffe0a8" />
          <pointLight position={[-5, -1, 4]} intensity={0.75} color="#b7efdb" />
          <FloatingCluster />
        </Suspense>
      </Canvas>
    </div>
  );
}