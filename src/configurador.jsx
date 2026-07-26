import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ─── TEXTURAS PROCEDURALES (ligeras) ─── */
const _T = {};
function _mkTex(w, h, fn) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  fn(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4; t.needsUpdate = true;
  return t;
}
function tex(k, w, h, fn) { if (!_T[k]) _T[k] = _mkTex(w, h, fn); return _T[k]; }

function grassTex() { return tex('g',256,256,ctx=>{const d=ctx.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){d[i]=42;d[i+1]=100+Math.random()*50;d[i+2]=32;d[i+3]=255}ctx.putImageData(d,0,0)}); }
function concTex() { return tex('c',256,256,ctx=>{ctx.fillStyle='#b5a898';ctx.fillRect(0,0,256,256);for(let i=0;i<500;i++){ctx.fillStyle=`rgba(0,0,0,${0.01+Math.random()*0.03})`;ctx.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*4,1+Math.random()*4)}}); }
function metalTex() { return tex('m',256,256,ctx=>{ctx.fillStyle='#999';ctx.fillRect(0,0,256,256);for(let i=0;i<1000;i++){ctx.fillStyle=`rgba(255,255,255,${0.01+Math.random()*0.04})`;ctx.fillRect(Math.random()*256,0,1+Math.random(),256)}for(let i=0;i<500;i++){ctx.fillStyle=`rgba(0,0,0,${0.005+Math.random()*0.02})`;ctx.fillRect(Math.random()*256,0,1,256)}}); }
function woodTex(type) {
  const k='w_'+type; if(_T[k])return _T[k];
  const cs={cedro:'#8b5a2b',tornillo:'#c4944a',caoba:'#5c2e16'},ds={cedro:'#6a3e1e',tornillo:'#a07030',caoba:'#3e1a0e'};
  return _T[k]=_mkTex(512,128,(ctx,w,h)=>{ctx.fillStyle=cs[type]||'#8b5a2b';ctx.fillRect(0,0,w,h);for(let i=0;i<15;i++){const y=i*(h/15)+Math.random()*4;ctx.fillStyle=ds[type]||'#6a3e1e';ctx.globalAlpha=0.15+Math.random()*0.15;ctx.fillRect(0,y,w,4+Math.random()*8)}ctx.globalAlpha=1;ctx.fillStyle='rgba(0,0,0,0.03)';for(let i=0;i<50;i++){ctx.beginPath();ctx.ellipse(Math.random()*w,Math.random()*h,2+Math.random()*5,1+Math.random()*2,0,0,Math.PI*2);ctx.fill()}});
}

/* ─── ZOOM (corregido: + acerca, - aleja) ─── */
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

/* ─── ESCENA ─── */
function Scene({ children }) {
  const gtx = useMemo(grassTex, []);
  const ctx = useMemo(concTex, []);
  return (
    <group>
      {children}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} /><meshStandardMaterial map={gtx} roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 2.8]} receiveShadow>
        <planeGeometry args={[5.6, 7]} /><meshStandardMaterial map={ctx} roughness={0.9} />
      </mesh>
      <group position={[0, 0, 1.6]}>
        <mesh position={[-4.2, 1.6, 0]} castShadow><boxGeometry args={[3.6, 3.2, 0.3]} /><meshStandardMaterial color="#d8ccb8" roughness={0.9} /></mesh>
        <mesh position={[4.2, 1.6, 0]} castShadow><boxGeometry args={[3.6, 3.2, 0.3]} /><meshStandardMaterial color="#d8ccb8" roughness={0.9} /></mesh>
        <mesh position={[0, 3.1, 0]}><boxGeometry args={[4.8, 0.3, 0.3]} /><meshStandardMaterial color="#d8ccb8" roughness={0.9} /></mesh>
        <mesh position={[0, 3.5, 0]} castShadow><boxGeometry args={[10.5, 0.35, 1.4]} /><meshStandardMaterial color="#5a5a5a" roughness={0.9} /></mesh>
        <mesh position={[-5.2, 3.5, 0]} castShadow><boxGeometry args={[0.3, 0.35, 1.4]} /><meshStandardMaterial color="#5a5a5a" roughness={0.9} /></mesh>
        <mesh position={[5.2, 3.5, 0]} castShadow><boxGeometry args={[0.3, 0.35, 1.4]} /><meshStandardMaterial color="#5a5a5a" roughness={0.9} /></mesh>
        <mesh position={[0, 1.38, -0.12]}><boxGeometry args={[5.2, 0.1, 0.08]} /><meshStandardMaterial color="#b8a898" roughness={0.8} /></mesh>
        <mesh position={[-4.2, 0.4, 0]} castShadow><boxGeometry args={[3.6, 0.2, 0.35]} /><meshStandardMaterial color="#c8b8a0" roughness={0.95} /></mesh>
        <mesh position={[4.2, 0.4, 0]} castShadow><boxGeometry args={[3.6, 0.2, 0.35]} /><meshStandardMaterial color="#c8b8a0" roughness={0.95} /></mesh>
      </group>
      <mesh position={[0, 6, -14]}><planeGeometry args={[50, 16]} /><meshBasicMaterial color="#a8d0e8" side={THREE.DoubleSide} /></mesh>
    </group>
  );
}

/* ─── PORTÓN ─── */
function GateModel({ tipo, color, material, diseno, automatico, ancho, alto, open, ventanas, peatonal, subMaterial, motorMarca }) {
  const pRef = useRef(0);
  const panelsRef = useRef([]);
  useEffect(() => { panelsRef.current = []; }, [tipo, diseno, ancho, alto, ventanas, peatonal]);

  useFrame((_, delta) => {
    const target = open ? 1 : 0;
    pRef.current = THREE.MathUtils.lerp(pRef.current, target, delta * 4);
    const p = pRef.current;
    const sx = parseFloat(ancho) ? THREE.MathUtils.clamp(parseFloat(ancho) / 3, 0.5, 2) : 1;
    const sy = parseFloat(alto) ? THREE.MathUtils.clamp(parseFloat(alto) / 2.4, 0.5, 2) : 1;
    if (tipo === 'Seccional') {
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return;
        const pp = THREE.MathUtils.clamp(p * 1.6 - (3 - i) * 0.18, 0, 1);
        panel.position.y = (i - 1.5) * 0.5 * sy + pp * 1.6 * sy;
        panel.position.z = -pp * 1.9 * sy;
        panel.rotation.x = -pp * 1.35;
      });
    } else if (tipo === 'Levadizo') {
      const panel = panelsRef.current[0];
      if (panel) { panel.position.y = 1.2 * sy * p; panel.position.z = -1.2 * sy * p; panel.rotation.x = (-Math.PI / 2.3) * p; }
    } else if (tipo === 'Corredizo') {
      if (panelsRef.current[0]) panelsRef.current[0].position.x = -4 * sx * p;
    } else if (tipo === 'Batiente') {
      if (panelsRef.current[0]) panelsRef.current[0].rotation.y = -(Math.PI / 2) * p;
      if (panelsRef.current[1]) panelsRef.current[1].rotation.y = (Math.PI / 2) * p;
    }
  });

  const COLORS = { 'Negro': '#111', 'Blanco': '#f8f8f8', 'Gris': '#686c72', 'Marrón': '#3a221d', 'Imitación madera clara': '#d0a678', 'Imitación madera oscura': '#5e3812', 'Nogal': '#4a2c0e', 'Beige': '#d4c5a9' };
  const gateColor = COLORS[color] || '#686c72';
  const isWood = material === 'Madera';
  const isAlu = material === 'Aluminio';

  const wood = useMemo(() => isWood ? woodTex(subMaterial === 'Cedro' ? 'cedro' : subMaterial === 'Tornillo' ? 'tornillo' : 'caoba') : null, [isWood, subMaterial]);
  const metal = useMemo(() => !isWood ? metalTex() : null, [isWood]);

  const gmat = (col, r, m) => {
    if (isWood) return <meshStandardMaterial color={col} map={wood} roughness={r ?? 0.45} metalness={0.01} />;
    return <meshStandardMaterial color={col} map={metal} roughness={r ?? (isAlu ? 0.12 : 0.25)} metalness={m ?? (isAlu ? 0.95 : 0.82)} />;
  };

  const sx = parseFloat(ancho) ? THREE.MathUtils.clamp(parseFloat(ancho) / 3, 0.5, 2) : 1;
  const sy = parseFloat(alto) ? THREE.MathUtils.clamp(parseFloat(alto) / 2.4, 0.5, 2) : 1;
  const pw = 3.8 * sx; const ph = 2.2 * sy;

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

  const Motor = () => (
    <group position={[0, sy * 1.35, -0.8]}>
      <mesh castShadow><boxGeometry args={[0.08, 0.08, 3.5]} /><meshStandardMaterial color="#333" roughness={0.3} metalness={0.9} /></mesh>
      <mesh position={[0, 0.16, 1.6]} castShadow><boxGeometry args={[0.55, 0.35, 0.65]} /><meshStandardMaterial color="#212529" roughness={0.4} /></mesh>
      <mesh position={[0.38, 0.16, 1.6]}><boxGeometry args={[0.12, 0.08, 0.2]} /><meshStandardMaterial color="#666" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 0.32, 1.6]}><sphereGeometry args={[0.03, 12, 12]} /><meshBasicMaterial color="#00cc00" /></mesh>
    </group>
  );

  const inset = (w, h) => <mesh position={[0, 0, 0.048]}><boxGeometry args={[w - 0.5, h - 0.2, 0.015]} /><meshStandardMaterial color={gateColor} roughness={isWood ? 0.7 : 0.3} metalness={isWood ? 0.01 : 0.85} /></mesh>;
  const decoLine = (y, w, h, col) => <mesh position={[0, y, 0.052]}><boxGeometry args={[w, h, 0.012]} /><meshStandardMaterial color={col} roughness={0.6} metalness={isWood ? 0 : 0.3} /></mesh>;

  const renderPanels = () => {
    if (tipo === 'Seccional') {
      const h = ph / 4;
      return (
        <group>
          {[0, 1, 2, 3].map(i => (
            <group key={i}>
              <mesh ref={el => panelsRef.current[i] = el} position={[0, (i - 1.5) * h, 0]} castShadow receiveShadow>
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
      );
    } else if (tipo === 'Levadizo') {
      return (
        <group ref={el => panelsRef.current[0] = el}>
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
      );
    } else if (tipo === 'Corredizo') {
      return (
        <group>
          <group ref={el => panelsRef.current[0] = el}>
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
        </group>
      );
    } else if (tipo === 'Batiente') {
      return (
        <group>
          <group ref={el => panelsRef.current[0] = el} position={[-pw / 2, 0, 0]}>
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
          <group ref={el => panelsRef.current[1] = el} position={[pw / 2, 0, 0]}>
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
        </group>
      );
    }
  };

  return (
    <group>
      {renderPanels()}
      <mesh position={[-pw / 2 - 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      <mesh position={[pw / 2 + 0.06, 0, 0.04]}><boxGeometry args={[0.06, ph, 0.15]} /><meshStandardMaterial color="#555" roughness={0.7} /></mesh>
      {automatico && <Motor />}
    </group>
  );
}

/* ─── VISOR ─── */
function ModelViewer({ zoomLevel, ...props }) {
  useEffect(() => { console.log('[3D] ModelViewer montado'); }, []);
  console.log('[3D] Renderizando Canvas');
  return (
    <Canvas camera={{ position: [4.5, 3, 6], fov: 38, near: 0.1, far: 50 }}
      style={{ width: '100%', height: '100%', display: 'block', position: 'absolute', top: 0, left: 0, background: '#b5d4e8' }}
      onCreated={({ gl }) => { console.log('[3D] Canvas creado OK'); gl.setClearColor('#b5d4e8', 1); }}>
      <ZoomControl level={zoomLevel} />
      <ambientLight intensity={0.45} color="#b0d0ff" />
      <directionalLight position={[12, 20, 10]} intensity={2.5} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0002} />
      <directionalLight position={[-6, 12, -5]} intensity={0.4} color="#aaccff" />
      <hemisphereLight args={['#8ec8f0', '#4a6a3a', 0.4]} />
      <group position={[0, 1.08, 0]}>
        <Scene>
          <group position={[0, 1.1, 0]}>
            <GateModel {...props} />
          </group>
        </Scene>
      </group>
      <OrbitControls enableDamping minDistance={1.5} maxDistance={12} target={[0, 2.2, 0]} />
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

const PRESETS = [
  { name: 'Casa Moderna', tipo: 'Seccional', material: 'Madera', color: 'Imitación madera clara', diseno: 'Moderno', automatico: true, ancho: '3.0', alto: '2.4', ventanas: true, peatonal: false, subMaterial: 'Cedro', motorMarca: 'LiftMaster' },
  { name: 'Industrial', tipo: 'Corredizo', material: 'Acero Galvanizado', color: 'Gris', diseno: 'Industrial', automatico: true, ancho: '4.0', alto: '2.8', ventanas: false, peatonal: true, subMaterial: 'Galvanizado', motorMarca: 'Nice' },
  { name: 'Clásico Premium', tipo: 'Batiente', material: 'Madera', color: 'Nogal', diseno: 'Clásico', automatico: true, ancho: '3.5', alto: '2.4', ventanas: false, peatonal: false, subMaterial: 'Caoba', motorMarca: 'Powergate' },
  { name: 'Económico', tipo: 'Levadizo', material: 'Acero Galvanizado', color: 'Blanco', diseno: 'Moderno', automatico: false, ancho: '2.8', alto: '2.2', ventanas: false, peatonal: false, subMaterial: 'Galvanizado', motorMarca: 'LiftMaster' },
];

function PresetBar({ setState }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {PRESETS.map(p => (
        <button key={p.name} type="button" onClick={() => { Object.entries(p).forEach(([k, v]) => setState[k](v)); }}
          style={{ padding: '4px 9px', borderRadius: 7, border: '1px solid #e0c0b1', fontSize: 8.5, fontWeight: 600, color: '#584237', background: 'rgba(255,255,255,0.85)', cursor: 'pointer', transition: 'all 0.12s' }}>
          {p.name}
        </button>
      ))}
    </div>
  );
}

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

  const setState = { tipo: setTipo, color: setColor, material: setMaterial, diseno: setDiseno, automatico: setAutomatico, ancho: setAncho, alto: setAlto, ventanas: setVentanas, peatonal: setPeatonal, subMaterial: setSubMaterial, motorMarca: setMotorMarca };

  const whatsapp = () => {
    const t = `Hola, quiero cotizar este portón.%0A%0ATipo: ${tipo}%0AMaterial: ${material}${material === 'Madera' ? ` (${subMaterial})` : ''}%0AColor: ${color}%0ADiseño: ${diseno}%0AVentanas: ${ventanas ? 'Sí' : 'No'}%0APeatonal: ${peatonal ? 'Sí' : 'No'}%0AMotor: ${automatico ? motorMarca : 'Manual'}%0AMedidas: ${ancho}m x ${alto}m%0A%0AGracias.`;
    window.open(`https://wa.me/51930618991?text=${t}`, '_blank');
  };

  const reset = () => {
    setTipo('Seccional'); setMaterial('Madera'); setColor('Imitación madera oscura');
    setDiseno('Moderno'); setAutomatico(true); setAncho('3.0'); setAlto('2.4');
    setVentanas(false); setPeatonal(false); setSubMaterial('Cedro'); setMotorMarca('LiftMaster');
    setOpen(false); setZoomLevel(0);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ background: 'rgba(249,249,249,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #e0c0b1', position: 'fixed', top: 0, width: '100%', zIndex: 50, padding: '12px 40px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="index.html" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#1a1c1c', fontWeight: 700, fontSize: 18 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#9d4300', fontVariationSettings: "'FILL' 1" }}>door_sliding</span>
            Corporación Mi Hogar
          </a>
          <nav className="hidden lg:flex" style={{ display: 'none', gap: 18, alignItems: 'center' }}>
            {['Inicio','Servicios','Galería','Contacto'].map((n, i) => (
              <a key={n} className="nav-link" href={['index.html','servicios.html','galeria.html','contacto.html'][i]} style={{ fontSize: 11, color: '#584237', textDecoration: 'none', paddingBottom: 3 }}>{n}</a>
            ))}
            <a href="configurador.html" style={{ fontSize: 11, color: '#9d4300', fontWeight: 700, textDecoration: 'none', borderBottom: '2px solid #9d4300', paddingBottom: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>3d_rotation</span> Configurador 3D
            </a>
          </nav>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', marginTop: '58px', minHeight: 'calc(100vh - 58px)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
        <ModelViewer
          tipo={tipo} color={color} material={material} diseno={diseno}
          automatico={automatico} ancho={ancho} alto={alto} open={open}
          ventanas={ventanas} peatonal={peatonal} subMaterial={subMaterial} motorMarca={motorMarca}
          zoomLevel={zoomLevel} />

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
                  <span className="material-symbols-outlined" style={{ fontSize: 10 }}>auto_awesome</span> Inicio Rápido
                </label>
                <PresetBar setState={setState} />
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
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 1.5px; background: #9d4300; transition: all 0.2s ease; transform: translateX(-50%); }
        .nav-link:hover::after { width: 80%; }
        @media (min-width: 1024px) { nav.hidden\\:lg\\:flex { display: flex !important; } }
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
