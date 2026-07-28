import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const _T = {};
function _mkTex(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function tex(k, w, h, fn) { if (!_T[k]) _T[k] = _mkTex(w, h, fn); return _T[k]; }

function grassTex() {
  return tex('g', 512, 512, ctx => {
    for (let y = 0; y < 512; y++) {
      for (let x = 0; x < 512; x++) {
        const n = Math.random();
        const r = 25 + n * 30 + Math.sin(x * 0.1) * 6 + Math.cos(y * 0.08) * 4;
        const g = 75 + n * 55 + Math.sin((x + y) * 0.06) * 10;
        const b = 15 + n * 25;
        ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  });
}
function concTex() {
  return tex('c', 1024, 1024, ctx => {
    ctx.fillStyle = '#b5a898'; ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 8000; i++) {
      const a = 0.01 + Math.random() * 0.06;
      ctx.fillStyle = `rgba(0,0,0,${a})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2 + Math.random() * 12, 2 + Math.random() * 12);
    }
    for (let i = 0; i < 200; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.04})`;
      ctx.lineWidth = 0.5 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * 1024, Math.random() * 1024);
      ctx.lineTo(Math.random() * 1024, Math.random() * 1024);
      ctx.stroke();
    }
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.02})`;
      const x = Math.random() * 1024, y = Math.random() * 1024;
      ctx.beginPath();
      ctx.ellipse(x, y, 1 + Math.random() * 3, 1 + Math.random() * 3, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}
function metalTex() {
  return tex('m', 1024, 1024, ctx => {
    ctx.fillStyle = '#8a8a8a'; ctx.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 12000; i++) {
      const a = 0.005 + Math.random() * 0.08;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1 + Math.random() * 4, 1 + Math.random() * 1024);
    }
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.003 + Math.random() * 0.04})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1 + Math.random() * 1024);
    }
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${0.02 + Math.random() * 0.03})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 1024, 5 + Math.random() * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}
function woodTex(type) {
  const k = 'w_' + type; if (_T[k]) return _T[k];
  const cs = { cedro: '#8b5a2b', tornillo: '#c4944a', caoba: '#5c2e16' };
  const ds = { cedro: '#6a3e1e', tornillo: '#a07030', caoba: '#3e1a0e' };
  return _T[k] = _mkTex(2048, 512, (ctx, w, h) => {
    ctx.fillStyle = cs[type] || '#8b5a2b'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) {
      const y = i * (h / 60) + Math.random() * 4 + Math.sin(i * 0.5) * 5;
      ctx.fillStyle = ds[type] || '#6a3e1e';
      ctx.globalAlpha = 0.08 + Math.random() * 0.2;
      ctx.fillRect(0, y, w, 2 + Math.random() * 12);
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.02 + Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 1 + Math.random() * 8, 1 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.01 + Math.random() * 0.02})`;
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 1 + Math.random() * 4, 0.5 + Math.random() * 2, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

/* ─── ZOOM ─── */
function ZoomControl({ level }) {
  const camera = useThree(s => s.camera);
  useEffect(() => {
    const lens = [1.8, 1.2, 0.85, 0.6, 0.45, 0.3];
    const dist = lens[THREE.MathUtils.clamp(level, 0, 5)] * 8;
    const target = new THREE.Vector3(0, 2.2, 0);
    camera.position.set(dist * 0.55, 2.2 + dist * 0.12, dist * 0.7);
    camera.lookAt(target);
  }, [level]);
  return null;
}

/* ─── AMBIENT ─── */


/* ─── ESCENARIOS ─── */
const ESCENARIOS = {
  Hogar: { label: 'Casa Hogar', icon: 'home' },
  Industrial: { label: 'Industrial', icon: 'factory' },
  Edificio: { label: 'Edificio', icon: 'apartment' },
  Comercio: { label: 'Local', icon: 'store' },
};

function Escenario({ scenario, children }) {
  const gtx = useMemo(grassTex, []);
  const ctx = useMemo(concTex, []);

  if (scenario === 'Hogar') {
    return (
      <group>
        {children}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} /><meshStandardMaterial map={gtx} roughness={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
          <planeGeometry args={[6, 8]} /><meshStandardMaterial map={ctx} roughness={0.9} />
        </mesh>
        <group position={[0, 0, 1.6]}>
          <mesh position={[-4.3, 1.5, 0]} castShadow><boxGeometry args={[3.5, 3.0, 0.2]} /><meshStandardMaterial color="#f0ede8" roughness={0.92} /></mesh>
          <mesh position={[4.3, 1.5, 0]} castShadow><boxGeometry args={[3.5, 3.0, 0.2]} /><meshStandardMaterial color="#f0ede8" roughness={0.92} /></mesh>
          <mesh position={[-4.3, 1.7, 0.12]}><boxGeometry args={[0.8, 0.7, 0.02]} /><meshPhysicalMaterial color="#ffe8a0" transparent opacity={0.6} roughness={0.05} metalness={0} ior={1.5} emissive="#ffe8a0" emissiveIntensity={0.3} /></mesh>
          <mesh position={[-4.3, 1.7, 0.13]}><boxGeometry args={[0.82, 0.72, 0.01]} /><meshStandardMaterial color="#666" roughness={0.7} wireframe /></mesh>
          <mesh position={[-4.3, 0.08, 0.15]}><boxGeometry args={[3.5, 0.06, 0.15]} /><meshStandardMaterial color="#3a7a2a" roughness={0.95} /></mesh>
          <mesh position={[4.3, 0.08, 0.15]}><boxGeometry args={[3.5, 0.06, 0.15]} /><meshStandardMaterial color="#3a7a2a" roughness={0.95} /></mesh>
          {[-3.5, -2.5, -1.5, 2.5, 3.5].map(x => (
            <mesh key={x} position={[x, 0.12, 0.2]}><sphereGeometry args={[0.04, 4, 4]} /><meshBasicMaterial color={['#ff6b6b','#ffd93d','#ff8a5c','#6bcb77','#4d96ff'][Math.abs(Math.round(x)) % 5]} /></mesh>
          ))}
          <mesh position={[0, 0.05, 1.2]}><boxGeometry args={[0.8, 0.02, 0.2]} /><meshStandardMaterial color="#bbb" roughness={0.9} /></mesh>
          <mesh position={[0, 3.0, 0]}><boxGeometry args={[5.0, 0.2, 0.25]} /><meshStandardMaterial color="#ddd" roughness={0.9} /></mesh>
          <mesh position={[0, 3.3, -0.4]} rotation={[0.05, 0, 0]}><boxGeometry args={[8, 0.06, 1.6]} /><meshStandardMaterial color="#8a6a4a" roughness={0.95} /></mesh>
          <mesh position={[0, 3.3, -0.1]} rotation={[-0.05, 0, 0]}><boxGeometry args={[8, 0.06, 1.6]} /><meshStandardMaterial color="#7a5a3a" roughness={0.95} /></mesh>
          <mesh position={[-0.5, 3.2, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#222" roughness={0.3} /></mesh>
          <mesh position={[-0.5, 3.2, 0.04]}><boxGeometry args={[0.02, 0.01, 0.04]} /><meshBasicMaterial color="#44aaff" emissive="#44aaff" emissiveIntensity={0.5} /></mesh>
          <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[10.5, 0.3, 1.4]} /><meshStandardMaterial color="#c8b8a0" roughness={0.85} /></mesh>
          <mesh position={[-5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.3, 1.4]} /><meshStandardMaterial color="#c8b8a0" roughness={0.85} /></mesh>
          <mesh position={[5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.3, 1.4]} /><meshStandardMaterial color="#c8b8a0" roughness={0.85} /></mesh>
          <mesh position={[0, 1.38, -0.12]}><boxGeometry args={[5.2, 0.08, 0.06]} /><meshStandardMaterial color="#a89888" roughness={0.8} /></mesh>
          <mesh position={[-4.8, 0.5, -0.1]}><cylinderGeometry args={[0.02, 0.03, 1.0, 6]} /><meshStandardMaterial color="#555" roughness={0.5} /></mesh>
          <mesh position={[-4.8, 1.0, -0.1]}><sphereGeometry args={[0.06, 6, 6]} /><meshBasicMaterial color="#ffe080" emissive="#ffe080" emissiveIntensity={0.2} /></mesh>
        </group>
        <mesh position={[0, 6, -14]}><planeGeometry args={[50, 16]} /><meshBasicMaterial color="#1a1a2e" side={THREE.DoubleSide} /></mesh>
      </group>
    );
  }

  if (scenario === 'Industrial') {
    return (
      <group>
        {children}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} /><meshStandardMaterial color="#4a4a4f" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
          <planeGeometry args={[5.6, 7]} /><meshStandardMaterial color="#5a5a5f" roughness={0.8} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, 0.003, 0]}><planeGeometry args={[0.02, 12]} /><meshBasicMaterial color="#666" /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.8, 0.003, 0]}><planeGeometry args={[0.02, 12]} /><meshBasicMaterial color="#666" /></mesh>
        <group position={[0, 0, 1.6]}>
          {[-4.3, 4.3].map(side => (
            <group key={side}>
              <mesh position={[side, 1.6, 0]} castShadow><boxGeometry args={[3.5, 3.2, 0.15]} /><meshStandardMaterial color="#5a5a5a" roughness={0.6} metalness={0.4} /></mesh>
              {[-1.2, -0.4, 0.4, 1.2].map((y, i) => (
                <mesh key={i} position={[side, 1.62 + y, 0.08]}><boxGeometry args={[3.5, 0.005, 0.02]} /><meshStandardMaterial color="#444" roughness={0.5} metalness={0.6} /></mesh>
              ))}
            </group>
          ))}
          <mesh position={[-4.3, 0.25, 0]} castShadow><boxGeometry args={[3.5, 0.3, 0.17]} /><meshStandardMaterial color="#555" roughness={0.9} /></mesh>
          <mesh position={[4.3, 0.25, 0]} castShadow><boxGeometry args={[3.5, 0.3, 0.17]} /><meshStandardMaterial color="#555" roughness={0.9} /></mesh>
          <mesh position={[0, 3.0, 0]}><boxGeometry args={[5.0, 0.3, 0.17]} /><meshStandardMaterial color="#444" roughness={0.5} metalness={0.7} /></mesh>
          <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[10.5, 0.35, 1.4]} /><meshStandardMaterial color="#444" roughness={0.6} metalness={0.3} /></mesh>
          <mesh position={[-5.2, 3.5, 0]} castShadow><boxGeometry args={[0.3, 0.35, 1.4]} /><meshStandardMaterial color="#444" roughness={0.6} metalness={0.3} /></mesh>
          <mesh position={[5.2, 3.5, 0]} castShadow><boxGeometry args={[0.3, 0.35, 1.4]} /><meshStandardMaterial color="#444" roughness={0.6} metalness={0.3} /></mesh>
          <mesh position={[0, 3.2, -0.4]}><sphereGeometry args={[0.1, 8, 8]} /><meshBasicMaterial color="#ffee88" /></mesh>
          <mesh position={[0, 3.2, -0.4]}><coneGeometry args={[0.2, 0.28, 8]} /><meshStandardMaterial color="#333" roughness={0.3} /></mesh>
          <mesh position={[0, 2.8, -0.4]}><cylinderGeometry args={[0.008, 0.008, 0.4, 4]} /><meshStandardMaterial color="#444" /></mesh>
          <mesh position={[4.3, 2.5, 0.1]}><boxGeometry args={[0.06, 0.04, 0.04]} /><meshStandardMaterial color="#111" roughness={0.3} /></mesh>
          <mesh position={[4.3, 2.5, 0.12]}><sphereGeometry args={[0.015, 6, 6]} /><meshBasicMaterial color="#ff4444" /></mesh>
          <mesh position={[-4.3, 1.8, 0.1]}><boxGeometry args={[0.25, 0.35, 0.02]} /><meshStandardMaterial color="#222" roughness={0.2} /></mesh>
          <mesh position={[-4.3, 1.8, 0.11]}><planeGeometry args={[0.15, 0.2]} /><meshBasicMaterial color="#00cc44" /></mesh>
          {[0.5, 0.8, 1.1, 1.4].map(y => (
            <mesh key={y} position={[-4.3, y, 0.1]}><boxGeometry args={[0.1, 0.005, 0.04]} /><meshStandardMaterial color="#444" metalness={0.5} /></mesh>
          ))}
          <mesh position={[0, 1.38, -0.12]}><boxGeometry args={[5.2, 0.08, 0.06]} /><meshStandardMaterial color="#666" roughness={0.8} /></mesh>
        </group>
        <mesh position={[0, 6, -14]}><planeGeometry args={[50, 16]} /><meshBasicMaterial color="#8a9aa8" side={THREE.DoubleSide} /></mesh>
      </group>
    );
  }

  if (scenario === 'Edificio') {
    return (
      <group>
        {children}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} /><meshStandardMaterial color="#7a7a80" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
          <planeGeometry args={[5.6, 7]} /><meshStandardMaterial color="#888890" roughness={0.5} />
        </mesh>
        <mesh position={[-4.8, 1.6, 1.6]} castShadow><boxGeometry args={[0.35, 3.2, 0.35]} /><meshStandardMaterial color="#b0a898" roughness={0.9} /></mesh>
        <mesh position={[4.8, 1.6, 1.6]} castShadow><boxGeometry args={[0.35, 3.2, 0.35]} /><meshStandardMaterial color="#b0a898" roughness={0.9} /></mesh>
        <mesh position={[-4.8, 0.3, 1.6]}><boxGeometry args={[0.36, 0.15, 0.36]} /><meshBasicMaterial color="#ffcc00" /></mesh>
        <mesh position={[4.8, 0.3, 1.6]}><boxGeometry args={[0.36, 0.15, 0.36]} /><meshBasicMaterial color="#ffcc00" /></mesh>
        <group position={[0, 0, 1.6]}>
          <mesh position={[-4.3, 1.6, 0]} castShadow><boxGeometry args={[3.5, 3.2, 0.2]} /><meshStandardMaterial color="#c8b8a8" roughness={0.9} /></mesh>
          <mesh position={[4.3, 1.6, 0]} castShadow><boxGeometry args={[3.5, 3.2, 0.2]} /><meshStandardMaterial color="#c8b8a8" roughness={0.9} /></mesh>
          <mesh position={[-4.3, 2.0, 0.11]}><boxGeometry args={[0.35, 0.25, 0.02]} /><meshStandardMaterial color="#fff" roughness={0.5} /></mesh>
          <mesh position={[4.3, 2.0, 0.11]}><boxGeometry args={[0.35, 0.25, 0.02]} /><meshStandardMaterial color="#fff" roughness={0.5} /></mesh>
          <mesh position={[0, 0.01, 1.0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5.0, 0.03]} /><meshBasicMaterial color="#ffcc00" /></mesh>
          <mesh position={[0, 0.01, 0.3]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5.0, 0.03]} /><meshBasicMaterial color="#ffcc00" /></mesh>
          <mesh position={[-1.2, 0.06, 0.8]}><boxGeometry args={[0.3, 0.06, 0.1]} /><meshStandardMaterial color="#333" roughness={0.5} /></mesh>
          <mesh position={[1.2, 0.06, 0.8]}><boxGeometry args={[0.3, 0.06, 0.1]} /><meshStandardMaterial color="#333" roughness={0.5} /></mesh>
          <mesh position={[-4.3, 0.2, 0]} castShadow><boxGeometry args={[3.5, 0.2, 0.22]} /><meshStandardMaterial color="#777" roughness={0.8} /></mesh>
          <mesh position={[4.3, 0.2, 0]} castShadow><boxGeometry args={[3.5, 0.2, 0.22]} /><meshStandardMaterial color="#777" roughness={0.8} /></mesh>
          <mesh position={[0, 3.0, 0]}><boxGeometry args={[5.0, 0.2, 0.22]} /><meshStandardMaterial color="#888" roughness={0.8} /></mesh>
          <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[10.5, 0.25, 1.4]} /><meshStandardMaterial color="#9a9aa0" roughness={0.9} /></mesh>
          <mesh position={[-5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.25, 1.4]} /><meshStandardMaterial color="#9a9aa0" roughness={0.9} /></mesh>
          <mesh position={[5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.25, 1.4]} /><meshStandardMaterial color="#9a9aa0" roughness={0.9} /></mesh>
          <mesh position={[0, 3.3, 0]}><boxGeometry args={[0.6, 0.02, 0.1]} /><meshStandardMaterial color="#ddd" roughness={0.3} /></mesh>
          <mesh position={[0, 3.3, 0]}><planeGeometry args={[0.5, 0.05]} /><meshBasicMaterial color="#fff8e0" emissive="#fff8e0" emissiveIntensity={0.5} /></mesh>
          <mesh position={[0, 3.3, 0.4]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color="#111" roughness={0.2} /></mesh>
          <mesh position={[0, 3.3, 0.42]}><boxGeometry args={[0.01, 0.01, 0.02]} /><meshBasicMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} /></mesh>
          <mesh position={[-4.3, 1.0, 0.12]}><cylinderGeometry args={[0.015, 0.015, 0.8, 6]} /><meshStandardMaterial color="#666" metalness={0.8} /></mesh>
          <mesh position={[0, 1.38, -0.12]}><boxGeometry args={[5.2, 0.08, 0.06]} /><meshStandardMaterial color="#888" roughness={0.8} /></mesh>
        </group>
        <mesh position={[0, 6, -14]}><planeGeometry args={[50, 16]} /><meshBasicMaterial color="#b0b8c0" side={THREE.DoubleSide} /></mesh>
      </group>
    );
  }

  if (scenario === 'Comercio') {
    return (
      <group>
        {children}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} /><meshStandardMaterial color="#d0c8be" roughness={0.9} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
          <planeGeometry args={[6, 8]} /><meshStandardMaterial color="#c0b8ae" roughness={0.6} />
        </mesh>
        <group position={[0, 0, 1.6]}>
          <mesh position={[-4.3, 1.6, 0]} castShadow><boxGeometry args={[3.5, 3.2, 0.2]} /><meshStandardMaterial color="#e8ddd0" roughness={0.9} /></mesh>
          <mesh position={[-4.3, 1.6, 0.11]}><boxGeometry args={[1.8, 2.0, 0.02]} /><meshPhysicalMaterial color="#a8d8f0" transparent opacity={0.2} roughness={0.02} metalness={0.1} ior={1.5} /></mesh>
          <mesh position={[-4.3, 1.6, 0.12]}><boxGeometry args={[1.85, 2.05, 0.015]} /><meshStandardMaterial color="#666" roughness={0.3} metalness={0.8} wireframe /></mesh>
          <mesh position={[-4.3, 0.2, 0.15]}><boxGeometry args={[0.08, 0.2, 0.02]} /><meshStandardMaterial color="#555" roughness={0.5} /></mesh>
          <mesh position={[-4.3, 0.35, 0.15]}><sphereGeometry args={[0.04, 6, 6]} /><meshStandardMaterial color="#ffccaa" roughness={0.6} /></mesh>
          <mesh position={[4.3, 1.6, 0]} castShadow><boxGeometry args={[3.5, 3.2, 0.2]} /><meshStandardMaterial color="#e8ddd0" roughness={0.9} /></mesh>
          <mesh position={[0, 2.6, 0]}><boxGeometry args={[3.0, 0.35, 0.1]} /><meshStandardMaterial color="#1a1a2e" roughness={0.2} /></mesh>
          <mesh position={[0, 2.6, 0.06]}><planeGeometry args={[2.5, 0.2]} /><meshBasicMaterial color="#ff6699" emissive="#ff6699" emissiveIntensity={0.6} /></mesh>
          <mesh position={[0, 2.85, 0]}><boxGeometry args={[2.0, 0.02, 0.04]} /><meshBasicMaterial color="#ffe8aa" emissive="#ffe8aa" emissiveIntensity={0.3} /></mesh>
          <mesh position={[-4.3, 0.2, 0]} castShadow><boxGeometry args={[3.5, 0.2, 0.22]} /><meshStandardMaterial color="#444" roughness={0.7} /></mesh>
          <mesh position={[4.3, 0.2, 0]} castShadow><boxGeometry args={[3.5, 0.2, 0.22]} /><meshStandardMaterial color="#444" roughness={0.7} /></mesh>
          <mesh position={[0, 3.0, 0]}><boxGeometry args={[5.0, 0.2, 0.22]} /><meshStandardMaterial color="#999" roughness={0.8} /></mesh>
          <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[10.5, 0.3, 1.4]} /><meshStandardMaterial color="#888" roughness={0.85} /></mesh>
          <mesh position={[-5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.3, 1.4]} /><meshStandardMaterial color="#888" roughness={0.85} /></mesh>
          <mesh position={[5.2, 3.5, 0]} castShadow><boxGeometry args={[0.25, 0.3, 1.4]} /><meshStandardMaterial color="#888" roughness={0.85} /></mesh>
          <mesh position={[0, 2.2, 0.11]}><boxGeometry args={[0.15, 0.02, 0.02]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 2.2, 0.12]}><boxGeometry args={[0.04, 0.01, 0.01]} /><meshBasicMaterial color="#44ff44" /></mesh>
          <mesh position={[-4.3, 3.2, 0]}><boxGeometry args={[0.8, 0.02, 0.08]} /><meshBasicMaterial color="#ffeecc" emissive="#ffeecc" emissiveIntensity={0.2} /></mesh>
          <mesh position={[4.3, 3.2, 0]}><boxGeometry args={[0.8, 0.02, 0.08]} /><meshBasicMaterial color="#ffeecc" emissive="#ffeecc" emissiveIntensity={0.2} /></mesh>
          {[-3.5, -1.5, 1.5, 3.5].map(x => (
            <mesh key={x} position={[x, 3.3, 0]}><boxGeometry args={[0.04, 0.005, 0.04]} /><meshBasicMaterial color="#44aaff" emissive="#44aaff" emissiveIntensity={0.4} /></mesh>
          ))}
          <mesh position={[0, 1.38, -0.12]}><boxGeometry args={[5.2, 0.08, 0.06]} /><meshStandardMaterial color="#888" roughness={0.8} /></mesh>
        </group>
        <mesh position={[0, 6, -14]}><planeGeometry args={[50, 16]} /><meshBasicMaterial color="#c0d0e0" side={THREE.DoubleSide} /></mesh>
      </group>
    );
  }
}

/* ─── PORTÓN ─── */
const GateModel = React.memo(function GateModel({ tipo, color, material, diseno, automatico, ancho, alto, open, ventanas, peatonal, subMaterial, motorMarca }) {
  const pRef = useRef(0);
  const panels = useRef({});

  const COLORS = { 'Negro': '#111', 'Blanco': '#f8f8f8', 'Gris': '#686c72', 'Marrón': '#3a221d', 'Imitación madera clara': '#d0a678', 'Imitación madera oscura': '#5e3812', 'Nogal': '#4a2c0e', 'Beige': '#d4c5a9' };
  const gateColor = COLORS[color] || '#686c72';
  const isWood = material === 'Madera';
  const isAlu = material === 'Aluminio';

  const sx = parseFloat(ancho) ? THREE.MathUtils.clamp(parseFloat(ancho) / 3, 0.5, 2) : 1;
  const sy = parseFloat(alto) ? THREE.MathUtils.clamp(parseFloat(alto) / 2.4, 0.5, 2) : 1;
  const pw = 3.8 * sx; const ph = 2.2 * sy;
  const h = ph / 4;

  const wood = useMemo(() => isWood ? woodTex(subMaterial === 'Cedro' ? 'cedro' : subMaterial === 'Tornillo' ? 'tornillo' : 'caoba') : null, [isWood, subMaterial]);
  const metal = useMemo(() => !isWood ? metalTex() : null, [isWood]);

  const gmat = (col, r, m) => {
    if (isWood) return <meshStandardMaterial color={col} map={wood} roughness={r ?? 0.4} metalness={0.01} />;
    return <meshStandardMaterial color={col} map={metal} roughness={r ?? (isAlu ? 0.08 : 0.2)} metalness={m ?? (isAlu ? 0.98 : 0.88)} />;
  };

  const Win = ({ wx, wy, ww, wh }) => (
    <group position={[wx, wy, 0.015]}>
      <mesh><planeGeometry args={[ww, wh]} /><meshPhysicalMaterial color="#a8d8f0" transparent opacity={0.35} roughness={0} metalness={0} ior={1.5} /></mesh>
    </group>
  );

  const Handle = ({ x, y }) => (
    <group position={[x, y, 0.07]}>
      <mesh position={[0, 0, 0.04]}><boxGeometry args={[0.03, 0.28, 0.02]} /><meshStandardMaterial color="#e0e0e0" metalness={0.95} roughness={0.08} /></mesh>
      <mesh position={[0.12, 0, 0.02]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.008, 0.008, 0.2, 8]} /><meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.15} /></mesh>
    </group>
  );

  const Peatonal = ({ px, py }) => (
    <group position={[px, py, 0.05]}>
      <mesh><boxGeometry args={[0.55, 1.0, 0.02]} /><meshStandardMaterial color={gateColor} map={isWood ? wood : metal} roughness={isWood ? 0.6 : 0.25} metalness={isWood ? 0.01 : 0.85} /></mesh>
      <mesh position={[0.22, 0, 0.015]}><boxGeometry args={[0.015, 0.04, 0.05]} /><meshStandardMaterial color="#d0d0d0" metalness={0.95} roughness={0.1} /></mesh>
    </group>
  );

  const motorColors = { LiftMaster: '#1565C0', Powergate: '#E65100', Smartlift: '#2E7D32', Nice: '#6A1B9A' };
  const motorColor = motorColors[motorMarca] || '#333';
  const Motor = () => (
    <group position={[0, sy * 1.35, -0.8]}>
      <mesh castShadow><boxGeometry args={[0.06, 0.06, 3.2]} /><meshStandardMaterial color="#444" roughness={0.4} metalness={0.8} /></mesh>
      <mesh position={[0, 0.14, 1.5]} castShadow><boxGeometry args={[0.5, 0.3, 0.6]} /><meshStandardMaterial color={motorColor} roughness={0.25} metalness={0.3} /></mesh>
      <mesh position={[0, 0.14, 1.85]}><cylinderGeometry args={[0.08, 0.1, 0.08, 12]} /><meshStandardMaterial color="#222" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0, 0.26, 1.5]}><sphereGeometry args={[0.025, 8, 8]} /><meshBasicMaterial color="#00ff00" /></mesh>
      <mesh position={[0, 0.14, 1.1]}><cylinderGeometry args={[0.01, 0.01, 0.3, 4]} /><meshStandardMaterial color="#222" roughness={0.5} /></mesh>
      <mesh position={[0.25, 0.02, 1.5]}><boxGeometry args={[0.03, 0.01, 0.02]} /><meshBasicMaterial color="#ffffff" opacity={0.3} transparent /></mesh>
    </group>
  );

  const inset = (w, h) => <mesh position={[0, 0, 0.048]}><boxGeometry args={[w - 0.5, h - 0.2, 0.015]} /><meshStandardMaterial color={gateColor} roughness={isWood ? 0.7 : 0.3} metalness={isWood ? 0.01 : 0.85} /></mesh>;
  const decoLine = (y, w, h, col) => <mesh position={[0, y, 0.052]}><boxGeometry args={[w, h, 0.012]} /><meshStandardMaterial color={col} roughness={0.6} metalness={isWood ? 0 : 0.3} /></mesh>;

  useFrame((_, delta) => {
    const target = open ? 1 : 0;
    pRef.current = THREE.MathUtils.lerp(pRef.current, target, delta * 4);
    const p = pRef.current;
    const cur = panels.current;
    if (tipo === 'Seccional') {
      for (let i = 0; i < 4; i++) {
        const panel = cur['s' + i];
        if (!panel) continue;
        const pp = THREE.MathUtils.clamp(p * 1.6 - (3 - i) * 0.18, 0, 1);
        panel.position.y = (i - 1.5) * h + pp * 1.6 * sy;
        panel.position.z = -pp * 1.9 * sy;
        panel.rotation.x = -pp * 1.35;
      }
    } else if (tipo === 'Levadizo') {
      const panel = cur.lev;
      if (panel) { panel.position.y = 1.2 * sy * p; panel.position.z = -1.2 * sy * p; panel.rotation.x = (-Math.PI / 2.3) * p; }
    } else if (tipo === 'Corredizo') {
      const panel = cur.corr;
      if (panel) panel.position.x = -4 * sx * p;
    } else if (tipo === 'Batiente') {
      if (cur.b0) cur.b0.rotation.y = -(Math.PI / 2) * p;
      if (cur.b1) cur.b1.rotation.y = (Math.PI / 2) * p;
    }
  });

  const refCache = useRef({});
  const setRef = useCallback((key) => {
    if (!refCache.current[key]) {
      refCache.current[key] = (el) => { panels.current[key] = el; };
    }
    return refCache.current[key];
  }, []);

  if (tipo === 'Seccional') {
    return (
      <group>
        <group>
          {[0, 1, 2, 3].map(i => (
            <group key={i}>
              <mesh ref={setRef('s' + i)} position={[0, (i - 1.5) * h, 0]} castShadow receiveShadow>
                <boxGeometry args={[pw, h - 0.015, 0.1]} />{gmat(gateColor)}
                {diseno !== 'Moderno' && inset(pw, h)}
                {diseno === 'Clásico' && (<> {decoLine(h * 0.2, pw - 0.6, 0.02, '#666')} {decoLine(-h * 0.2, pw - 0.6, 0.02, '#666')} </>)}
                {diseno === 'Industrial' && (<> {decoLine(h * 0.18, pw - 0.3, 0.025, '#333')} {decoLine(-h * 0.18, pw - 0.3, 0.025, '#333')} </>)}
                {diseno === 'Rústico' && (<> {decoLine(h * 0.22, pw - 0.4, 0.01, '#5c3a1e')} {decoLine(-h * 0.22, pw - 0.4, 0.01, '#5c3a1e')} </>)}
              </mesh>
              {ventanas && i === 2 && <Win wx={0} wy={0} ww={pw * 0.5} wh={h * 0.35} />}
              {i === 0 && <Handle x={pw / 2 - 0.25} y={0} />}
            </group>
          ))}
          {peatonal && <Peatonal px={pw / 2 - 0.55} py={-ph / 2 + 0.55} />}
        </group>
        <mesh position={[-pw / 2 - 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
        <mesh position={[pw / 2 + 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
        {automatico && <Motor />}
      </group>
    );
  }

  if (tipo === 'Levadizo') return (
    <group>
      <group ref={setRef('lev')}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw, ph, 0.1]} />{gmat(gateColor)}
          {diseno !== 'Moderno' && inset(pw, ph)}
          {diseno === 'Clásico' && [-pw / 4, 0, pw / 4].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.04, ph - 0.3, 0.012]} /><meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} /></mesh>
          ))}
          {diseno === 'Industrial' && [-1.4, -0.93, -0.47, 0, 0.47, 0.93, 1.4].map((v, idx) => (
            <mesh key={idx} position={[v * sx, 0, 0.052]}><boxGeometry args={[0.04, ph - 0.2, 0.012]} /><meshStandardMaterial color="#333" roughness={0.9} metalness={0.5} /></mesh>
          ))}
          {diseno === 'Rústico' && [0, 1, 2].map(i => (
            <mesh key={i} position={[-pw / 2 + 0.4 + i * 1.4 * sx, 0, 0.052]}><boxGeometry args={[0.1, ph - 0.2, 0.015]} /><meshStandardMaterial color="#5c3a1e" roughness={0.95} /></mesh>
          ))}
        </mesh>
        {ventanas && <Win wx={0} wy={0.15} ww={pw * 0.4} wh={ph * 0.2} />}
        {peatonal && <Peatonal px={pw / 2 - 0.5} py={-ph / 2 + 0.55} />}
        <Handle x={pw / 2 - 0.25} y={-0.25} />
      </group>
      <mesh position={[-pw / 2 - 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      <mesh position={[pw / 2 + 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      {automatico && <Motor />}
    </group>
  );

  if (tipo === 'Corredizo') return (
    <group>
      <group ref={setRef('corr')}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw, ph, 0.1]} />{gmat(gateColor)}
          {diseno !== 'Moderno' && inset(pw, ph)}
          {diseno === 'Clásico' && [-pw / 3, 0, pw / 3].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.12, ph - 0.3, 0.012]} /><meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} /></mesh>
          ))}
          {diseno === 'Industrial' && [-pw / 3, 0, pw / 3].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.15, ph - 0.2, 0.018]} /><meshStandardMaterial color="#333" roughness={0.9} metalness={0.5} /></mesh>
          ))}
          {diseno === 'Rústico' && (
            <><mesh position={[-pw / 2 + 0.3, 0, 0.052]}><boxGeometry args={[0.06, ph - 0.15, 0.015]} /><meshStandardMaterial color="#5c3a1e" roughness={0.95} /></mesh>
            <mesh position={[pw / 2 - 0.3, 0, 0.052]}><boxGeometry args={[0.06, ph - 0.15, 0.015]} /><meshStandardMaterial color="#5c3a1e" roughness={0.95} /></mesh></>
          )}
        </mesh>
        {ventanas && <Win wx={pw * 0.2} wy={0} ww={pw * 0.28} wh={ph * 0.25} />}
        {peatonal && <Peatonal px={pw / 2 - 0.55} py={-ph / 2 + 0.55} />}
        <Handle x={pw / 2 - 0.25} y={0} />
      </group>
      <mesh position={[0, -ph / 2 - 0.12, 0.03]}><boxGeometry args={[pw * 1.6, 0.04, 0.15]} /><meshStandardMaterial color="#666" metalness={0.7} roughness={0.5} /></mesh>
      <mesh position={[-pw / 2 - 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      <mesh position={[pw / 2 + 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      {automatico && <Motor />}
    </group>
  );

  if (tipo === 'Batiente') return (
    <group>
      <group ref={setRef('b0')} position={[-pw / 2, 0, 0]}>
        <mesh position={[pw / 4, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw / 2 - 0.03, ph, 0.1]} />{gmat(gateColor)}
          {diseno !== 'Moderno' && inset(pw / 2, ph)}
          {diseno === 'Clásico' && [-pw / 12, pw / 12].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.04, ph - 0.2, 0.012]} /><meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} /></mesh>
          ))}
          {diseno === 'Industrial' && [-pw / 8, pw / 8].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.05, ph - 0.15, 0.015]} /><meshStandardMaterial color="#333" roughness={0.9} metalness={0.5} /></mesh>
          ))}
          {diseno === 'Rústico' && (
            <><mesh position={[-pw / 6, 0, 0.052]}><boxGeometry args={[0.05, ph - 0.15, 0.012]} /><meshStandardMaterial color="#5c3a1e" roughness={0.95} /></mesh>
            <mesh position={[pw / 6, 0, 0.052]}><boxGeometry args={[0.05, ph - 0.15, 0.012]} /><meshStandardMaterial color="#5c3a1e" roughness={0.95} /></mesh></>
          )}
        </mesh>
        <Handle x={pw / 2 - 0.25} y={-0.1} />
      </group>
      <group ref={setRef('b1')} position={[pw / 2, 0, 0]}>
        <mesh position={[-pw / 4, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[pw / 2 - 0.03, ph, 0.1]} />{gmat(gateColor)}
          {diseno !== 'Moderno' && inset(pw / 2, ph)}
          {diseno === 'Clásico' && [-pw / 12, pw / 12].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.04, ph - 0.2, 0.012]} /><meshStandardMaterial color="#666" roughness={0.6} metalness={0.3} /></mesh>
          ))}
          {diseno === 'Industrial' && [-pw / 8, pw / 8].map((v, idx) => (
            <mesh key={idx} position={[v, 0, 0.052]}><boxGeometry args={[0.05, ph - 0.15, 0.015]} /><meshStandardMaterial color="#333" roughness={0.9} metalness={0.5} /></mesh>
          ))}
        </mesh>
        <mesh position={[-0.06, 0, 0.052]}><boxGeometry args={[0.03, 0.05, 0.04]} /><meshStandardMaterial color="#d0d0d0" metalness={0.95} roughness={0.1} /></mesh>
      </group>
      <mesh position={[-pw / 2 - 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      <mesh position={[pw / 2 + 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      {automatico && <Motor />}
    </group>
  );

  return null;
});

/* ─── VISOR ─── */
function ModelViewer({ zoomLevel, escenario, ...props }) {
  return (
    <Canvas camera={{ position: [4.5, 3, 6], fov: 38, near: 0.1, far: 60 }}
      style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0 }}
      onCreated={({ gl }) => { gl.setClearColor('#1a1a2e', 1); gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFShadowMap; }}>
      <ZoomControl level={zoomLevel} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 6]} intensity={1.5} />
      <directionalLight position={[-4, 8, -3]} intensity={0.3} />
      <group position={[0, 1.08, 0]}>
        <Escenario scenario={escenario}>
          <group position={[0, 1.1, 0]}>
            <GateModel key={`${props.tipo}-${props.color}-${props.material}-${props.diseno}`} {...props} />
          </group>
        </Escenario>
      </group>
      <OrbitControls enableDamping dampingFactor={0.1} minDistance={2} maxDistance={12} target={[0, 2.2, 0]} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

/* ─── UI ─── */
function ColorPicker({ active, onChange }) {
  const colors = [
    { n: 'Imitación madera oscura', h: '#603813' }, { n: 'Imitación madera clara', h: '#d2a679' },
    { n: 'Nogal', h: '#4a2c0e' }, { n: 'Negro', h: '#111' }, { n: 'Blanco', h: '#fafafa' },
    { n: 'Gris', h: '#6a6e74' }, { n: 'Marrón', h: '#3a221d' }, { n: 'Beige', h: '#d4c5a9' },
  ];
  return (
    <div><label style={s.label}>Color</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {colors.map(c => (
          <button key={c.n} type="button" onClick={() => onChange(c.n)} title={c.n}
            style={{ width: 22, height: 22, borderRadius: '50%', border: active === c.n ? '2px solid #9d4300' : '2px solid #e0c0b1', background: c.h, cursor: 'pointer', transform: active === c.n ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.12s', outline: active === c.n ? '3px solid rgba(157,67,0,0.2)' : 'none', padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

function OptSel({ title, options, active, onChange, cols }) {
  return (
    <div><label style={s.label}>{title}</label>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols || 3}, 1fr)`, gap: 3 }}>
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)}
            style={{ padding: '5px 4px', borderRadius: 7, border: active === o ? '1.5px solid #9d4300' : '1px solid #e0c0b1', background: active === o ? 'rgba(157,67,0,0.1)' : 'rgba(255,255,255,0.85)', color: active === o ? '#9d4300' : '#584237', fontWeight: 600, fontSize: 9, cursor: 'pointer', transition: 'all 0.12s' }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function TogChip({ label, icon, value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 7px', borderRadius: 7, border: value ? '1.5px solid #9d4300' : '1px solid #e0c0b1', background: value ? 'rgba(157,67,0,0.1)' : 'rgba(255,255,255,0.85)', color: value ? '#9d4300' : '#584237', fontWeight: 600, fontSize: 9, cursor: 'pointer', transition: 'all 0.12s' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{icon}</span>
      {label}
    </button>
  );
}

const s = { label: { fontSize: 9, fontWeight: 700, color: '#584237', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3, display: 'block' } };

/* ─── MAIN ─── */
function Configurator() {
  const [tipo, setTipo] = useState('Seccional');
  const [color, setColor] = useState('Imitación madera oscura');
  const [material, setMaterial] = useState('Madera');
  const [diseno, setDiseno] = useState('Moderno');
  const [automatico, setAutomatico] = useState(true);
  const [ancho, setAncho] = useState('3.0');
  const [alto, setAlto] = useState('2.4');
  const [open, setOpen] = useState(false);
  const [ventanas, setVentanas] = useState(false);
  const [peatonal, setPeatonal] = useState(false);
  const [subMaterial, setSubMaterial] = useState('Cedro');
  const [motorMarca, setMotorMarca] = useState('LiftMaster');
  const [zoomLevel, setZoomLevel] = useState(0);
  const [escenario, setEscenario] = useState('Hogar');

  const whatsapp = () => {
    const t = `Hola, quiero cotizar este portón.%0A%0ATipo: ${tipo}%0AMaterial: ${material}${material === 'Madera' ? ` (${subMaterial})` : ''}%0AColor: ${color}%0ADiseño: ${diseno}%0AVentanas: ${ventanas ? 'Sí' : 'No'}%0APeatonal: ${peatonal ? 'Sí' : 'No'}%0AMotor: ${automatico ? motorMarca : 'Manual'}%0AMedidas: ${ancho}m x ${alto}m%0A%0AGracias.`;
    window.open(`https://wa.me/51930618991?text=${t}`, '_blank');
  };

  const reset = () => {
    setTipo('Seccional'); setMaterial('Madera'); setColor('Imitación madera oscura');
    setDiseno('Moderno'); setAutomatico(true); setAncho('3.0'); setAlto('2.4');
    setVentanas(false); setPeatonal(false); setSubMaterial('Cedro'); setMotorMarca('LiftMaster');
    setOpen(false); setZoomLevel(0); setEscenario('Hogar');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
        <ModelViewer
          tipo={tipo} color={color} material={material} diseno={diseno}
          automatico={automatico} ancho={ancho} alto={alto} open={open}
          ventanas={ventanas} peatonal={peatonal} subMaterial={subMaterial} motorMarca={motorMarca}
          zoomLevel={zoomLevel} escenario={escenario} />

        <div style={{ position: 'absolute', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setZoomLevel(z => Math.max(z - 1, 0))} style={btn} title="Alejar"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span></button>
          <button onClick={reset} style={btn} title="Restablecer"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span></button>
          <button onClick={() => setOpen(!open)} style={{ ...btn, padding: '7px 16px', width: 'auto' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{open ? 'lock_open' : 'lock'}</span>
            <span style={{ fontSize: 11 }}>{open ? 'Cerrar' : 'Abrir'}</span>
          </button>
          <button onClick={() => setZoomLevel(z => Math.min(z + 1, 5))} style={btn} title="Acercar"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span></button>
        </div>

        <button onClick={whatsapp}
          style={{ position: 'absolute', bottom: 18, right: 18, zIndex: 20, background: 'linear-gradient(to right, #f97316, #ea580c)', color: '#fff', border: 'none', fontWeight: 700, padding: '9px 18px', borderRadius: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, boxShadow: '0 8px 28px rgba(249,115,22,0.35)' }}>
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          Cotizar
        </button>

        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 20, width: 250 }}>
          <div style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 11px', borderBottom: '1px solid #e0c0b1', background: 'linear-gradient(to right, rgba(157,67,0,0.04), transparent)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1a1c1c', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#9d4300' }}>tune</span>
                Personalizar
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'block' }} />
                <span style={{ fontSize: 7, color: '#584237', fontWeight: 500 }}>3D</span>
              </span>
            </div>
            <div style={{ padding: '8px 11px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <div style={{ marginBottom: 6 }}>
                <label style={{ ...s.label, color: '#9d4300', fontSize: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 10 }}>visibility</span> Escenario
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
                  {Object.entries(ESCENARIOS).map(([k, v]) => (
                    <button key={k} type="button" onClick={() => setEscenario(k)}
                      style={{ padding: '5px 2px', borderRadius: 7, border: escenario === k ? '1.5px solid #9d4300' : '1px solid #e0c0b1', background: escenario === k ? 'rgba(157,67,0,0.1)' : 'rgba(255,255,255,0.85)', color: escenario === k ? '#9d4300' : '#584237', fontWeight: 600, fontSize: 7.5, cursor: 'pointer', transition: 'all 0.12s', textAlign: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 11, display: 'block', marginBottom: 1 }}>{v.icon}</span>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 5 }}><OptSel title="Tipo" options={['Seccional', 'Levadizo', 'Corredizo', 'Batiente']} active={tipo} onChange={setTipo} cols="4" /></div>
              <div style={{ marginBottom: 5 }}><OptSel title="Material" options={['Madera', 'Acero', 'Aluminio']} active={material === 'Acero Galvanizado' ? 'Acero' : material} onChange={v => setMaterial(v === 'Acero' ? 'Acero Galvanizado' : v)} cols="3" /></div>
              {material === 'Madera' && <div style={{ marginBottom: 5 }}><OptSel title="Tipo Madera" options={['Cedro', 'Tornillo', 'Caoba']} active={subMaterial} onChange={setSubMaterial} cols="3" /></div>}
              <div style={{ marginBottom: 5 }}><OptSel title="Diseño" options={['Moderno', 'Clásico', 'Industrial', 'Rústico']} active={diseno} onChange={setDiseno} cols="4" /></div>
              <div style={{ marginBottom: 5 }}><ColorPicker active={color} onChange={setColor} /></div>
              <div style={{ marginBottom: 5 }}>
                <label style={s.label}>Extras</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  <TogChip label="Ventanas" icon="window" value={ventanas} onChange={setVentanas} />
                  <TogChip label="Peatonal" icon="door_open" value={peatonal} onChange={setPeatonal} />
                  <TogChip label="Motor" icon="settings_remote" value={automatico} onChange={setAutomatico} />
                </div>
                {automatico && <div style={{ marginTop: 3 }}><OptSel title="Marca Motor" options={['LiftMaster', 'Powergate', 'Smartlift', 'Nice']} active={motorMarca} onChange={setMotorMarca} cols="4" /></div>}
              </div>
              <div>
                <label style={s.label}>Medidas (m)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  <div><label style={{ fontSize: 7, color: '#584237', display: 'block', marginBottom: 1 }}>Ancho</label>
                    <input type="number" step="0.1" min="1" max="8" value={ancho} onChange={e => setAncho(e.target.value)} style={inp} /></div>
                  <div><label style={{ fontSize: 7, color: '#584237', display: 'block', marginBottom: 1 }}>Alto</label>
                    <input type="number" step="0.1" min="1" max="6" value={alto} onChange={e => setAlto(e.target.value)} style={inp} /></div>
                </div>
              </div>
              <button onClick={whatsapp}
                style={{ width: '100%', marginTop: 8, background: 'linear-gradient(to right, #f97316, #ea580c)', color: '#fff', border: 'none', fontWeight: 700, padding: '8px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10, boxShadow: '0 3px 10px rgba(249,115,22,0.25)' }}>
                <svg viewBox="0 0 24 24" width="11" height="11" stroke="currentColor" strokeWidth="2.5" fill="none"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                Cotizar
              </button>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', padding: '4px 9px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontWeight: 600, color: '#1a1c1c' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: open ? '#22c55e' : '#9ca3af', display: 'block' }} />
          {tipo}
        </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

const btn = { background: 'rgba(255,255,255,0.88)', border: '1px solid #e0c0b1', color: '#1a1c1c', fontWeight: 600, padding: '7px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', backdropFilter: 'blur(8px)', boxShadow: '0 3px 12px rgba(0,0,0,0.05)', width: 34, height: 34 };
const inp = { width: '100%', background: 'rgba(255,255,255,0.85)', border: '1px solid #e0c0b1', borderRadius: 7, padding: '4px 7px', fontSize: 10, outline: 'none' };

createRoot(document.getElementById('root')).render(<Configurator />);
