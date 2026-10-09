import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Layers,
  Sparkles,
  Move3d,
  Maximize2,
} from 'lucide-react';
import { GENERATED_ASSETS } from '../data/products';
import { ResilientImage } from './ResilientImage';

export interface Sneaker3DColorPreset {
  id: string;
  name: string;
  upperHex: string;
  cageHex: string;
  midsoleHex: string;
  accentHex: string;
  outsoleHex: string;
  soleHeightMm: number;
}

export const SNEAKER_3D_PRESETS: Sneaker3DColorPreset[] = [
  {
    id: 'cobalt',
    name: 'Aether-62 Cobalt Monolith',
    upperHex: '#1D4ED8',
    cageHex: '#F8FAFC',
    midsoleHex: '#F1F5F9',
    accentHex: '#3B82F6',
    outsoleHex: '#93C5FD',
    soleHeightMm: 62,
  },
  {
    id: 'violet',
    name: 'Vespera-58 Violet Tier',
    upperHex: '#7C3AED',
    cageHex: '#E9D5FF',
    midsoleHex: '#FAF5FF',
    accentHex: '#A855F7',
    outsoleHex: '#DDD6FE',
    soleHeightMm: 58,
  },
  {
    id: 'terracotta',
    name: 'Kinetix-55 Terracotta Dune',
    upperHex: '#EA580C',
    cageHex: '#E7E5E4',
    midsoleHex: '#F5F5F4',
    accentHex: '#F97316',
    outsoleHex: '#D6D3D1',
    soleHeightMm: 55,
  },
  {
    id: 'emerald',
    name: 'Verdant-52 Street Volt',
    upperHex: '#047857',
    cageHex: '#F8FAFC',
    midsoleHex: '#F1F5F9',
    accentHex: '#84CC16',
    outsoleHex: '#10B981',
    soleHeightMm: 52,
  },
  {
    id: 'crimson',
    name: 'Valence-60 Crimson Aero',
    upperHex: '#DC2626',
    cageHex: '#CBD5E1',
    midsoleHex: '#F8FAFC',
    accentHex: '#EF4444',
    outsoleHex: '#94A3B8',
    soleHeightMm: 60,
  },
  {
    id: 'ochre',
    name: 'Solstice-64 Ochre [01/250]',
    upperHex: '#D97706',
    cageHex: '#27272A',
    midsoleHex: '#F5F5F4',
    accentHex: '#F59E0B',
    outsoleHex: '#B45309',
    soleHeightMm: 64,
  },
];

interface Sneaker3DViewerProps {
  initialPresetId?: string;
  compact?: boolean;
  onSelectPresetProduct?: (presetName: string) => void;
}

export const Sneaker3DViewer: React.FC<Sneaker3DViewerProps> = ({
  initialPresetId = 'cobalt',
  compact = false,
  onSelectPresetProduct,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<Sneaker3DColorPreset>(
    () =>
      SNEAKER_3D_PRESETS.find((p) => p.id === initialPresetId) ||
      SNEAKER_3D_PRESETS[0]
  );
  const [exploded, setExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [surfaceFinish, setSurfaceFinish] = useState<
    'suede' | 'calfskin' | 'metallic'
  >('calfskin');
  const [webglError, setWebglError] = useState(false);

  // Refs for real-time state access inside requestAnimationFrame
  const explodedRef = useRef(exploded);
  explodedRef.current = exploded;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const materialsRef = useRef<{
    upperMat?: THREE.MeshPhysicalMaterial;
    cageMat?: THREE.MeshStandardMaterial;
    midsoleMat?: THREE.MeshStandardMaterial;
    accentMat?: THREE.MeshStandardMaterial;
    outsoleMat?: THREE.MeshPhysicalMaterial;
  }>({});

  // Sync preset prop if changed externally
  useEffect(() => {
    const match = SNEAKER_3D_PRESETS.find((p) => p.id === initialPresetId);
    if (match) setActivePreset(match);
  }, [initialPresetId]);

  // Update Three.js materials smoothly when activePreset or surfaceFinish changes
  useEffect(() => {
    const mats = materialsRef.current;
    if (mats.upperMat) {
      mats.upperMat.color.set(activePreset.upperHex);
      mats.upperMat.roughness =
        surfaceFinish === 'suede'
          ? 0.82
          : surfaceFinish === 'metallic'
            ? 0.22
            : 0.42;
      mats.upperMat.metalness = surfaceFinish === 'metallic' ? 0.65 : 0.08;
      mats.upperMat.clearcoat = surfaceFinish === 'calfskin' ? 0.45 : 0.1;
    }
    if (mats.cageMat) {
      mats.cageMat.color.set(activePreset.cageHex);
      mats.cageMat.metalness = surfaceFinish === 'metallic' ? 0.7 : 0.15;
    }
    if (mats.midsoleMat) {
      mats.midsoleMat.color.set(activePreset.midsoleHex);
    }
    if (mats.accentMat) {
      mats.accentMat.color.set(activePreset.accentHex);
    }
    if (mats.outsoleMat) {
      mats.outsoleMat.color.set(activePreset.outsoleHex);
    }
  }, [activePreset, surfaceFinish]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // WebGL context safety listeners
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      handleContextRestored
    );

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(4.4, 2.3, 5.2);
    camera.lookAt(0, 0.15, 0);

    // Three-Point Studio Lighting (Key, Fill, Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.1);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.1);
    fillLight.position.set(-6, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0x60a5fa, 2.4);
    rimLight.position.set(0, 6, -6);
    scene.add(rimLight);

    // Materials
    const upperMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activePreset.upperHex),
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.45,
      clearcoatRoughness: 0.25,
    });

    const cageMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activePreset.cageHex),
      roughness: 0.35,
      metalness: 0.18,
    });

    const midsoleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activePreset.midsoleHex),
      roughness: 0.55,
      metalness: 0.04,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activePreset.accentHex),
      roughness: 0.3,
      metalness: 0.35,
    });

    const outsoleMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activePreset.outsoleHex),
      roughness: 0.2,
      metalness: 0.05,
      transmission: 0.35,
      transparent: true,
      opacity: 0.92,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#18181B'),
      roughness: 0.25,
      metalness: 0.65,
    });

    materialsRef.current = {
      upperMat,
      cageMat,
      midsoleMat,
      accentMat,
      outsoleMat,
    };

    // Root Sneaker Group
    const sneakerGroup = new THREE.Group();
    scene.add(sneakerGroup);

    // Helper to build rounded/extruded sole slabs
    const createSoleSlab = (
      length: number,
      widthRear: number,
      widthFront: number,
      thickness: number
    ) => {
      const shape = new THREE.Shape();
      const hl = length / 2;
      shape.moveTo(-hl, -widthRear / 2);
      shape.bezierCurveTo(
        -hl * 0.2,
        -widthRear * 0.62,
        hl * 0.4,
        -widthFront * 0.65,
        hl,
        -widthFront * 0.32
      );
      shape.quadraticCurveTo(hl * 1.12, 0, hl, widthFront * 0.32);
      shape.bezierCurveTo(
        hl * 0.4,
        widthFront * 0.65,
        -hl * 0.2,
        widthRear * 0.62,
        -hl,
        widthRear / 2
      );
      shape.quadraticCurveTo(-hl * 1.12, 0, -hl, -widthRear / 2);

      const extrudeSettings = {
        steps: 1,
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.06,
        bevelSegments: 4,
      };
      const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geom.rotateX(Math.PI / 2);
      return geom;
    };

    // LAYER 1: Outsole & Sawtooth Architectural Lugs
    const outsoleGroup = new THREE.Group();
    const outsoleSlabGeom = createSoleSlab(3.15, 1.24, 1.38, 0.16);
    const outsoleMesh = new THREE.Mesh(outsoleSlabGeom, outsoleMat);
    outsoleMesh.position.y = -0.52;
    outsoleMesh.castShadow = true;
    outsoleGroup.add(outsoleMesh);

    // Sawtooth tread lugs along the bottom
    for (let i = -5; i <= 5; i++) {
      const lugGeom = new THREE.BoxGeometry(0.16, 0.12, 1.18);
      const lugMesh = new THREE.Mesh(lugGeom, carbonMat);
      lugMesh.position.set(i * 0.25, -0.72, 0);
      outsoleGroup.add(lugMesh);
    }
    sneakerGroup.add(outsoleGroup);

    // LAYER 2: 62mm Triple-Stacked Cantilevered Midsole
    const midsoleGroup = new THREE.Group();
    const tier1Geom = createSoleSlab(3.1, 1.22, 1.34, 0.26);
    const tier1Mesh = new THREE.Mesh(tier1Geom, midsoleMat);
    tier1Mesh.position.y = -0.24;
    tier1Mesh.castShadow = true;
    midsoleGroup.add(tier1Mesh);

    const tier2Geom = createSoleSlab(2.96, 1.14, 1.25, 0.22);
    const tier2Mesh = new THREE.Mesh(tier2Geom, accentMat);
    tier2Mesh.position.set(-0.04, -0.02, 0);
    midsoleGroup.add(tier2Mesh);

    const tier3Geom = createSoleSlab(2.85, 1.08, 1.2, 0.2);
    const tier3Mesh = new THREE.Mesh(tier3Geom, midsoleMat);
    tier3Mesh.position.set(-0.06, 0.16, 0);
    midsoleGroup.add(tier3Mesh);

    // Sculpted side wave pods
    for (let side of [-1, 1]) {
      const podGeom = new THREE.CapsuleGeometry(0.09, 1.25, 8, 16);
      podGeom.rotateZ(Math.PI / 2);
      const podMesh = new THREE.Mesh(podGeom, accentMat);
      podMesh.position.set(-0.25, -0.18, side * 0.62);
      midsoleGroup.add(podMesh);
    }
    sneakerGroup.add(midsoleGroup);

    // LAYER 3: Carbon-Composite Anti-Torsion Propulsion Plate
    const carbonGroup = new THREE.Group();
    const plateGeom = createSoleSlab(2.65, 0.92, 1.02, 0.06);
    const plateMesh = new THREE.Mesh(plateGeom, carbonMat);
    plateMesh.position.set(0, 0.24, 0);
    carbonGroup.add(plateMesh);

    // Stabilizer shanks on sides
    for (let side of [-1, 1]) {
      const wingGeom = new THREE.BoxGeometry(0.85, 0.14, 0.08);
      const wingMesh = new THREE.Mesh(wingGeom, accentMat);
      wingMesh.position.set(-0.4, 0.26, side * 0.54);
      carbonGroup.add(wingMesh);
    }
    sneakerGroup.add(carbonGroup);

    // LAYER 4: Italian Leather & Ballistic Mesh Upper + Laces + Collar
    const upperGroup = new THREE.Group();

    // Main contoured shoe body
    const bodyGeom = createSoleSlab(2.68, 0.98, 1.12, 0.56);
    const bodyMesh = new THREE.Mesh(bodyGeom, upperMat);
    bodyMesh.position.set(-0.08, 0.72, 0);
    bodyMesh.castShadow = true;
    upperGroup.add(bodyMesh);

    // Sculpted toe box slope
    const toeGeom = new THREE.SphereGeometry(0.56, 24, 16);
    toeGeom.scale(1.55, 0.62, 1.02);
    const toeMesh = new THREE.Mesh(toeGeom, cageMat);
    toeMesh.position.set(0.75, 0.48, 0);
    upperGroup.add(toeMesh);

    // High-top ankle collar & heel counter
    const collarOuterGeom = new THREE.CylinderGeometry(0.52, 0.56, 0.65, 24);
    collarOuterGeom.scale(1.15, 1, 0.92);
    const collarMesh = new THREE.Mesh(collarOuterGeom, upperMat);
    collarMesh.position.set(-0.78, 0.85, 0);
    collarMesh.rotation.z = 0.14;
    upperGroup.add(collarMesh);

    // Inner dark plush lambskin ankle opening
    const innerCollarGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.68, 24);
    innerCollarGeom.scale(1.1, 1, 0.86);
    const innerCollarMesh = new THREE.Mesh(innerCollarGeom, carbonMat);
    innerCollarMesh.position.set(-0.76, 0.88, 0);
    innerCollarMesh.rotation.z = 0.14;
    upperGroup.add(innerCollarMesh);

    // Exoskeleton side cages
    for (let side of [-1, 1]) {
      const cagePanelGeom = new THREE.BoxGeometry(1.15, 0.42, 0.08);
      const cagePanel = new THREE.Mesh(cagePanelGeom, cageMat);
      cagePanel.position.set(-0.15, 0.62, side * 0.53);
      cagePanel.rotation.z = -0.18;
      upperGroup.add(cagePanel);
    }

    // Padded tongue & titanium badge
    const tongueGeom = new THREE.BoxGeometry(0.75, 0.62, 0.52);
    const tongueMesh = new THREE.Mesh(tongueGeom, accentMat);
    tongueMesh.position.set(-0.22, 0.96, 0);
    tongueMesh.rotation.z = -0.48;
    upperGroup.add(tongueMesh);

    // 4 Cross-Laces across instep
    for (let l = 0; l < 4; l++) {
      const laceGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.88, 12);
      laceGeom.rotateX(Math.PI / 2);
      const laceMesh = new THREE.Mesh(laceGeom, cageMat);
      laceMesh.position.set(0.05 + l * 0.18, 0.88 - l * 0.09, 0);
      upperGroup.add(laceMesh);
    }

    // Heel pull loop
    const loopGeom = new THREE.TorusGeometry(0.12, 0.03, 10, 20);
    const loopMesh = new THREE.Mesh(loopGeom, accentMat);
    loopMesh.position.set(-1.38, 1.05, 0);
    loopMesh.rotation.y = Math.PI / 2;
    upperGroup.add(loopMesh);

    sneakerGroup.add(upperGroup);

    // Subtle Studio Pedestal Ring underneath
    const ringGeom = new THREE.RingGeometry(1.65, 1.72, 64);
    ringGeom.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.y = -0.95;
    scene.add(ringMesh);

    // Pointer Drag Orbit Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = -0.55;
    let targetRotX = 0.08;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetRotY += dx * 0.01;
      targetRotX = Math.max(-0.45, Math.min(0.55, targetRotX + dy * 0.008));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (autoRotateRef.current && !isDragging) {
        targetRotY += 0.0065;
      }

      // Smooth interpolation for rotation
      sneakerGroup.rotation.y += (targetRotY - sneakerGroup.rotation.y) * 0.1;
      sneakerGroup.rotation.x += (targetRotX - sneakerGroup.rotation.x) * 0.1;

      // Subtle floating levitation
      sneakerGroup.position.y = Math.sin(t * 1.8) * 0.06;

      // Exploded view layer separation interpolation
      const isExp = explodedRef.current;
      const targetUpperY = isExp ? 0.55 : 0;
      const targetCarbonY = isExp ? 0.18 : 0;
      const targetMidsoleY = isExp ? -0.15 : 0;
      const targetOutsoleY = isExp ? -0.48 : 0;

      upperGroup.position.y += (targetUpperY - upperGroup.position.y) * 0.08;
      carbonGroup.position.y += (targetCarbonY - carbonGroup.position.y) * 0.08;
      midsoleGroup.position.y +=
        (targetMidsoleY - midsoleGroup.position.y) * 0.08;
      outsoleGroup.position.y +=
        (targetOutsoleY - outsoleGroup.position.y) * 0.08;

      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('webglcontextlost', handleContextLost);
      domElem.removeEventListener(
        'webglcontextrestored',
        handleContextRestored
      );
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#121216] via-[#18181F] to-[#0E0E12] border border-zinc-800 text-white select-none ${
        compact ? 'h-[400px]' : 'h-[480px] sm:h-[540px]'
      }`}
    >
      {/* Subtle Studio Grid Backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.35), transparent 65%)',
        }}
      />

      {/* WebGL Canvas Mount or Graceful Fallback */}
      {webglError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <ResilientImage
            src={GENERATED_ASSETS.cobaltPlatform}
            alt={activePreset.name}
            className="w-64 h-48 object-cover rounded-2xl mb-4"
          />
          <p className="font-display text-base font-bold">{activePreset.name}</p>
          <p className="text-xs text-zinc-400">
            Interactive 3D Preview Fallback Mode
          </p>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label={`Interactive 360-degree 3D model of ${activePreset.name}`}
        />
      )}

      {/* Semantic Top Floating HUD Overlay */}
      <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 flex flex-wrap items-start justify-between gap-3 pointer-events-none z-10">
        <div className="px-4 py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 uppercase tracking-wider">
            <Move3d className="w-3.5 h-3.5" />
            <span>360° WEBGL SOLE ARCHITECT · DRAG TO ORBIT</span>
          </div>
          <div className="font-display text-base sm:text-lg font-bold text-white mt-0.5">
            {activePreset.name} ({activePreset.soleHeightMm}mm Stack)
          </div>
        </div>

        {/* 3D Action Controls (Exploded View, Auto-Orbit, Finish) */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setExploded(!exploded)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-settling cursor-pointer whitespace-nowrap ${
              exploded
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                : 'bg-black/45 backdrop-blur-md border-white/15 text-zinc-200 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{exploded ? 'Assemble Sole' : 'Explode 4 Layers'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-settling cursor-pointer whitespace-nowrap ${
              autoRotate
                ? 'bg-white/15 border-white/25 text-white'
                : 'bg-black/45 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`}
              style={{ animationDuration: '6s' }}
            />
            <span>Orbit</span>
          </button>
        </div>
      </div>

      {/* Exploded Layer Callout HUD when Exploded View is active */}
      {exploded && (
        <div className="hidden sm:flex flex-col gap-1.5 absolute right-6 top-1/2 -translate-y-1/2 px-3.5 py-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-300 pointer-events-none z-10">
          <div className="text-blue-400 font-bold uppercase mb-0.5">
            Exploded Telemetry
          </div>
          <div>01 · Italian Calfskin &amp; Cordura Upper</div>
          <div>02 · Forked Carbon Torsion Bridge</div>
          <div>03 · {activePreset.soleHeightMm}mm Nitrogen Pebax® Core</div>
          <div>04 · Translucent Sawtooth Lug Outsole</div>
        </div>
      )}

      {/* Bottom Floating HUD: Colorway Presets & Material Finish Switcher */}
      <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pointer-events-none z-10">
        {/* Colorway Swatches */}
        <div className="px-4 py-2.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex flex-wrap items-center gap-2.5 pointer-events-auto">
          <span className="text-[11px] font-mono uppercase text-zinc-400 mr-1">
            3D Colorway:
          </span>
          {SNEAKER_3D_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setActivePreset(preset)}
              title={preset.name}
              className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                activePreset.id === preset.id
                  ? 'scale-125 border-white ring-2 ring-blue-500'
                  : 'border-white/40 hover:scale-110'
              }`}
              style={{ backgroundColor: preset.upperHex }}
            />
          ))}
        </div>

        {/* Surface Finish Switcher + Inspect Product Button */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 inline-flex text-xs">
            {(['calfskin', 'suede', 'metallic'] as const).map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => setSurfaceFinish(finish)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  surfaceFinish === finish
                    ? 'bg-white text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>

          {onSelectPresetProduct && (
            <button
              type="button"
              onClick={() => onSelectPresetProduct(activePreset.name)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-settling cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shop Model</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
