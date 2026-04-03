import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  Color,
  type Group,
  type IcosahedronGeometry,
  type Mesh,
  type MeshPhysicalMaterial,
  type MeshStandardMaterial,
  type TorusGeometry,
} from "three";

import { useExperienceStore, type GatewayId } from "@/store/experienceStore";

const palette: Record<GatewayId, string> = {
  cyrus: "#f6f2ec",
  alpha: "#d8e7ef",
  corporate: "#ebe5db",
  lab: "#d0d4ff",
};

function GlassCluster() {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh<IcosahedronGeometry, MeshPhysicalMaterial>>(null);
  const accentRef = useRef<Mesh<TorusGeometry, MeshStandardMaterial>>(null);
  const activeGateway = useExperienceStore((state) => state.activeGateway);
  const tone = useMemo(() => new Color(palette[activeGateway]), [activeGateway]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.22;
      groupRef.current.rotation.x = Math.sin(elapsed * 0.28) * 0.18;
    }

    if (coreRef.current?.material) {
      coreRef.current.material.color.lerp(tone, 0.08);
    }

    if (accentRef.current?.material) {
      accentRef.current.material.color.lerp(tone, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} floatIntensity={0.7} rotationIntensity={0.4}>
        <mesh ref={coreRef} position={[0.25, 0, 0]}>
          <icosahedronGeometry args={[1.65, 1]} />
          <MeshTransmissionMaterial
            color={palette[activeGateway]}
            roughness={0.1}
            thickness={1.1}
            transmission={0.98}
            chromaticAberration={0.12}
            anisotropy={0.24}
            distortion={0.16}
            temporalDistortion={0.08}
            ior={1.38}
          />
        </mesh>
      </Float>

      <mesh ref={accentRef} position={[-1.8, 0.9, -0.8]}>
        <torusGeometry args={[0.72, 0.18, 32, 90]} />
        <meshStandardMaterial color={palette[activeGateway]} metalness={0.95} roughness={0.18} />
      </mesh>

      <mesh position={[1.9, -1.1, -0.65]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#f8f5f0" metalness={1} roughness={0.12} />
      </mesh>
    </group>
  );
}

export default function HeroOrbitalScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.4], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 4, 6]} intensity={2.8} />
      <pointLight position={[-5, -2, 4]} intensity={3.2} color="#f7f2ea" />
      <GlassCluster />
    </Canvas>
  );
}
