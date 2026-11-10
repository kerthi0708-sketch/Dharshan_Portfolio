"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { drawBand, drawCardBack, drawCardFront, loadCardFace } from "./cardTextures";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_W = 1.6;
const CARD_H = 2.25;
const CARD_D = 0.02;

type Textures = { front: THREE.Texture; back: THREE.Texture; band: THREE.Texture };

function useCardTextures(): Textures | null {
  const [tex, setTex] = useState<Textures | null>(null);
  useEffect(() => {
    let alive = true;
    let made: Textures | null = null;
    const root = getComputedStyle(document.documentElement);
    const families = ["--font-archivo", "--font-jetbrains", "--font-instrument"].map((v) =>
      root.getPropertyValue(v).trim(),
    );
    const loads = [
      `800 150px ${families[0]}`,
      `600 40px ${families[1]}`,
      `italic 200px ${families[2]}`,
    ].map((f) => document.fonts.load(f).catch(() => null));

    Promise.all([loadCardFace(), ...loads]).then(([face]) => {
      if (!alive) return;
      const mk = (canvas: HTMLCanvasElement) => {
        const t = new THREE.CanvasTexture(canvas);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        return t;
      };
      const band = mk(drawBand());
      band.wrapS = band.wrapT = THREE.RepeatWrapping;
      made = { front: mk(drawCardFront(face as HTMLImageElement | null)), back: mk(drawCardBack()), band };
      setTex(made);
    });
    return () => {
      alive = false;
      if (made) Object.values(made).forEach((t) => t.dispose());
    };
  }, []);
  return tex;
}

function useCardGeometry() {
  return useMemo(() => {
    const r = 0.09;
    const w = CARD_W;
    const h = CARD_H;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

    const face = new THREE.ShapeGeometry(s, 8);
    const pos = face.attributes.position;
    const uv = face.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    }
    uv.needsUpdate = true;

    const body = new THREE.ExtrudeGeometry(s, { depth: CARD_D, bevelEnabled: false, curveSegments: 8 });
    body.translate(0, 0, -CARD_D / 2);
    return { face, body };
  }, []);
}

function Band({ textures, maxSpeed = 50, minSpeed = 0 }: { textures: Textures; maxSpeed?: number; minSpeed?: number }) {
  const band = useRef<THREE.Mesh<MeshLineGeometry, MeshLineMaterial>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const lerped = useRef(new Map<RapierRigidBody, THREE.Vector3>());

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<THREE.Vector3 | false>(false);
  const [hovered, hover] = useState(false);
  const { face, body } = useCardGeometry();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, dragged]);

  useEffect(() => () => {
    face.dispose();
    body.dispose();
  }, [face, body]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (!fixed.current || !band.current) return;
    const dt = Math.min(delta, 1 / 30);
    [j1, j2].forEach((ref) => {
      const body = ref.current;
      const t = body.translation();
      let l = lerped.current.get(body);
      if (!l) {
        l = new THREE.Vector3(t.x, t.y, t.z);
        lerped.current.set(body, l);
      }
      const d = Math.max(0.1, Math.min(1, l.distanceTo(t as THREE.Vector3)));
      l.lerp(t as THREE.Vector3, dt * (minSpeed + d * (maxSpeed - minSpeed)));
    });
    curve.points[0].copy(j3.current.translation() as THREE.Vector3);
    curve.points[1].copy(lerped.current.get(j2.current)!);
    curve.points[2].copy(lerped.current.get(j1.current)!);
    curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
    band.current.geometry.setPoints(curve.getPoints(32));
    ang.copy(card.current.angvel() as THREE.Vector3);
    rot.copy(card.current.rotation() as unknown as THREE.Vector3);
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, CARD_D / 2]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element).releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              const t = card.current.translation();
              drag(new THREE.Vector3().copy(e.point).sub(vec.set(t.x, t.y, t.z)));
            }}
          >
            {/* body */}
            <mesh geometry={body}>
              <meshStandardMaterial color="#0d0d0c" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* front */}
            <mesh geometry={face} position={[0, 0, CARD_D / 2 + 0.0015]}>
              {/* The photo face is softer-lit than the old drawn face so it doesn't wash out */}
              <meshPhysicalMaterial
                map={textures.front}
                color="#e2e2e2"
                clearcoat={0.35}
                clearcoatRoughness={0.3}
                roughness={0.75}
                metalness={0}
                envMapIntensity={0.45}
              />
            </mesh>
            {/* back */}
            <mesh geometry={face} position={[0, 0, -CARD_D / 2 - 0.0015]} rotation={[0, Math.PI, 0]}>
              <meshPhysicalMaterial map={textures.back} clearcoat={1} clearcoatRoughness={0.2} roughness={0.6} />
            </mesh>
            {/* clip */}
            <mesh position={[0, CARD_H / 2 + 0.07, 0]}>
              <boxGeometry args={[0.3, 0.14, 0.05]} />
              <meshStandardMaterial color="#9a9a9e" metalness={1} roughness={0.28} />
            </mesh>
            <mesh position={[0, CARD_H / 2 + 0.23, 0]}>
              <torusGeometry args={[0.085, 0.018, 12, 32]} />
              <meshStandardMaterial color="#b4b4b8" metalness={1} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, 1000) }]}
          color="white"
          depthTest={false}
          useMap={1}
          map={textures.band}
          repeat={new THREE.Vector2(-4, 1)}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

export default function HangingCard3D({ active = true }: { active?: boolean }) {
  const textures = useCardTextures();
  return (
    <Canvas
      camera={{ position: [0, 0, 11], fov: 22 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      aria-hidden="true"
    >
      <ambientLight intensity={Math.PI} />
      {textures && (
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Band textures={textures} />
        </Physics>
      )}
      <Environment blur={0.75} resolution={256}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="#c9bfff" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
