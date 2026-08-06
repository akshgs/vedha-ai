import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Ring, Billboard, Text, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

interface FloatingSymbolProps {
  symbol: string;
  position: [number, number, number];
  speed: number;
  scrollProgress: number;
}

function FloatingSymbol({ symbol, position, speed, scrollProgress }: FloatingSymbolProps) {
  const ref = useRef<THREE.Group>(null!);

  // Emit symbols upward as scroll progresses
  useFrame(() => {
    if (ref.current) {
      // Calculate float offset based on scroll progress
      const scrollOffset = scrollProgress * 15 * speed;
      ref.current.position.y = position[1] + scrollOffset;
      ref.current.position.x = position[0] + Math.sin(Date.now() * 0.001 * speed + position[2]) * 0.2;
      
      // Fade out as they go higher
      const opacity = Math.max(0, 1 - (scrollOffset / 10));
      const textMaterial = ref.current.children[0] as any;
      if (textMaterial && textMaterial.material) {
        textMaterial.material.opacity = opacity * (scrollProgress > 0.05 ? 1 : 0);
        textMaterial.material.transparent = true;
      }
    }
  });

  return (
    <group ref={ref} position={position}>
      <Text fontSize={0.25} color="#fb923c">
        {symbol}
      </Text>
    </group>
  );
}

function AncientCyberBook({ scrollProgress }: { scrollProgress: number }) {
  const leftCoverRef = useRef<THREE.Group>(null!);
  const rightCoverRef = useRef<THREE.Group>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Book dimensions
  const width = 1.4;
  const height = 1.8;
  const thickness = 0.06;

  // Open the book based on scroll progress (0.0 to 0.25)
  const openProgress = Math.min(1, scrollProgress / 0.22);
  const angle = (openProgress * Math.PI) / 2; // open up to 90 degrees each side

  useFrame(() => {
    if (leftCoverRef.current && rightCoverRef.current) {
      // Left cover rotates counter-clockwise around hinge (Y axis at center)
      leftCoverRef.current.rotation.y = angle;
      // Right cover rotates clockwise
      rightCoverRef.current.rotation.y = -angle;
    }

    if (lightRef.current) {
      // Light glows as book opens, then dims as we enter portal
      if (scrollProgress < 0.22) {
        lightRef.current.intensity = openProgress * 8;
      } else if (scrollProgress < 0.45) {
        // Fade light during camera plunge
        const fade = (0.45 - scrollProgress) / 0.23;
        lightRef.current.intensity = Math.max(0, fade * 8);
      } else {
        lightRef.current.intensity = 0;
      }
    }

    if (groupRef.current) {
      // Slow float
      groupRef.current.position.y = Math.sin(Date.now() * 0.001) * 0.1;
      
      // Fade out entire book as camera enters portal (0.25 to 0.45)
      if (scrollProgress >= 0.22) {
        const fadeProgress = Math.max(0, 1 - (scrollProgress - 0.22) / 0.2);
        groupRef.current.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = fadeProgress;
          }
        });
      } else {
        groupRef.current.traverse((child: any) => {
          if (child.isMesh && child.material) {
            child.material.opacity = 1;
          }
        });
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Light Source inside pages */}
      <pointLight ref={lightRef} color="#fb923c" intensity={0} distance={5} />

      {/* LEFT HALF (Cover + Pages) */}
      <group ref={leftCoverRef} position={[-width / 2, 0, 0]}>
        {/* Hinge position offset */}
        <group position={[width / 2, 0, 0]}>
          {/* Cover */}
          <mesh position={[-width / 2, 0, -thickness / 2]}>
            <boxGeometry args={[width, height, thickness]} />
            <meshStandardMaterial color="#2d1d10" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* Cover golden circuit decorations */}
          <mesh position={[-width / 2, 0, -thickness / 2 + 0.035]}>
            <boxGeometry args={[width * 0.9, height * 0.9, 0.005]} />
            <meshStandardMaterial color="#fb923c" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Pages block */}
          <mesh position={[-width / 2 + 0.02, 0, thickness / 2]}>
            <boxGeometry args={[width - 0.04, height - 0.08, thickness * 1.5]} />
            <meshStandardMaterial color="#f7ecd0" roughness={0.9} />
          </mesh>
        </group>
      </group>

      {/* RIGHT HALF (Cover + Pages) */}
      <group ref={rightCoverRef} position={[width / 2, 0, 0]}>
        <group position={[-width / 2, 0, 0]}>
          {/* Cover */}
          <mesh position={[width / 2, 0, -thickness / 2]}>
            <boxGeometry args={[width, height, thickness]} />
            <meshStandardMaterial color="#2d1d10" roughness={0.7} metalness={0.1} />
          </mesh>
          {/* Cover golden circuit decorations */}
          <mesh position={[width / 2, 0, -thickness / 2 + 0.035]}>
            <boxGeometry args={[width * 0.9, height * 0.9, 0.005]} />
            <meshStandardMaterial color="#fb923c" roughness={0.3} metalness={0.9} />
          </mesh>
          {/* Pages block */}
          <mesh position={[width / 2 - 0.02, 0, thickness / 2]}>
            <boxGeometry args={[width - 0.04, height - 0.08, thickness * 1.5]} />
            <meshStandardMaterial color="#f7ecd0" roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Constellation forming "VEDHA AI" letters
function LogoConstellation({ scrollProgress }: { scrollProgress: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Fade logo in at scroll > 0.8
  const logoProgress = Math.max(0, Math.min(1, (scrollProgress - 0.82) / 0.15));

  useFrame(() => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as any;
      if (mat) {
        mat.opacity = logoProgress;
        mat.transparent = true;
      }
      pointsRef.current.rotation.y = Math.sin(Date.now() * 0.0002) * 0.1;
    }
  });

  // Position points in letters shape: V, E, D, H, A, A, I
  const logoPositions = useMemo(() => {
    const pts: number[] = [];
    
    const drawLine = (x1: number, y1: number, x2: number, y2: number, count = 12) => {
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        pts.push(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 0);
      }
    };

    // Draw V (left -2.5)
    drawLine(-2.5, 0.8, -2.1, -0.4);
    drawLine(-2.1, -0.4, -1.7, 0.8);

    // Draw E (left -1.4)
    drawLine(-1.4, 0.8, -1.4, -0.4);
    drawLine(-1.4, 0.8, -0.9, 0.8, 6);
    drawLine(-1.4, 0.2, -1.0, 0.2, 5);
    drawLine(-1.4, -0.4, -0.9, -0.4, 6);

    // Draw D (left -0.6)
    drawLine(-0.6, 0.8, -0.6, -0.4);
    drawLine(-0.6, 0.8, -0.1, 0.5, 6);
    drawLine(-0.1, 0.5, -0.1, -0.1, 8);
    drawLine(-0.1, -0.1, -0.6, -0.4, 6);

    // Draw H (left 0.2)
    drawLine(0.2, 0.8, 0.2, -0.4);
    drawLine(0.2, 0.2, 0.7, 0.2, 6);
    drawLine(0.7, 0.8, 0.7, -0.4);

    // Draw A (left 1.0)
    drawLine(1.0, -0.4, 1.4, 0.8);
    drawLine(1.4, 0.8, 1.8, -0.4);
    drawLine(1.2, 0.1, 1.6, 0.1, 5);

    // Draw I (left 2.1)
    drawLine(2.1, 0.8, 2.5, 0.8, 5);
    drawLine(2.3, 0.8, 2.3, -0.4);
    drawLine(2.1, -0.4, 2.5, -0.4, 5);

    return new Float32Array(pts);
  }, []);

  return (
    <group position={[0, 1.8, -1.5]}>
      <Points ref={pointsRef} positions={logoPositions} stride={3}>
        <PointMaterial color="#00d4ff" size={0.065} sizeAttenuation depthWrite={false} opacity={0} />
      </Points>
    </group>
  );
}

/** Orbit track helper */
function OrbitTrack({ radius }: { radius: number }) {
  return (
    <Ring args={[radius - 0.005, radius + 0.005, 64]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.03} />
    </Ring>
  );
}

/** Orbiting planet inside the final stage */
function OrbitingPlanet({
  label, icon, color, orbitRadius, orbitSpeed, angle, size
}: {
  label: string;
  icon: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  size: number;
}) {
  const ref = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * orbitSpeed;
    }
  });

  return (
    <group ref={ref} rotation={[0, angle, 0]}>
      <group position={[orbitRadius, 0, 0]}>
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <Billboard follow position={[0, size + 0.25, 0]}>
          <Text fontSize={0.15} color={color}>
            {`${icon} ${label}`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

export const PLANETS_CONFIG = [
  { label: 'AI Mentor', icon: '🤖', color: '#facc15', orbitRadius: 2.2, orbitSpeed: 0.15, angle: 0, size: 0.15 },
  { label: 'Learning Hub', icon: '📚', color: '#a855f7', orbitRadius: 2.8, orbitSpeed: 0.13, angle: 0.6, size: 0.16 },
  { label: 'Skill Galaxy', icon: '⚡', color: '#4ade80', orbitRadius: 3.4, orbitSpeed: 0.11, angle: 1.2, size: 0.16 },
  { label: 'Resume Analyzer', icon: '📄', color: '#fb923c', orbitRadius: 4.0, orbitSpeed: 0.09, angle: 1.8, size: 0.15 },
  { label: 'Interview Simulator', icon: '🎙️', color: '#f472b6', orbitRadius: 4.6, orbitSpeed: 0.07, angle: 2.4, size: 0.17 },
  { label: 'Career Roadmap', icon: '🗺️', color: '#34d399', orbitRadius: 5.2, orbitSpeed: 0.055, angle: 3.0, size: 0.18 },
  { label: 'Company Explorer', icon: '🏢', color: '#60a5fa', orbitRadius: 5.8, orbitSpeed: 0.042, angle: 3.6, size: 0.18 },
  { label: 'Innovation Lab', icon: '🧪', color: '#a855f7', orbitRadius: 6.4, orbitSpeed: 0.032, angle: 4.2, size: 0.16 },
  { label: 'Research Hub', icon: '🔬', color: '#3b82f6', orbitRadius: 7.0, orbitSpeed: 0.024, angle: 4.8, size: 0.17 },
  { label: 'Live Industry Trends', icon: '⭐', color: '#f87171', orbitRadius: 7.6, orbitSpeed: 0.018, angle: 5.4, size: 0.15 },
  { label: 'Community Hub', icon: '💬', color: '#06ffd4', orbitRadius: 8.2, orbitSpeed: 0.012, angle: 6.0, size: 0.16 }
];

interface CinematicPortalSceneProps {
  scrollProgress: number;
}

function CinematicPortalScene({ scrollProgress }: CinematicPortalSceneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null!);

  // Fade solar system in at scroll > 0.75
  const solarProgress = Math.max(0, Math.min(1, (scrollProgress - 0.72) / 0.15));

  // Particle positions for universe stars
  const starPositions = useMemo(() => {
    const pts = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
      const r = 4 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    return pts;
  }, []);

  // Programming/Mathematical symbols lists
  const symbolList = [
    "Python", "Java", "JavaScript", "C++", "AI", "Machine Learning", 
    "Deep Learning", "NLP", "Cloud", "Cyber Security", "Data Science", 
    "Mathematics", "Algorithms", "Binary", "Neural Networks"
  ];
  const floatingSymbols = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      symbol: symbolList[i % symbolList.length],
      position: [
        (Math.random() - 0.5) * 1.5,
        0.1 + Math.random() * 0.4,
        (Math.random() - 0.5) * 1.5
      ] as [number, number, number],
      speed: 0.4 + Math.random() * 0.6,
      id: i
    }));
  }, []);

  useFrame((_, delta) => {
    // Stage 1 camera behavior: (scroll 0.0 to 0.22)
    // Camera sits in front of the book looking forward
    if (scrollProgress < 0.22) {
      camera.position.x = 0;
      camera.position.y = 1.0;
      camera.position.z = 4.0;
      camera.lookAt(0, 0, 0);
    }
    // Stage 2 camera behavior: portal camera fly-through (scroll 0.22 to 0.45)
    else if (scrollProgress >= 0.22 && scrollProgress < 0.45) {
      const flyProgress = (scrollProgress - 0.22) / 0.23;
      // Fly camera down into center coordinates
      camera.position.x = 0;
      camera.position.y = 1.0 - (flyProgress * 1.0);
      camera.position.z = 4.0 - (flyProgress * 3.9);
      camera.lookAt(0, 0, 0);
    }
    // Stage 3 camera behavior: space scene rotation settle (scroll 0.45 to 1.0)
    else {
      const spaceProgress = (scrollProgress - 0.45) / 0.55;
      camera.position.x = Math.sin(spaceProgress * 0.3) * 2;
      camera.position.y = 2 + spaceProgress * 2;
      camera.position.z = 7 + spaceProgress * 2;
      camera.lookAt(0, 0.4, -1.0);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} />

      {/* Cyber/Tech Tome Book */}
      <AncientCyberBook scrollProgress={scrollProgress} />

      {/* Floating Letters, Symbols, Math Formulae Holograms */}
      {scrollProgress < 0.5 && floatingSymbols.map(sym => (
        <FloatingSymbol
          key={sym.id}
          symbol={sym.symbol}
          position={sym.position}
          speed={sym.speed}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* Universe System revelation */}
      {scrollProgress >= 0.45 && (
        <group ref={groupRef} scale={[solarProgress, solarProgress, solarProgress]}>
          {/* Galaxy background points */}
          <Points positions={starPositions} stride={3}>
            <PointMaterial transparent color="#ffffff" size={0.007} sizeAttenuation depthWrite={false} opacity={0.7} />
          </Points>

          {/* Central sun (Vedha AI Core) */}
          <Sphere args={[0.36, 32, 32]}>
            <meshBasicMaterial color="#00d4ff" />
          </Sphere>
          <pointLight color="#00d4ff" intensity={4} distance={10} />

          {/* Orbiting planets */}
          {PLANETS_CONFIG.map(p => (
            <group key={p.label}>
              <OrbitTrack radius={p.orbitRadius} />
              <OrbitingPlanet {...p} />
            </group>
          ))}
        </group>
      )}

      {/* Logo Constellation at the final zoom out */}
      {scrollProgress >= 0.8 && <LogoConstellation scrollProgress={scrollProgress} />}
    </>
  );
}

export default function CinematicPortal({ scrollProgress }: CinematicPortalSceneProps) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fallback flat canvas gradient when users choose reduced motion
  if (prefersReducedMotion) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: "radial-gradient(ellipse at 50% 50%, #040714 0%, #02040e 100%)",
      }} />
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 1.0, 4.0], fov: 65 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <CinematicPortalScene scrollProgress={scrollProgress} />
    </Canvas>
  );
}
