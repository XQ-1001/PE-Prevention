
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Float, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Play, RotateCcw, Pause } from 'lucide-react';

// --- Types ---
type SimulationState = 'IDLE' | 'FORMING' | 'MOVING' | 'BLOCKED';

// --- Constants ---
const PATH_POINTS = [
  new THREE.Vector3(0.5, -3.5, 0), // Right Leg Deep Vein
  new THREE.Vector3(0.5, -1.5, 0), // Thigh
  new THREE.Vector3(0, -0.5, 0),   // IVC Convergence
  new THREE.Vector3(0, 0.5, 0),    // Right Heart
  new THREE.Vector3(0, 1.5, 0),    // Pulmonary Artery Main
  new THREE.Vector3(0.8, 1.8, 0),  // Right Lung Artery (Blockage Site)
];

const CURVE = new THREE.CatmullRomCurve3(PATH_POINTS, false, 'catmullrom', 0.2);

// --- 3D Components ---

const HumanSilhouette = () => {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 3.5, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.8, 16]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[1.1, 0.9, 2.8, 32]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.15} />
      </mesh>
      {/* Shoulders */}
       <mesh position={[0, 2.2, 0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.2, 0.2, 2.8, 16]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.1} />
      </mesh>
      {/* Right Leg (Focus) */}
      <mesh position={[0.5, -2.0, 0]} rotation={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.35, 0.25, 3.5, 16]} />
        <meshBasicMaterial color="#475569" wireframe transparent opacity={0.2} />
      </mesh>
      {/* Left Leg */}
      <mesh position={[-0.5, -2.0, 0]} rotation={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.35, 0.25, 3.5, 16]} />
        <meshBasicMaterial color="#334155" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

const Organs = ({ simulationState }: { simulationState: SimulationState }) => {
  const heartRef = useRef<THREE.Mesh>(null);
  const lungRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    // Heartbeat
    if (heartRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.05;
      heartRef.current.scale.set(scale, scale, scale);
    }
    
    // Lung distress animation (pulsing color if blocked)
    if (lungRef.current && simulationState === 'BLOCKED') {
        // Handled via conditional material props below
    }
  });

  return (
    <group>
      {/* Heart */}
      <mesh ref={heartRef} position={[0, 0.5, 0.2]}>
        <dodecahedronGeometry args={[0.5, 1]} />
        <meshPhongMaterial 
            color="#ef4444" 
            emissive="#7f1d1d"
            emissiveIntensity={0.4}
            shininess={50}
            transparent
            opacity={0.9}
        />
      </mesh>

      {/* Lungs */}
      <group ref={lungRef}>
        {/* Left Lung (Viewer's Right) - Normal */}
        <mesh position={[-1.0, 1.5, 0]} scale={[1, 1.5, 0.8]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#fca5a5" transparent opacity={0.4} roughness={0.8} />
        </mesh>
        
        {/* Right Lung (Viewer's Left, Target of PE) */}
        <mesh position={[1.0, 1.5, 0]} scale={[1, 1.5, 0.8]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial 
            color={simulationState === 'BLOCKED' ? "#450a0a" : "#fca5a5"} // Darken when blocked
            transparent 
            opacity={0.6} 
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Text Labels */}
      <Text position={[1.2, 2.5, 0]} fontSize={0.15} color="white" anchorX="center">右肺</Text>
      <Text position={[-1.2, 2.5, 0]} fontSize={0.15} color="white" anchorX="center">左肺</Text>
      <Text position={[0, 0.5, 0.8]} fontSize={0.15} color="white" anchorX="center">心脏</Text>
      <Text position={[0.8, -3.8, 0]} fontSize={0.15} color="white" anchorX="center">下肢深静脉</Text>
    </group>
  );
};

const VascularSystem = () => {
    const tubeGeometry = useMemo(() => {
        return new THREE.TubeGeometry(CURVE, 64, 0.1, 8, false);
    }, []);

    return (
        <mesh geometry={tubeGeometry}>
            <meshPhysicalMaterial 
                color="#991b1b" 
                transparent 
                opacity={0.3} 
                transmission={0.5}
                roughness={0.2}
                metalness={0.1}
            />
        </mesh>
    );
};

const Clot = ({ 
  progress, 
  simulationState 
}: { 
  progress: number, 
  simulationState: SimulationState 
}) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (meshRef.current) {
        // Calculate position along curve
        const point = CURVE.getPointAt(progress);
        const tangent = CURVE.getTangentAt(progress);
        
        meshRef.current.position.copy(point);
        // Orient to path
        const lookAt = point.clone().add(tangent);
        meshRef.current.lookAt(lookAt);
        
        // Scale logic: 
        // - Forming: Grow from 0 to 1
        // - Moving: constant
        let scale = 1;
        if (simulationState === 'FORMING') {
            // progress is 0..1, but we want size to grow based on simulation time, 
            // here simplified to check progress if we used progress for formation.
            // Since 'progress' tracks movement, we handle formation scale in the mesh logic below roughly.
        }
    }
  });
  
  // Visual construction of a clot (irregular blood cells)
  const particles = useMemo(() => {
      return new Array(12).fill(0).map(() => ({
          offset: [
              (Math.random() - 0.5) * 0.15,
              (Math.random() - 0.5) * 0.15,
              (Math.random() - 0.5) * 0.3
          ] as [number, number, number],
          scale: Math.random() * 0.5 + 0.5
      }))
  }, []);

  // Hide clot if IDLE
  if (simulationState === 'IDLE') return null;

  // Scale effect for formation
  const groupScale = simulationState === 'FORMING' ? (Date.now() % 2000) / 2000 : 1; // Just a simple effect placeholder, real logic in parent

  return (
      <group ref={meshRef}>
          {particles.map((p, i) => (
              <mesh key={i} position={p.offset} scale={p.scale}>
                  <dodecahedronGeometry args={[0.08, 0]} />
                  <meshStandardMaterial color="#450a0a" roughness={0.9} />
              </mesh>
          ))}
          <pointLight color="red" intensity={0.5} distance={0.5} />
      </group>
  );
}

const SceneContent = ({ 
    simulationState, 
    progress, 
    clotScale 
}: { 
    simulationState: SimulationState, 
    progress: number,
    clotScale: number 
}) => {
  return (
    <>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, 5, 0]} intensity={0.5} color="blue" />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <group position={[0, -0.5, 0]}> {/* Center the body vertically roughly */}
            <HumanSilhouette />
            <Organs simulationState={simulationState} />
            <VascularSystem />
            
            {simulationState !== 'IDLE' && (
                <group>
                    {/* Clot Actor */}
                    <Clot progress={progress} simulationState={simulationState} />
                </group>
            )}
             
            {/* Formation Animation Override: Clot stays at start and grows */}
            {simulationState === 'FORMING' && (
                 <group position={PATH_POINTS[0]}>
                     <mesh scale={clotScale}>
                        <dodecahedronGeometry args={[0.15, 0]} />
                        <meshStandardMaterial color="#450a0a" />
                     </mesh>
                     <Text position={[0.5, 0, 0]} fontSize={0.12} color="#fca5a5">血栓形成中...</Text>
                 </group>
            )}

            {simulationState === 'BLOCKED' && (
                 <Text position={[1.5, 2.0, 0]} fontSize={0.2} color="red">阻塞!</Text>
            )}
        </group>
      </Float>
      
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={0.5} />
      <OrbitControls enablePan={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
    </>
  );
};

export const MedicalVisualization: React.FC = () => {
  const [state, setState] = useState<SimulationState>('IDLE');
  const [progress, setProgress] = useState(0); // 0 to 1 along curve
  const [clotScale, setClotScale] = useState(0);
  
  // Simulation Loop
  useEffect(() => {
    let animationFrame: number;
    
    const loop = () => {
      if (state === 'FORMING') {
        setClotScale(prev => {
            if (prev < 1) return prev + 0.01;
            setState('MOVING');
            return 1;
        });
      } else if (state === 'MOVING') {
        setProgress(prev => {
            if (prev < 1) {
                return prev + 0.003; // Speed of clot
            } 
            setState('BLOCKED');
            return 1;
        });
      }
      
      if (state !== 'BLOCKED' && state !== 'IDLE') {
          animationFrame = requestAnimationFrame(loop);
      }
    };

    if (state !== 'IDLE' && state !== 'BLOCKED') {
        animationFrame = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [state]);

  const handleStart = () => {
      setClotScale(0);
      setProgress(0);
      setState('FORMING');
  };

  const handleReset = () => {
      setState('IDLE');
      setProgress(0);
      setClotScale(0);
  };

  const getStatusText = () => {
      switch(state) {
          case 'IDLE': return "准备就绪 - 点击开始演示";
          case 'FORMING': return "阶段 1: 下肢深静脉血栓形成 (DVT)";
          case 'MOVING': 
            if (progress < 0.5) return "阶段 2: 血栓脱落，随静脉回流";
            if (progress < 0.8) return "阶段 3: 血栓经过心脏";
            return "阶段 4: 血栓即将进入肺动脉";
          case 'BLOCKED': return "危险: 肺动脉栓塞 (PE) 发生 - 肺组织缺血";
      }
  };

  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative bg-slate-900">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 z-10 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-lg max-w-md pointer-events-auto">
            <h3 className="text-teal-400 font-bold text-lg flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${state === 'BLOCKED' ? 'bg-red-500 animate-pulse' : 'bg-teal-500'}`}></div>
                PE 病理演变演示
            </h3>
            <p className="text-slate-300 text-sm mt-2 min-h-[3em] transition-all duration-300">
                {getStatusText()}
            </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2 pointer-events-auto">
            {state === 'IDLE' || state === 'BLOCKED' ? (
                <button 
                    onClick={handleStart}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-teal-900/20"
                >
                    <Play size={18} fill="currentColor" />
                    {state === 'BLOCKED' ? '重新演示' : '开始演示'}
                </button>
            ) : (
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all"
                >
                    <RotateCcw size={18} />
                    重置
                </button>
            )}
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <SceneContent simulationState={state} progress={progress} clotScale={clotScale} />
      </Canvas>
    </div>
  );
};
