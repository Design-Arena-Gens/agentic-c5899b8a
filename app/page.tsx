"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import {
  Float,
  OrbitControls,
  Environment,
  SpotLight,
  PerspectiveCamera,
  ContactShadows
} from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";
import { Color, DoubleSide, ExtrudeGeometry, Mesh, Shape, Vector2 } from "three";

function DiamondTower({ height }: { height: number }) {
  const geometry = useMemo(() => {
    const base = new Shape();
    const points: Vector2[] = [
      new Vector2(0, 2),
      new Vector2(1.5, 1.2),
      new Vector2(1.9, -0.3),
      new Vector2(1.1, -2),
      new Vector2(-1.1, -2),
      new Vector2(-1.9, -0.3),
      new Vector2(-1.5, 1.2)
    ];
    base.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((point) => base.lineTo(point.x, point.y));
    base.lineTo(points[0].x, points[0].y);

    const extrudeSettings = {
      depth: height,
      bevelEnabled: true,
      bevelThickness: 0.35,
      bevelSize: 0.55,
      bevelSegments: 6,
      steps: 1
    };

    const geom = new ExtrudeGeometry(base, extrudeSettings);
    geom.center();
    geom.rotateX(Math.PI / 2);
    return geom;
  }, [height]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow rotation={[0, Math.PI / 8, 0]}>
      <meshStandardMaterial
        color={new Color("#9fd4ff")}
        roughness={0.05}
        metalness={0.9}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function Plaza() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color="#0c1626" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <ringGeometry args={[8, 9, 64]} />
        <meshStandardMaterial color="#082545" roughness={0.4} metalness={0.5} side={DoubleSide} />
      </mesh>
    </group>
  );
}

function DiamondCenter() {
  return (
    <group position={[0, 0.8, 0]}>
      <Float speed={2.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <DiamondTower height={22} />
      </Float>
      <group position={[0, -2.2, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.6, 3.8, 6]} />
          <meshStandardMaterial color="#112b4b" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
      <group position={[0, -4.5, 0]}>
        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[5.8, 6, 12]} />
            <meshStandardMaterial color="#14365f" metalness={0.8} roughness={0.3} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

function CinematicLights() {
  return (
    <group>
      <color attach="background" args={["#040811"]} />
      <fog attach="fog" args={["#040811", 20, 200]} />
      <directionalLight
        position={[20, 40, 20]}
        intensity={2.2}
        color="#b9d7ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-30, 10, -10]} intensity={0.6} color="#1b2557" />
      <pointLight position={[0, 10, 0]} intensity={0.8} color="#4578ff" />
      <SpotLight
        position={[0, 18, 12]}
        angle={0.6}
        penumbra={0.6}
        distance={90}
        attenuation={6}
        anglePower={1.5}
        intensity={1.4}
        color="#9fc8ff"
      />
    </group>
  );
}

function FloatingSparks() {
  const sparks = useMemo(() => Array.from({ length: 120 }, (_, i) => i), []);
  return (
    <group>
      {sparks.map((key) => (
        <mesh key={key} position={[Math.random() * 40 - 20, Math.random() * 15 + 1, Math.random() * 40 - 20]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#9ad2ff" />
        </mesh>
      ))}
    </group>
  );
}

function HeroOverlay() {
  return (
    <div className="overlay">
      <div className="panel">
        <span className="tag">Antwerp, Belgium</span>
        <h1>Diamond Center</h1>
        <p>
          A cinematic interpretation of the landmark at the heart of the Antwerp diamond district.
          Faceted glass meets urban light to create a luminous beacon over the city skyline.
        </p>
      </div>
      <div className="credits">
        <span>Visualized with React · Three.js · GLSL</span>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main className="scene">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[18, 12, 26]} fov={45} near={0.1} far={200} />
          <OrbitControls
            enablePan={false}
            minDistance={15}
            maxDistance={40}
            minPolarAngle={Math.PI / 3.5}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.55}
          />
          <CinematicLights />
          <Environment preset="city" background={false} blur={0.8} />
          <DiamondCenter />
          <Plaza />
          <FloatingSparks />
          <ContactShadows
            frames={1}
            position={[0, -2.2, 0]}
            opacity={0.55}
            scale={22}
            blur={3.5}
            far={15}
          />
          <EffectComposer multisampling={2}>
            <Bloom intensity={0.8} luminanceThreshold={0.2} luminanceSmoothing={0.4} />
            <DepthOfField focusDistance={0.01} focalLength={0.018} bokehScale={5} />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <HeroOverlay />
    </main>
  );
}
