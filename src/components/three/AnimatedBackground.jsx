import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField({ count = 2000 }) {
  const ref = useRef()
  const mouseRef = useRef({ x: 0, y: 0 })

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return positions
  }, [count])

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3)
    const palette = [
      [0.31, 0.42, 1.0],  // neon blue
      [0.61, 0.42, 1.0],  // neon purple
      [1.0, 0.30, 0.65],  // neon pink
    ]
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = color[0]
      colors[i * 3 + 1] = color[1]
      colors[i * 3 + 2] = color[2]
    }
    return colors
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.1
    ref.current.rotation.y = t * 0.02
    ref.current.rotation.z = Math.cos(t * 0.03) * 0.05
  })

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function FloatingOrbs() {
  const orbsRef = useRef([])

  const orbData = useMemo(() => [
    { x: -3, y: 1, z: -2, color: '#9C6BFF', scale: 0.8 },
    { x: 3, y: -1, z: -3, color: '#4FC3F7', scale: 0.6 },
    { x: 0, y: 2, z: -4, color: '#FF4DA6', scale: 0.4 },
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    orbsRef.current.forEach((orb, i) => {
      if (!orb) return
      orb.position.y = orbData[i].y + Math.sin(t * 0.5 + i * 2) * 0.3
      orb.position.x = orbData[i].x + Math.cos(t * 0.3 + i) * 0.2
    })
  })

  return (
    <>
      {orbData.map((orb, i) => (
        <mesh
          key={i}
          ref={el => orbsRef.current[i] = el}
          position={[orb.x, orb.y, orb.z]}
        >
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={2}
            transparent
            opacity={0.15}
            wireframe={false}
          />
        </mesh>
      ))}
    </>
  )
}

export default function AnimatedBackground({ intensity = 1 }) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.3} color="#9C6BFF" />
        <ParticleField count={Math.floor(1500 * intensity)} />
        <FloatingOrbs />
      </Canvas>
    </div>
  )
}
