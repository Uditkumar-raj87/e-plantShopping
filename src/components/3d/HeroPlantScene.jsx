import { Environment, OrbitControls, ContactShadows, Html } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import ProceduralPlant from "./ProceduralPlant";

function HeroPlant() {
  const groupRef = useRef(null);
  const { viewport, mouse } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mouse.x * 0.16 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x += (-mouse.y * 0.08 - groupRef.current.rotation.x) * 0.04;
    groupRef.current.position.x = Math.min(viewport.width * 0.04, 0.28);
  });

  return (
    <group ref={groupRef} scale={viewport.width < 5 ? 0.75 : 0.95}>
      <ProceduralPlant showAnnotations />
    </group>
  );
}

function PlantSkeletonLoader() {
  return (
    <Html center>
      <div className="plant-skeleton-loader" aria-label="Loading 3D plant" />
    </Html>
  );
}

export default function HeroPlantScene() {
  return (
    <div className="hero-plant-scene" aria-label="Interactive 3D houseplant">
      <Canvas shadows dpr={[1, 1.5]} gl={{ powerPreference: "high-performance" }} camera={{ position: [0, 0.8, 7], fov: 38 }}>
        <Suspense fallback={<PlantSkeletonLoader />}>
          <ambientLight intensity={1.2} color="#f7f1dc" />
          <directionalLight position={[3, 5, 4]} intensity={3.2} color="#fff1c7" castShadow shadow-mapSize={[1024, 1024]} />
          <pointLight position={[-3, 1, 3]} intensity={1.5} color="#9fd4b3" />
          <HeroPlant />
          <ContactShadows position={[0, -1.55, 0]} opacity={0.36} scale={4.5} blur={2.5} far={4} />
          <Environment preset="studio" />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}