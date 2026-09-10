import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const LEAVES = [
  { position: [-0.58, 1.85, 0.05], rotation: [0.2, 0.2, -0.65], scale: [0.72, 0.16, 0.32] },
  { position: [0.48, 2.05, 0.02], rotation: [-0.15, -0.3, 0.62], scale: [0.78, 0.17, 0.34] },
  { position: [-0.72, 2.52, -0.02], rotation: [0.15, 0.3, -0.8], scale: [0.7, 0.15, 0.3] },
  { position: [0.66, 2.72, 0.02], rotation: [-0.15, -0.2, 0.76], scale: [0.72, 0.16, 0.32] },
  { position: [-0.42, 3.12, 0.03], rotation: [0.1, 0.15, -0.55], scale: [0.7, 0.15, 0.3] },
  { position: [0.32, 3.42, 0], rotation: [-0.1, -0.15, 0.55], scale: [0.65, 0.14, 0.28] },
  { position: [0, 3.82, 0.02], rotation: [0, 0, 0.08], scale: [0.7, 0.15, 0.3] }
];

function Leaf({ leaf, index }) {
  const leafRef = useRef(null);

  useFrame((state) => {
    if (leafRef.current) {
      const sway = Math.sin(state.clock.elapsedTime * 0.85 + index * 0.35) * 0.12;
      leafRef.current.rotation.x = leaf.rotation[0] + sway * 0.16;
      leafRef.current.rotation.z = leaf.rotation[2] + sway * (0.18 + index * 0.015);
    }
  });

  return (
    <mesh
      ref={leafRef}
      position={leaf.position}
      rotation={leaf.rotation}
      scale={leaf.scale}
    >
      <sphereGeometry args={[1, 20, 12]} />
      <meshStandardMaterial color={index % 3 === 0 ? "#8ebd77" : "#477d59"} roughness={0.72} />
    </mesh>
  );
}

function Annotation({ position, title, detail }) {
  return (
    <Html position={position} center distanceFactor={7}>
      <div className="plant-annotation">
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </Html>
  );
}

export default function ProceduralPlant({ potColor = "#f0eee5", showAnnotations = false }) {
  const plantRef = useRef(null);
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (plantRef.current) {
      plantRef.current.rotation.z = Math.sin(time * 0.42) * 0.018;
      plantRef.current.rotation.y = Math.sin(time * 0.28) * 0.025;
    }
  });

  return (
    <group ref={plantRef}>
      <mesh position={[0, -1.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.92, 0.72, 1.05, 48]} />
        <meshStandardMaterial color={potColor} roughness={0.3} metalness={0.03} />
      </mesh>
      <mesh position={[0, -0.48, 0]} receiveShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 48]} />
        <meshStandardMaterial color="#33271f" roughness={1} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 2.15, 12]} />
        <meshStandardMaterial color="#4b6b42" roughness={0.85} />
      </mesh>
      <mesh position={[-0.16, 0.17, 0.02]} rotation={[0, 0, -0.08]}>
        <cylinderGeometry args={[0.045, 0.07, 2.2, 12]} />
        <meshStandardMaterial color="#557847" roughness={0.85} />
      </mesh>
      {LEAVES.map((leaf, index) => (
        <Leaf key={index} leaf={leaf} index={index} />
      ))}
      {showAnnotations && (
        <>
          <Annotation position={[-1.3, 2.8, 0]} title="Air Purifying" detail="Freshens your space" />
          <Annotation position={[1.35, 2, 0]} title="Low Maintenance" detail="Thrives in soft light" />
          <Annotation position={[1.2, 0.8, 0]} title="Weekly Watering" detail="A simple care rhythm" />
        </>
      )}
    </group>
  );
}