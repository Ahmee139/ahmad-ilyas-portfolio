"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { useLoader } from "@/context/LoaderContext";

const PARTICLE_COUNT = 1800;

// Move impure generators (Math.random) outside the render pipeline to satisfy react-hooks/purity rules
function generateParticleData() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);

  const colorOrange = new THREE.Color("#F45A37"); // Warm Orange Accent
  const colorSilver = new THREE.Color("#B7AEA2"); // Warm Stone Secondary Heading Accent

  let i3 = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Generate cylindrical coordinates with random radius and angle
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.0 + Math.random() * 2.8;

    pos[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.15; // X
    pos[i3 + 1] = (Math.random() - 0.5) * 0.4; // Y
    pos[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.15; // Z

    // Dynamic color partitioning (silver: 65%, orange: 35%)
    const isOrange = Math.random() > 0.65;
    const mixedColor = isOrange ? colorOrange : colorSilver;

    col[i3] = mixedColor.r;
    col[i3 + 1] = mixedColor.g;
    col[i3 + 2] = mixedColor.b;

    i3 += 3;
  }

  return { positions: pos, colors: col };
}

interface ParticleWavesProps {
  scrollProgress: MotionValue<number>;
}

function ParticleWaves({ scrollProgress }: ParticleWavesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isLoading } = useLoader();

  // Initialize particle arrays
  const { positions, colors } = useMemo(() => generateParticleData(), []);

  // Pre-calculate loop variables outside useFrame where possible
  const waveParams = useMemo(() => ({
    xMult: 0.5,
    zMult: 0.5,
    tMult1: 0.7,
    tMult2: 0.5,
    amp1: 0.25,
    amp2: 0.1,
  }), []);

  // Frame tick updates
  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const scrollVal = scrollProgress.get();

    // 1. Slow rotational drift
    pointsRef.current.rotation.y = time * 0.025;

    // 2. Animate vertical position using wave calculations (sine/cos) + scroll displacement
    const posAttribute = pointsRef.current.geometry.attributes.position;
    const positionsArray = posAttribute.array as Float32Array;

    const t1 = time * waveParams.tMult1;
    const t2 = time * waveParams.tMult2;
    const t3 = time * 0.3;

    let i3 = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = positionsArray[i3];
      const z = positionsArray[i3 + 2];

      // Double layered wave displacement - optimized with pre-calculated multipliers
      positionsArray[i3 + 1] =
        Math.sin(x * waveParams.xMult + t1) * Math.cos(z * waveParams.zMult + t2) * waveParams.amp1 +
        Math.cos(x * 0.2 - t3) * waveParams.amp2;

      i3 += 3;
    }
    posAttribute.needsUpdate = true;

    // Translate the entire points geometry upward during scroll
    pointsRef.current.position.y = scrollVal * 1.5;

    // 3. Mouse Parallax camera tilt interpolation
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 1.5,
      0.035
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 1.5 + 1.2, // Offset camera slightly upwards
      0.035
    );
    state.camera.lookAt(0, 0, -0.5);

    // 4. Smooth material opacity fade-in once loading finishes
    const material = pointsRef.current.material as THREE.PointsMaterial;
    if (material) {
      const targetOpacity = isLoading ? 0 : 0.75;
      material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.035);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Particle styling with size attenuation (scales smaller with distance) */}
      <pointsMaterial
        size={0.032}
        vertexColors
        transparent
        opacity={0} // Start invisible, fade in dynamically via frame loop
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface HeroCanvasProps {
  scrollProgress: MotionValue<number>;
}

export default function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useLoader();

  // Animate backdrop glow opacity based on load state
  useEffect(() => {
    const glowDiv = containerRef.current?.querySelector(".glow-layer") as HTMLDivElement;
    if (glowDiv) {
      if (isLoading) {
        glowDiv.style.opacity = "0";
      } else {
        const timeout = setTimeout(() => {
          glowDiv.style.transition = "opacity 2.5s ease-out";
          glowDiv.style.opacity = "0.03"; // 3% subtle glow highlight
        }, 300);
        return () => clearTimeout(timeout);
      }
    }
  }, [isLoading]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      {/* Soft CSS mesh glow layer beneath the WebGL canvas */}
      <div className="glow-layer absolute w-[45%] h-[45%] rounded-full bg-lime-accent blur-[120px] pointer-events-none z-0 opacity-0" />
      
      <Canvas
        camera={{ position: [0, 1.2, 3.8], fov: 60 }}
        dpr={[1, 1.5]} // Optimized DPR: limit to 1.5 on high-DPI screens to prevent GPU bottlenecks
        className="w-full h-full z-10"
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#F45A37" />
        
        <ParticleWaves scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
