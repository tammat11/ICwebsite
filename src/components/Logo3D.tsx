import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { gsap } from 'gsap';

function LogoGold({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
    const group = useRef<THREE.Group>(null);
    const { scene: gltfScene } = useGLTF("/models/logo.glb");
    const { gl, scene: rootScene } = useThree();

    // Stable studio-like environment (gives reflections/highlights)
    useEffect(() => {
        RectAreaLightUniformsLib.init();

        const pmrem = new THREE.PMREMGenerator(gl);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

        rootScene.environment = envTex;
        rootScene.background = null;

        return () => {
            envTex.dispose();
            pmrem.dispose();
        };
    }, [gl, rootScene]);

    // “Premium gold” with real highlights (no Bloom needed)
    const goldMat = useMemo(
        () =>
            new THREE.MeshPhysicalMaterial({
                color: "#C9A54C",
                metalness: 1,
                roughness: 0.16, // lower = stronger highlights
                clearcoat: 0.75,
                clearcoatRoughness: 0.04,
                envMapIntensity: 2.6,
                side: THREE.DoubleSide,
            }),
        []
    );

    // Apply material + fix normals (common reason for ugly shading)
    useEffect(() => {
        gltfScene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;

            mesh.geometry.computeVertexNormals();
            mesh.material = goldMat;

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.frustumCulled = false;
        });

        goldMat.needsUpdate = true;

        // Nice product-shot angle
        gltfScene.rotation.set(0, -1.2, 0.15);

        // --- ENTRANCE ANIMATION ---
        if (group.current) {
            gsap.fromTo(group.current.scale,
                { x: 0, y: 0, z: 0 },
                {
                    x: 2.15,
                    y: 2.15,
                    z: 2.15,
                    duration: 1.2, // Snappier
                    ease: "expo.out",
                    delay: 0.1
                }
            );

            gsap.fromTo(group.current.position,
                { z: -3 },
                { z: 0, duration: 1.4, ease: "power3.out", delay: 0.1 }
            );
        }
    }, [gltfScene, goldMat]);

    // Subtle premium parallax
    useFrame(() => {
        if (!group.current) return;
        const [mx, my] = mouse.current;

        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, my * 0.1, 0.06);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mx * 0.2, 0.06);
    });

    return (
        <group ref={group} position={[1.3, 1.3, 0]} scale={0}>
            <primitive object={gltfScene} />
        </group>
    );
}

export default function Logo3D() {
    const mouse = useRef<[number, number]>([0, 0]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouse.current = [x, y];
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 32 }}
                dpr={[1, 2]}
                shadows
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                onCreated={({ gl }) => {
                    gl.outputColorSpace = THREE.SRGBColorSpace;
                    gl.toneMappingExposure = 1.2; // helps highlights pop
                }}
            >
                {/* Keep ambient low so highlights have contrast */}
                <ambientLight intensity={0.12} />

                {/* Shape lights */}
                <directionalLight position={[5, 6, 6]} intensity={2.2} castShadow />
                <directionalLight position={[-4, 2, 3]} intensity={1.1} />
                <directionalLight position={[0, -3, 2]} intensity={0.45} />

                {/* Highlight cards (these create the “Apple” streak highlights) */}
                <rectAreaLight width={6} height={3} intensity={12} position={[0, 3, 4]} />
                <rectAreaLight width={2} height={5} intensity={6} position={[-3, 1, 3]} />

                <Suspense fallback={null}>
                    <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.35}>
                        <LogoGold mouse={mouse} />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload("/models/logo.glb");
