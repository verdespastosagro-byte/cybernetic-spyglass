import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Generate latitude/longitude lines
const generateGlobeLines = () => {
  const lines: THREE.Vector3[][] = [];
  const radius = 1;
  const segments = 32;

  for (let lat = -60; lat <= 60; lat += 30) {
    const points: THREE.Vector3[] = [];
    const latRad = (lat * Math.PI) / 180;
    const r = radius * Math.cos(latRad);
    const y = radius * Math.sin(latRad);

    for (let i = 0; i <= segments; i++) {
      const lon = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(r * Math.cos(lon), y, r * Math.sin(lon)));
    }
    lines.push(points);
  }

  for (let lon = 0; lon < 360; lon += 30) {
    const points: THREE.Vector3[] = [];
    const lonRad = (lon * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * Math.PI - Math.PI / 2;
      points.push(new THREE.Vector3(
        radius * Math.cos(lat) * Math.cos(lonRad),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lonRad)
      ));
    }
    lines.push(points);
  }

  return lines;
};

const MiniGlobe = () => {
  const groupRef = useRef<THREE.Group>(null);
  const globeLines = generateGlobeLines();
  const blinkRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
    if (blinkRef.current && blinkRef.current.material) {
      const material = blinkRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 4) * 0.5;
    }
  });

  // Current location point (São Paulo area)
  const locationPoint = new THREE.Vector3(
    1.02 * Math.cos(-23.5 * Math.PI / 180) * Math.cos(-46.6 * Math.PI / 180),
    1.02 * Math.sin(-23.5 * Math.PI / 180),
    1.02 * Math.cos(-23.5 * Math.PI / 180) * Math.sin(-46.6 * Math.PI / 180)
  );

  return (
    <group ref={groupRef}>
      <Sphere args={[1, 16, 16]}>
        <meshBasicMaterial color="#00ff41" wireframe transparent opacity={0.2} />
      </Sphere>

      {globeLines.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#00ff41"
          lineWidth={0.5}
          transparent
          opacity={0.4}
        />
      ))}

      {/* Blinking location point */}
      <mesh ref={blinkRef} position={locationPoint}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ff0000" transparent opacity={1} />
      </mesh>
    </group>
  );
};

const MiniGlobeWidget = () => {
  return (
    <div className="w-full aspect-square bg-background/50 border border-border">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <MiniGlobe />
      </Canvas>
    </div>
  );
};

export default MiniGlobeWidget;