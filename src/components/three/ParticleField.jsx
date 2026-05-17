import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Very lightweight: 400 points, low DPR, no shadows, no lights
function Particles({ count = 400 }) {
  const mesh = useRef()
  const t = useRef(0)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = (Math.random() - 0.5) * 24
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      // Blue-violet palette
      const r = Math.random()
      col[i * 3]     = r < 0.5 ? 0.3 : 0.6
      col[i * 3 + 1] = r < 0.5 ? 0.65 : 0.2
      col[i * 3 + 2] = 1.0
    }
    return [pos, col]
  }, [count])

  useFrame((_, delta) => {
    t.current += delta * 0.06
    if (mesh.current) {
      mesh.current.rotation.y = t.current * 0.04
      mesh.current.rotation.x = Math.sin(t.current * 0.025) * 0.08
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 70 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        dpr={[1, 1]}          // Hard cap at 1× — never 2× for background
        frameloop="always"
      >
        <Particles count={400} />
      </Canvas>
    </div>
  )
}
