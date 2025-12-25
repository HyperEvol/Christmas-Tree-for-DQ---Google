
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { 
  PARTICLE_COUNT, ORNAMENT_COUNT, BELL_COUNT, CANDY_COUNT, GINGER_COUNT, STOCKING_COUNT, CHOCOLATE_COUNT, RIBBON_COUNT,
  TREE_HEIGHT, TREE_RADIUS, SCATTER_RADIUS, COLORS 
} from '../constants';

const MorphicTree: React.FC<{ treeState: TreeState }> = ({ treeState }) => {
  const needleRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRef = useRef<THREE.InstancedMesh>(null);
  const bellRef = useRef<THREE.InstancedMesh>(null);
  const candyRef = useRef<THREE.InstancedMesh>(null);
  const gingerRef = useRef<THREE.InstancedMesh>(null);
  const stockingRef = useRef<THREE.InstancedMesh>(null);
  const chocolateRef = useRef<THREE.InstancedMesh>(null);
  const ribbonRef = useRef<THREE.InstancedMesh>(null);
  const starRef = useRef<THREE.Group>(null);

  const morphProgress = useRef(0);

  // Custom Star Shape
  const starGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.8;
    const innerRadius = 0.35;
    
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelSegments: 3,
    });
  }, []);

  const generatePositions = (count: number, scatterRadius: number, innerOffset = 0) => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const scatterPos = new THREE.Vector3(
        (Math.random() - 0.5) * scatterRadius * 2,
        (Math.random() - 0.5) * scatterRadius * 2,
        (Math.random() - 0.5) * scatterRadius * 2
      );

      const tY = Math.random() * TREE_HEIGHT;
      const tRadius = ((TREE_HEIGHT - tY) / TREE_HEIGHT) * TREE_RADIUS;
      const tAngle = Math.random() * Math.PI * 2;
      const treePos = new THREE.Vector3(
        Math.cos(tAngle) * (tRadius + innerOffset) + (Math.random() - 0.5) * 0.3,
        tY - TREE_HEIGHT / 2,
        Math.sin(tAngle) * (tRadius + innerOffset) + (Math.random() - 0.5) * 0.3
      );

      items.push({
        scatter: scatterPos,
        tree: treePos,
        scale: 1,
        rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        id: i
      });
    }
    return items;
  };
  
  const data = useMemo(() => {
    const needleData = generatePositions(PARTICLE_COUNT, SCATTER_RADIUS, -0.2).map(p => ({ ...p, scale: Math.random() * 0.12 + 0.04 }));
    const ornamentData = generatePositions(ORNAMENT_COUNT, SCATTER_RADIUS - 2, 0.2).map((p, i) => ({ 
      ...p, 
      scale: Math.random() * 0.2 + 0.1,
      color: [COLORS.GOLD, COLORS.RED, COLORS.WHITE, COLORS.SOFT_GOLD, '#FF69B4', '#00FFFF'][i % 6]
    }));
    const bellData = generatePositions(BELL_COUNT, SCATTER_RADIUS - 4, 0.3).map(p => ({ ...p, scale: 0.3 }));
    const candyData = generatePositions(CANDY_COUNT, SCATTER_RADIUS - 5, 0.25).map(p => ({ ...p, scale: 0.25 }));
    const gingerData = generatePositions(GINGER_COUNT, SCATTER_RADIUS - 6, 0.3).map(p => ({ ...p, scale: 0.35 }));
    const stockingData = generatePositions(STOCKING_COUNT, SCATTER_RADIUS - 7, 0.35).map((p, i) => ({ 
      ...p, 
      scale: 0.35,
      color: [COLORS.RED, COLORS.EMERALD, COLORS.GOLD][i % 3]
    }));
    const chocolateData = generatePositions(CHOCOLATE_COUNT, SCATTER_RADIUS - 3, 0.2).map(p => ({ ...p, scale: 0.25 }));

    const ribbonData = [];
    for (let i = 0; i < RIBBON_COUNT; i++) {
      const scatterPos = new THREE.Vector3(
        (Math.random() - 0.5) * SCATTER_RADIUS * 2,
        (Math.random() - 0.5) * scatterRadius * 2,
        (Math.random() - 0.5) * scatterRadius * 2
      );

      const normalizedY = i / RIBBON_COUNT;
      const tY = normalizedY * TREE_HEIGHT;
      const tRadius = ((TREE_HEIGHT - tY) / TREE_HEIGHT) * (TREE_RADIUS + 0.1);
      const tAngle = normalizedY * Math.PI * 12 + (Math.floor(i / (RIBBON_COUNT / 3)) * (Math.PI * 2 / 3)); 
      
      const treePos = new THREE.Vector3(
        Math.cos(tAngle) * tRadius,
        tY - TREE_HEIGHT / 2,
        Math.sin(tAngle) * tRadius
      );

      const dummyObj = new THREE.Object3D();
      dummyObj.position.copy(treePos);
      dummyObj.lookAt(new THREE.Vector3(
        Math.cos(tAngle + 0.1) * (((TREE_HEIGHT - (tY + 0.1)) / TREE_HEIGHT) * (TREE_RADIUS + 0.1)),
        (tY + 0.1) - TREE_HEIGHT / 2,
        Math.sin(tAngle + 0.1) * (((TREE_HEIGHT - (tY + 0.1)) / TREE_HEIGHT) * (TREE_RADIUS + 0.1))
      ));

      ribbonData.push({
        scatter: scatterPos,
        tree: treePos,
        treeRotation: dummyObj.rotation.clone(),
        scatterRotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI),
        scale: 0.4,
        color: COLORS.RIBBON_COLORS[i % COLORS.RIBBON_COLORS.length]
      });
    }

    return { 
      needles: needleData, 
      ornaments: ornamentData, 
      bells: bellData, 
      candies: candyData, 
      gingers: gingerData, 
      stockings: stockingData,
      chocolates: chocolateData,
      ribbons: ribbonData
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const applyColors = (mesh: THREE.InstancedMesh, items: any[]) => {
    const colorObj = new THREE.Color();
    items.forEach((item, i) => {
      if (item.color) {
        colorObj.set(item.color);
        mesh.setColorAt(i, colorObj);
      }
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  };

  const updateInstanceMesh = (ref: React.RefObject<THREE.InstancedMesh>, items: any[], progress: number, state: any, options: { rotationSpeed?: number, pulse?: boolean, isRibbon?: boolean } = {}) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    items.forEach((item, i) => {
      const currentPos = new THREE.Vector3().lerpVectors(item.scatter, item.tree, progress);
      
      if (progress < 0.95) {
        currentPos.y += Math.sin(time + i * 0.5) * 0.5 * (1 - progress);
        currentPos.x += Math.cos(time * 0.5 + i) * 0.3 * (1 - progress);
      }

      dummy.position.copy(currentPos);
      
      if (options.isRibbon) {
        dummy.rotation.x = THREE.MathUtils.lerp(item.scatterRotation.x, item.treeRotation.x, progress);
        dummy.rotation.y = THREE.MathUtils.lerp(item.scatterRotation.y, item.treeRotation.y, progress);
        dummy.rotation.z = THREE.MathUtils.lerp(item.scatterRotation.z, item.treeRotation.z, progress);
      } else {
        const rotX = item.rotation.x + (options.rotationSpeed || 0.1) * time * (1 - progress);
        const rotY = item.rotation.y + (options.rotationSpeed || 0.1) * time;
        dummy.rotation.set(rotX, rotY, item.rotation.z);
      }
      
      let scale = item.scale;
      if (options.pulse) scale *= (1 + Math.sin(time * 2 + i) * 0.1);
      dummy.scale.setScalar(scale);
      
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  };

  useFrame((state, delta) => {
    const target = treeState === TreeState.TREE_SHAPE ? 1 : 0;
    morphProgress.current = THREE.MathUtils.lerp(morphProgress.current, target, delta * 1.8);

    updateInstanceMesh(needleRef, data.needles, morphProgress.current, state);
    updateInstanceMesh(ornamentRef, data.ornaments, morphProgress.current, state, { pulse: true });
    updateInstanceMesh(bellRef, data.bells, morphProgress.current, state, { rotationSpeed: 0.5 });
    updateInstanceMesh(candyRef, data.candies, morphProgress.current, state);
    updateInstanceMesh(gingerRef, data.gingers, morphProgress.current, state);
    updateInstanceMesh(stockingRef, data.stockings, morphProgress.current, state);
    updateInstanceMesh(chocolateRef, data.chocolates, morphProgress.current, state);
    updateInstanceMesh(ribbonRef, data.ribbons, morphProgress.current, state, { isRibbon: true });

    if (starRef.current) {
      const starTargetPos = new THREE.Vector3(0, TREE_HEIGHT / 2 + 1, 0);
      const starScatterPos = new THREE.Vector3(0, 15, 0);
      starRef.current.position.lerpVectors(starScatterPos, starTargetPos, morphProgress.current);
      starRef.current.rotation.y += delta * 2;
      // Gently rotate the star on its z-axis for extra magic
      starRef.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.2;
      starRef.current.scale.setScalar(morphProgress.current * 1.2 + 0.001);
    }
  });

  React.useEffect(() => {
    if (ornamentRef.current) applyColors(ornamentRef.current, data.ornaments);
    if (stockingRef.current) applyColors(stockingRef.current, data.stockings);
    if (ribbonRef.current) applyColors(ribbonRef.current, data.ribbons);
  }, [data]);

  return (
    <group>
      {/* 1. Needles */}
      <instancedMesh ref={needleRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={COLORS.EMERALD} metalness={0.5} roughness={0.2} emissive={COLORS.EMERALD} emissiveIntensity={0.05} />
      </instancedMesh>

      {/* 2. Ornaments */}
      <instancedMesh ref={ornamentRef} args={[undefined, undefined, ORNAMENT_COUNT]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial metalness={0.7} roughness={0.2} />
      </instancedMesh>

      {/* 3. Bells */}
      <instancedMesh ref={bellRef} args={[undefined, undefined, BELL_COUNT]}>
        <coneGeometry args={[1, 1.5, 16]} />
        <meshStandardMaterial color={COLORS.GOLD} metalness={0.8} roughness={0.2} />
      </instancedMesh>

      {/* 4. Candy Canes */}
      <instancedMesh ref={candyRef} args={[undefined, undefined, CANDY_COUNT]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color={COLORS.WHITE} emissive={COLORS.CANDY_RED} emissiveIntensity={0.4} />
      </instancedMesh>

      {/* 5. Gingerbread Men */}
      <instancedMesh ref={gingerRef} args={[undefined, undefined, GINGER_COUNT]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={COLORS.GINGERBREAD} roughness={0.9} />
      </instancedMesh>

      {/* 6. Socks (Stockings) */}
      <instancedMesh ref={stockingRef} args={[undefined, undefined, STOCKING_COUNT]}>
        <boxGeometry args={[1, 1.5, 0.8]} />
        <meshStandardMaterial roughness={0.5} />
      </instancedMesh>

      {/* 7. Chocolates */}
      <instancedMesh ref={chocolateRef} args={[undefined, undefined, CHOCOLATE_COUNT]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color={COLORS.CHOCOLATE} metalness={0.2} roughness={0.3} />
      </instancedMesh>

      {/* 8. Colorful Ribbons */}
      <instancedMesh ref={ribbonRef} args={[undefined, undefined, RIBBON_COUNT]}>
        <boxGeometry args={[0.5, 0.05, 0.2]} />
        <meshStandardMaterial metalness={0.5} roughness={0.1} />
      </instancedMesh>

      {/* Star - VISIBLE 5-POINT STAR SHAPE */}
      <group ref={starRef}>
        <mesh geometry={starGeometry} rotation={[0, 0, 0]}>
          <meshStandardMaterial 
            color={COLORS.SOFT_GOLD} 
            emissive={COLORS.GOLD} 
            emissiveIntensity={8} 
            metalness={1} 
            roughness={0.1}
            toneMapped={false} 
          />
        </mesh>
        <pointLight intensity={4} distance={10} color={COLORS.GOLD} />
        {/* Subtle aura */}
        <mesh scale={[1.8, 1.8, 1.8]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color={COLORS.GOLD} transparent opacity={0.05} />
        </mesh>
      </group>
    </group>
  );
};

export default MorphicTree;
