import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Ring, Billboard, Text, PointMaterial, Points } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { Zap, Briefcase, Award, GraduationCap, DollarSign } from "lucide-react";

interface UniverseNode {
  id: string;
  name: string;
  type: "company" | "job";
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  angle: number;
  details: {
    title?: string;
    salary?: string;
    skills: string[];
    matchScore: number;
    learningPath: string[];
    certs?: string[];
  };
}

const UNIVERSE_NODES: UniverseNode[] = [
  {
    id: "co-deepmind", name: "Google DeepMind", type: "company",
    color: "#00d4ff", size: 0.28, orbitRadius: 2.2, orbitSpeed: 0.1, angle: 0,
    details: {
      skills: ["Python", "FastAPI", "Deep Learning", "Docker"],
      matchScore: 92,
      learningPath: ["Advanced System Design", "Docker Containers Scaling"],
    }
  },
  {
    id: "co-meta", name: "Meta", type: "company",
    color: "#a855f7", size: 0.25, orbitRadius: 3.5, orbitSpeed: 0.07, angle: 2.2,
    details: {
      skills: ["React", "TypeScript", "GraphQL", "Performance"],
      matchScore: 84,
      learningPath: ["Vite + React Complete Guide", "UI rendering render optimization"],
    }
  },
  {
    id: "co-vedha", name: "Vedha AI Inc", type: "company",
    color: "#4ade80", size: 0.24, orbitRadius: 4.8, orbitSpeed: 0.05, angle: 4.5,
    details: {
      skills: ["FastAPI", "Next.js", "PostgreSQL", "LLM APIs"],
      matchScore: 95,
      learningPath: ["Python Backends with FastAPI & SQL", "Next.js dynamic routing"],
    }
  },
  {
    id: "job-ai", name: "AI Engineer", type: "job",
    color: "#f472b6", size: 0.2, orbitRadius: 1.8, orbitSpeed: -0.12, angle: 1.2,
    details: {
      title: "AI Engineer",
      salary: "$120,000 - $160,000",
      skills: ["Python", "PyTorch", "Hugging Face", "LLMs"],
      matchScore: 88,
      learningPath: ["Deep Learning Fundamentals", "Langchain LLM Orchestration"],
      certs: ["Google Professional Machine Learning Engineer", "HuggingFace ML Certification"],
    }
  },
  {
    id: "job-backend", name: "Backend Dev", type: "job",
    color: "#fb923c", size: 0.18, orbitRadius: 3.0, orbitSpeed: -0.08, angle: 3.1,
    details: {
      title: "Backend Developer",
      salary: "14 - 22 LPA",
      skills: ["Python", "FastAPI", "SQL", "Docker"],
      matchScore: 92,
      learningPath: ["Python Backends with FastAPI & SQL", "Ecosystem REST API architectures"],
      certs: ["AWS Certified Solutions Architect", "Docker Associate Certified"],
    }
  },
  {
    id: "job-frontend", name: "Frontend Dev", type: "job",
    color: "#60a5fa", size: 0.17, orbitRadius: 4.2, orbitSpeed: -0.06, angle: 5.0,
    details: {
      title: "Frontend Engineer",
      salary: "12 - 18 LPA",
      skills: ["React", "TypeScript", "CSS", "Vite"],
      matchScore: 78,
      learningPath: ["Vite + React Complete Guide", "Responsive Layouts Design"],
      certs: ["Meta Front-End Developer Professional Certificate"],
    }
  }
];

function OrbitNode({ node, onSelect }: { node: UniverseNode; onSelect: (node: UniverseNode) => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const { scale } = useSpring({
    scale: hovered ? 1.3 : 1,
    config: { mass: 1, tension: 280, friction: 18 }
  });

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * node.orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.position.y = Math.sin(Date.now() * 0.0015 + node.angle) * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, node.angle, 0]}>
      <group position={[node.orbitRadius, 0, 0]}>
        {/* @ts-ignore */}
        <animated.mesh
          ref={meshRef}
          scale={scale}
          onClick={() => onSelect(node)}
          onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
        >
          <sphereGeometry args={[node.size, 32, 32]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={hovered ? 0.8 : 0.25}
            metalness={0.6}
            roughness={0.4}
          />
        </animated.mesh>

        <Billboard follow position={[0, node.size + 0.2, 0]}>
          <Text fontSize={0.11} color={hovered ? node.color : "#aaaaaa"}>
            {node.type === "company" ? `🏢 ${node.name}` : `💼 ${node.name}`}
          </Text>
        </Billboard>
      </group>
    </group>
  );
}

function StarBackground() {
  const positions = new Float32Array(800 * 3);
  for (let i = 0; i < 800; i++) {
    const r = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  return (
    <Points positions={positions} stride={3}>
      <PointMaterial transparent color="#ffffff" size={0.005} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}

export default function UniverseMap() {
  const [selectedNode, setSelectedNode] = useState<UniverseNode | null>(UNIVERSE_NODES[0]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, height: 500, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(2,4,14,0.95)" }}>
      {/* 3D viewport */}
      <div style={{ position: "relative" }}>
        <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <StarBackground />
          {/* Central sun (Vedha Core) */}
          <Sphere args={[0.3, 32, 32]}>
            <meshBasicMaterial color="#00d4ff" />
          </Sphere>
          {UNIVERSE_NODES.map(node => (
            <group key={node.id}>
              <Ring args={[node.orbitRadius - 0.005, node.orbitRadius + 0.005, 64]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
              </Ring>
              <OrbitNode node={node} onSelect={setSelectedNode} />
            </group>
          ))}
        </Canvas>
        <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
          🖱 Click planets to preview match score, skills & pathways.
        </div>
      </div>

      {/* Details Side Panel */}
      <div style={{ background: "rgba(255,255,255,0.01)", borderLeft: "1px solid rgba(255,255,255,0.06)", padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {selectedNode ? (
          <>
            <div>
              <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 10, background: `${selectedNode.color}15`, border: `1px solid ${selectedNode.color}30`, color: selectedNode.color, fontWeight: 700, textTransform: "uppercase" }}>
                {selectedNode.type}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginTop: 8 }}>{selectedNode.name}</h3>
            </div>

            {/* Match Score */}
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: `radial-gradient(ellipse, ${selectedNode.color}40, transparent)`, display: "flex", alignItems: "center", justifyCenter: "center", border: `2px solid ${selectedNode.color}`, color: selectedNode.color, fontWeight: 900, fontSize: 12 } as any}>
                {selectedNode.details.matchScore}%
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "white" }}>AI Compatibility Match</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Based on your latest skills registry</div>
              </div>
            </div>

            {/* Salary Range for Job */}
            {selectedNode.type === "job" && selectedNode.details.salary && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                  <DollarSign size={12} /> Salary Range
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#4ade80", marginTop: 6 }}>
                  {selectedNode.details.salary}
                </div>
              </div>
            )}

            {/* Required Skills */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} /> Required Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                {selectedNode.details.skills.map(s => (
                  <span key={s} style={{ fontSize: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 6, color: "rgba(255,255,255,0.85)" }}>{s}</span>
                ))}
              </div>
            </div>

            {/* Recommended Learning Path */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                <GraduationCap size={12} /> Recommended Path
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {selectedNode.details.learningPath.map(p => (
                  <div key={p} style={{ fontSize: 11, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)", padding: 8, borderRadius: 8, color: "#00d4ff" }}>{p}</div>
                ))}
              </div>
            </div>

            {/* Recommended Certifications for Job */}
            {selectedNode.type === "job" && selectedNode.details.certs && (
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Award size={12} /> Recommended Certs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {selectedNode.details.certs.map(c => (
                    <div key={c} style={{ fontSize: 11, background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.15)", padding: 8, borderRadius: 8, color: "#facc15" }}>{c}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
            <Briefcase size={24} style={{ marginBottom: 8 }} />
            Select a planet to inspect
          </div>
        )}
      </div>
    </div>
  );
}
