import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/CartSlice";
import ProceduralPlant from "./ProceduralPlant";

const POT_OPTIONS = [
  { name: "Matte White", color: "#f0eee5" },
  { name: "Terracotta", color: "#bd6c4d" },
  { name: "Slate Charcoal", color: "#38413f" },
  { name: "Sage Green", color: "#8fa997" }
];

function WaterMist({ active }) {
  const pointsRef = useRef(null);
  const particles = useRef(Array.from({ length: 28 }, (_, index) => ({
    x: ((index * 17) % 10 - 5) / 30,
    y: 0.85 + (index % 5) * 0.1,
    z: ((index * 11) % 10 - 5) / 35,
    life: index / 28
  })));

  useEffect(() => {
    if (active) particles.current.forEach((particle, index) => { particle.life = index / 28; });
  }, [active]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    particles.current.forEach((particle) => {
      particle.y -= delta * 0.38;
      particle.life += delta * 0.8;
      if (particle.life > 1) {
        particle.y = 0.85;
        particle.life = 0;
      }
    });
    particles.current.forEach((particle, index) => {
      pointsRef.current.geometry.attributes.position.setXYZ(index, particle.x, particle.y, particle.z);
    });
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const positions = particles.current.flatMap((particle) => [particle.x, particle.y, particle.z]);
  return (
    <points ref={pointsRef} visible={active}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.current.length} array={new Float32Array(positions)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#9fd9e8" size={0.055} transparent opacity={0.72} />
    </points>
  );
}

export default function PlantInspectorModal({ plant, onClose }) {
  const dispatch = useDispatch();
  const [potColor, setPotColor] = useState(POT_OPTIONS[0].color);
  const [nightMode, setNightMode] = useState(false);
  const [watered, setWatered] = useState(false);

  if (!plant) return null;

  const addPlant = () => dispatch(addItem(plant));

  return (
    <div className="inspector-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="inspector-modal" role="dialog" aria-modal="true" aria-labelledby="inspector-title">
        <button type="button" className="inspector-close" onClick={onClose} aria-label="Close 3D inspector">x</button>
        <div className={`inspector-canvas ${nightMode ? "is-night" : ""}`}>
          <Canvas shadows dpr={[1, 1.75]} camera={{ position: [0, 0.8, 6], fov: 42 }}>
            <ambientLight intensity={nightMode ? 0.25 : 1.1} color={nightMode ? "#819ad2" : "#fff3d4"} />
            <directionalLight position={[3, 4, 3]} intensity={nightMode ? 0.8 : 2.8} color={nightMode ? "#9eafff" : "#fff0c4"} castShadow />
            <ProceduralPlant potColor={potColor} />
            <WaterMist active={watered} />
            <ContactShadows position={[0, -1.55, 0]} opacity={0.4} scale={4} blur={2.5} far={4} />
            <Environment preset="studio" />
            <OrbitControls minDistance={4} maxDistance={8} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI / 1.65} />
          </Canvas>
        </div>
        <div className="inspector-details">
          <p className="section-kicker">Plant Inspector</p>
          <h2 id="inspector-title">{plant.name}</h2>
          <p>Rotate the plant, tune its pot, and preview its care mood before adding it to your collection.</p>
          <div className="inspector-control">
            <span>Pot finish</span>
            <div className="pot-options">
              {POT_OPTIONS.map((option) => (
                <button key={option.name} type="button" className={potColor === option.color ? "selected" : ""} onClick={() => setPotColor(option.color)}>
                  <span className="pot-swatch" style={{ background: option.color }} />
                  {option.name}
                </button>
              ))}
            </div>
          </div>
          <div className="inspector-actions">
            <button type="button" className="outline-button" onClick={() => setNightMode((value) => !value)}>{nightMode ? "Daylight" : "Night light"}</button>
            <button type="button" className="outline-button" onClick={() => { setWatered(true); window.setTimeout(() => setWatered(false), 1300); }}>Water plant</button>
            <button type="button" className="cta-button small" onClick={addPlant}>Add to cart - ${plant.price.toFixed(2)}</button>
          </div>
        </div>
      </section>
    </div>
  );
}