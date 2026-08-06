import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/** Generates a random star field with optional color tinting */
function StarField({ count = 4000, color = '#ffffff' }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.5 + Math.random() * 2.5;
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.03;
      ref.current.rotation.y -= delta * 0.04;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.003}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

/** Nebula / color dust cloud */
function NebulaCloud({ count = 600, color, offset }: {
  count?: number;
  color: string;
  offset: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 1.2 + offset[0];
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.8 + offset[1];
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.8 + offset[2];
    }
    return arr;
  }, [count, offset]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.012;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

/** Scene wrapper for the full galaxy */
function GalaxyScene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <StarField count={5000} color="#ffffff" />
      <StarField count={1000} color="#a0d4ff" />
      <NebulaCloud count={700} color="#00d4ff" offset={[0.6, 0.2, -0.5]} />
      <NebulaCloud count={500} color="#a855f7" offset={[-0.8, -0.3, 0.2]} />
      <NebulaCloud count={400} color="#06ffd4" offset={[0.1, 0.8, -0.3]} />
    </>
  );
}

interface GalaxyCanvasProps {
  className?: string;
}

/**
 * Full-screen interactive galaxy background using WebGL.
 * Renders with a fixed z-index so it sits behind all UI.
 */
export default function GalaxyCanvas({ className = '' }: GalaxyCanvasProps) {
  // Check for reduced-motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return (
      <div
        className={className}
        style={{
          background: 'radial-gradient(ellipse at center, #040714 0%, #02040e 100%)',
        }}
      />
    );
  }

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
      >
        <GalaxyScene />
      </Canvas>
    </div>
  );
}
