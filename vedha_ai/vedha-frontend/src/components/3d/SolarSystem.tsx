import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sphere, Ring, Text, Billboard } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';

export interface PlanetConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  emissive: string;
  route: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  initialAngle: number;
  description: string;
  progress?: number; // 0-100
}

interface PlanetProps {
  config: PlanetConfig;
}

function PlanetMesh({ config }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { camera } = useThree();

  // Spring for smooth hover scale
  const { scale } = useSpring({
    scale: hovered ? 1.35 : 1,
    config: { mass: 1, tension: 300, friction: 20 },
  });

  const { emissiveIntensity } = useSpring({
    emissiveIntensity: hovered ? 0.8 : 0.2,
    config: { tension: 200, friction: 30 },
  });

  // Orbit + self-rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * config.orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.05;
      // Gentle float
      meshRef.current.position.y = Math.sin(Date.now() * 0.001 + config.initialAngle) * 0.06;
    }
  });

  function handleClick() {
    if (meshRef.current) {
      // GSAP camera zoom to planet then navigate
      const worldPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(worldPos);
      gsap.to(camera.position, {
        x: worldPos.x * 0.6,
        y: worldPos.y * 0.6,
        z: worldPos.z * 0.6 + 2,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          navigate(config.route);
          // Reset camera
          gsap.to(camera.position, { x: 0, y: 0, z: 8, duration: 0.01 });
        },
      });
    }
  }

  const color = new THREE.Color(config.color);
  const emissiveColor = new THREE.Color(config.emissive);

  return (
    <group ref={groupRef} rotation={[0, config.initialAngle, 0]}>
      {/* Orbit arm — planet sits at orbitRadius on X */}
      <group position={[config.orbitRadius, 0, 0]}>
        {/* @ts-ignore react-spring animated */}
        <animated.mesh
          ref={meshRef}
          scale={scale}
          onClick={handleClick}
          onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
          castShadow
        >
          <sphereGeometry args={[config.size, 32, 32]} />
          {/* @ts-ignore */}
          <animated.meshStandardMaterial
            color={color}
            emissive={emissiveColor}
            emissiveIntensity={emissiveIntensity}
            roughness={0.4}
            metalness={0.6}
          />
        </animated.mesh>

        {/* Glow ring around planet */}
        {hovered && (
          <Ring
            args={[config.size * 1.3, config.size * 1.5, 64]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial
              color={config.color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        )}

        {/* Label billboard (always faces camera) */}
        <Billboard follow position={[0, config.size + 0.25, 0]}>
          <Text
            fontSize={0.12}
            color={hovered ? config.color : '#aaaaaa'}
            anchorX="center"
            anchorY="middle"
          >
            {`${config.icon} ${config.label}`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

/** Orbit ring track */
function OrbitTrack({ radius }: { radius: number }) {
  return (
    <Ring args={[radius - 0.005, radius + 0.005, 128]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color="#1a2a4a" transparent opacity={0.4} side={THREE.DoubleSide} />
    </Ring>
  );
}

/** Central sun */
function CoreSun() {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.06);
    }
  });

  return (
    <group>
      {/* Inner core */}
      <Sphere ref={ref} args={[0.38, 32, 32]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.2}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[0.55, 16, 16]}>
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
      <pointLight color="#00d4ff" intensity={3} distance={8} />
      <pointLight color="#a855f7" intensity={1} distance={12} />
      <Billboard follow position={[0, 0.75, 0]}>
        <Text fontSize={0.14} color="#00d4ff" anchorX="center">
          ✦ Vedha AI Core
        </Text>
      </Billboard>
    </group>
  );
}

export const PLANETS: PlanetConfig[] = [
  {
    id: 'mentor', label: 'AI Mentor', icon: '🤖', color: '#facc15',
    emissive: '#ca8a04', route: '/student/career',
    orbitRadius: 1.4, orbitSpeed: 0.18, size: 0.14, initialAngle: 0,
    description: 'Personalized AI career guidance', progress: 72,
  },
  {
    id: 'learning', label: 'Learning Hub', icon: '📚', color: '#a855f7',
    emissive: '#7c3aed', route: '/student/learning',
    orbitRadius: 2.0, orbitSpeed: 0.15, size: 0.15, initialAngle: 0.6,
    description: 'Courses & certifications', progress: 45,
  },
  {
    id: 'resume', label: 'Resume AI', icon: '📄', color: '#fb923c',
    emissive: '#ea580c', route: '/student/resume',
    orbitRadius: 2.6, orbitSpeed: 0.12, size: 0.14, initialAngle: 1.2,
    description: 'ATS-optimized resume analysis', progress: 87,
  },
  {
    id: 'interview', label: 'Interview Sim', icon: '🎙️', color: '#f472b6',
    emissive: '#db2777', route: '/student/interview',
    orbitRadius: 3.2, orbitSpeed: 0.09, size: 0.15, initialAngle: 1.8,
    description: 'AI mock interviews & feedback', progress: 60,
  },
  {
    id: 'skills', label: 'Skill Galaxy', icon: '⚡', color: '#4ade80',
    emissive: '#16a34a', route: '/student/skills',
    orbitRadius: 3.8, orbitSpeed: 0.075, size: 0.15, initialAngle: 2.4,
    description: 'Track & grow your skills', progress: 55,
  },
  {
    id: 'companies', label: 'Companies', icon: '🏢', color: '#60a5fa',
    emissive: '#2563eb', route: '/student/jobs',
    orbitRadius: 4.4, orbitSpeed: 0.06, size: 0.16, initialAngle: 3.0,
    description: 'Explore top hiring companies', progress: 30,
  },
  {
    id: 'roadmap', label: 'Roadmap', icon: '🗺️', color: '#34d399',
    emissive: '#059669', route: '/student/roadmap',
    orbitRadius: 5.0, orbitSpeed: 0.048, size: 0.16, initialAngle: 3.6,
    description: 'Your personalized career path', progress: 40,
  },
  {
    id: 'innovation', label: 'Innovation Lab', icon: '🧪', color: '#a855f7',
    emissive: '#7c3aed', route: '/student/collaboration',
    orbitRadius: 5.6, orbitSpeed: 0.038, size: 0.15, initialAngle: 4.2,
    description: 'Build & collaborate on projects', progress: 50,
  },
  {
    id: 'research', label: 'Research Hub', icon: '🔬', color: '#3b82f6',
    emissive: '#2563eb', route: '/student/career',
    orbitRadius: 6.2, orbitSpeed: 0.028, size: 0.15, initialAngle: 4.8,
    description: 'AI-assisted research assignments', progress: 45,
  },
  {
    id: 'jobs', label: 'Live Jobs', icon: '💼', color: '#f87171',
    emissive: '#dc2626', route: '/student/jobs',
    orbitRadius: 6.8, orbitSpeed: 0.02, size: 0.15, initialAngle: 5.4,
    description: 'Real-time job opportunities', progress: 20,
  },
  {
    id: 'community', label: 'Community Hub', icon: '💬', color: '#06ffd4',
    emissive: '#059669', route: '/student/collaboration',
    orbitRadius: 7.4, orbitSpeed: 0.012, size: 0.15, initialAngle: 6.0,
    description: 'Join network discussions & peer chats', progress: 65,
  },
];

interface SolarSystemProps {
  planets?: PlanetConfig[];
}

export default function SolarSystem({ planets = PLANETS }: SolarSystemProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <CoreSun />
      {planets.map((p) => (
        <group key={p.id}>
          <OrbitTrack radius={p.orbitRadius} />
          <PlanetMesh config={p} />
        </group>
      ))}
    </>
  );
}
