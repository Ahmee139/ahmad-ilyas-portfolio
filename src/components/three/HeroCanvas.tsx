"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import * as THREE from "three";
import { useLoader } from "@/context/LoaderContext";
import { useTheme } from "@/context/ThemeContext";

const PARTICLE_COUNT = 1400;

// Move impure generators (Math.random) outside the render pipeline to satisfy react-hooks/purity rules
function generateParticleData(isLight: boolean) {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);

  const colorOrange = new THREE.Color("#F45A37");
  // Darker stone particles for light mode so the wave stays visible on white
  const colorSilver = new THREE.Color(isLight ? "#6B635A" : "#B7AEA2");

  let i3 = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.0 + Math.random() * 2.8;

    pos[i3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.15;
    pos[i3 + 1] = (Math.random() - 0.5) * 0.4;
    pos[i3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.15;

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
  isLight: boolean;
}

function ParticleWaves({ scrollProgress, isLight }: ParticleWavesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { isLoading } = useLoader();
  const frameSkipRef = useRef(0);

  const { positions, colors } = useMemo(
    () => generateParticleData(isLight),
    [isLight]
  );

  const waveParams = useMemo(
    () => ({
      xMult: 0.5,
      zMult: 0.5,
      tMult1: 0.7,
      tMult2: 0.5,
      amp1: 0.25,
      amp2: 0.1,
    }),
    []
  );

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const scrollVal = scrollProgress.get();

    pointsRef.current.rotation.y = time * 0.025;

    frameSkipRef.current = (frameSkipRef.current + 1) % 2;
    if (frameSkipRef.current === 0) {
      const posAttribute = pointsRef.current.geometry.attributes.position;
      const positionsArray = posAttribute.array as Float32Array;

      const t1 = time * waveParams.tMult1;
      const t2 = time * waveParams.tMult2;
      const t3 = time * 0.3;

      let i3 = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = positionsArray[i3];
        const z = positionsArray[i3 + 2];

        positionsArray[i3 + 1] =
          Math.sin(x * waveParams.xMult + t1) *
            Math.cos(z * waveParams.zMult + t2) *
            waveParams.amp1 +
          Math.cos(x * 0.2 - t3) * waveParams.amp2;

        i3 += 3;
      }
      posAttribute.needsUpdate = true;
    }

    pointsRef.current.position.y = scrollVal * 1.5;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 1.5,
      0.035
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 1.5 + 1.2,
      0.035
    );
    state.camera.lookAt(0, 0, -0.5);

    const material = pointsRef.current.material as THREE.PointsMaterial;
    if (material) {
      const targetOpacity = isLoading ? 0 : isLight ? 0.9 : 0.75;
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
      <pointsMaterial
        size={isLight ? 0.036 : 0.032}
        vertexColors
        transparent
        opacity={0}
        sizeAttenuation={true}
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
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
  const { theme } = useTheme();
  const isLight = theme === "light";

  useEffect(() => {
    const glowDiv = containerRef.current?.querySelector(".glow-layer") as HTMLDivElement;
    if (glowDiv) {
      if (isLoading) {
        glowDiv.style.opacity = "0";
      } else {
        const timeout = setTimeout(() => {
          glowDiv.style.transition = "opacity 2.5s ease-out";
          glowDiv.style.opacity = isLight ? "0.12" : "0.03";
        }, 300);
        return () => clearTimeout(timeout);
      }
    }
  }, [isLoading, isLight]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
      <div className="glow-layer absolute w-[45%] h-[45%] rounded-full bg-lime-accent blur-[120px] pointer-events-none z-0 opacity-0" />

      <Canvas
        key={theme}
        camera={{ position: [0, 1.2, 3.8], fov: 60 }}
        dpr={[1, 1.25]}
        className="w-full h-full z-10"
      >
        <ambientLight intensity={isLight ? 0.45 : 0.2} />
        <pointLight position={[5, 5, 5]} intensity={isLight ? 0.7 : 0.5} color="#F45A37" />

        <ParticleWaves scrollProgress={scrollProgress} isLight={isLight} />
      </Canvas>
    </div>
  );
}
