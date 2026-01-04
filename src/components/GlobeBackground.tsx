import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Generate latitude/longitude lines for wireframe globe
const generateGlobeLines = () => {
  const lines: THREE.Vector3[][] = [];
  const radius = 2;
  const segments = 64;

  // Latitude lines (horizontal circles)
  for (let lat = -80; lat <= 80; lat += 20) {
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

  // Longitude lines (vertical circles)
  for (let lon = 0; lon < 360; lon += 20) {
    const points: THREE.Vector3[] = [];
    const lonRad = (lon * Math.PI) / 180;

    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * Math.PI - Math.PI / 2;
      const x = radius * Math.cos(lat) * Math.cos(lonRad);
      const y = radius * Math.sin(lat);
      const z = radius * Math.cos(lat) * Math.sin(lonRad);
      points.push(new THREE.Vector3(x, y, z));
    }
    lines.push(points);
  }

  return lines;
};

// Simplified continent outlines (major landmasses approximation)
const generateContinentOutlines = () => {
  const outlines: THREE.Vector3[][] = [];
  const radius = 2.01; // Slightly larger than globe

  // Convert lat/lon to 3D point
  const latLonToPoint = (lat: number, lon: number): THREE.Vector3 => {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
    return new THREE.Vector3(
      radius * Math.cos(latRad) * Math.cos(lonRad),
      radius * Math.sin(latRad),
      radius * Math.cos(latRad) * Math.sin(lonRad)
    );
  };

  // North America (simplified)
  const northAmerica = [
    [60, -140], [70, -160], [70, -140], [60, -110], [50, -125],
    [40, -125], [30, -120], [25, -110], [30, -85], [25, -80],
    [30, -85], [40, -75], [45, -65], [50, -55], [60, -75],
    [55, -85], [60, -95], [55, -110], [60, -140]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(northAmerica);

  // South America (simplified)
  const southAmerica = [
    [10, -75], [5, -80], [-5, -80], [-15, -75], [-25, -70],
    [-40, -65], [-55, -70], [-55, -65], [-45, -65], [-35, -55],
    [-25, -45], [-10, -35], [0, -50], [5, -60], [10, -75]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(southAmerica);

  // Europe (simplified)
  const europe = [
    [70, 25], [60, 10], [55, -5], [45, -10], [35, -10],
    [35, 0], [40, 5], [45, 10], [40, 20], [35, 25],
    [40, 30], [45, 35], [50, 40], [55, 40], [60, 30],
    [65, 25], [70, 25]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(europe);

  // Africa (simplified)
  const africa = [
    [35, -5], [30, 10], [20, 15], [10, 45], [0, 45],
    [-10, 40], [-25, 45], [-35, 20], [-35, 15], [-25, 15],
    [-15, 10], [-5, 10], [5, -5], [15, -15], [25, -15],
    [35, -5]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(africa);

  // Asia (simplified)
  const asia = [
    [70, 180], [65, 140], [55, 135], [45, 140], [35, 130],
    [25, 120], [20, 110], [10, 105], [5, 100], [-5, 105],
    [-10, 120], [0, 130], [5, 125], [10, 125], [20, 120],
    [25, 125], [30, 130], [40, 130], [45, 150], [55, 160],
    [60, 170], [70, 180]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(asia);

  // Australia (simplified)
  const australia = [
    [-15, 130], [-20, 115], [-25, 115], [-35, 140], [-40, 145],
    [-35, 150], [-25, 155], [-15, 145], [-10, 145], [-15, 130]
  ].map(([lat, lon]) => latLonToPoint(lat, lon));
  outlines.push(australia);

  return outlines;
};

const WireframeGlobe = () => {
  const groupRef = useRef<THREE.Group>(null);
  const globeLines = generateGlobeLines();
  const continentOutlines = generateContinentOutlines();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main wireframe sphere */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial
          color="#00ff00"
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>

      {/* Lat/Lon grid lines */}
      {globeLines.map((points, index) => (
        <Line
          key={`grid-${index}`}
          points={points}
          color="#00ff00"
          lineWidth={0.5}
          transparent
          opacity={0.15}
        />
      ))}

      {/* Continent outlines */}
      {continentOutlines.map((points, index) => (
        <Line
          key={`continent-${index}`}
          points={points}
          color="#00ff00"
          lineWidth={1.5}
          transparent
          opacity={0.4}
        />
      ))}

      {/* Inner glow sphere */}
      <Sphere args={[1.95, 16, 16]}>
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.02}
        />
      </Sphere>

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.01, 8, 64]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

// Floating data points
const DataPoints = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -clock.getElapsedTime() * 0.03;
    }
  });

  const points = Array.from({ length: 20 }, (_, i) => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 2.1 + Math.random() * 0.2;
    return new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
  });

  return (
    <group ref={groupRef}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.02 + Math.random() * 0.02, 8, 8]} />
          <meshBasicMaterial 
            color={i % 3 === 0 ? "#00ffff" : "#00ff00"} 
            transparent 
            opacity={0.6 + Math.random() * 0.4} 
          />
        </mesh>
      ))}
    </group>
  );
};

const GlobeBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <WireframeGlobe />
        <DataPoints />
      </Canvas>
    </div>
  );
};

export default GlobeBackground;