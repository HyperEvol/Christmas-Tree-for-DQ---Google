
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import MorphicTree from './components/MorphicTree';
import UIOverlay from './components/UIOverlay';
import LoadingScreen from './components/LoadingScreen';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.SCATTERED);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGreeting, setAiGreeting] = useState<string | null>(null);

  const toggleState = () => {
    setTreeState(prev => prev === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED);
  };

  return (
    <div className="relative w-full h-screen bg-[#01160e] overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={['#01160e']} />
          
          <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            maxDistance={40} 
            minDistance={5} 
            autoRotate={treeState === TreeState.TREE_SHAPE} 
            autoRotateSpeed={0.5}
          />

          {/* High Intensity Lighting for a "Vibrant & Bright" look */}
          <ambientLight intensity={1.2} />
          <spotLight 
            position={[15, 25, 15]} 
            angle={0.5} 
            penumbra={1} 
            intensity={12} 
            castShadow 
            color="#fffcf0"
          />
          <pointLight position={[-12, 12, -12]} intensity={6} color="#ffd700" />
          <pointLight position={[12, -5, 12]} intensity={4} color="#043927" />
          <pointLight position={[0, 15, 0]} intensity={8} color="#ffffff" />

          <Stars radius={120} depth={60} count={8000} factor={7} saturation={0.8} fade speed={3} />
          
          <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.15}>
            <MorphicTree treeState={treeState} />
          </Float>

          <Environment preset="apartment" />

          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} height={500} intensity={2.5} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.02} darkness={0.8} />
          </EffectComposer>
        </Canvas>
      </Suspense>

      <UIOverlay 
        treeState={treeState} 
        onToggle={toggleState} 
        isAiGenerating={isAiGenerating}
        setIsAiGenerating={setIsAiGenerating}
        aiGreeting={aiGreeting}
        setAiGreeting={setAiGreeting}
      />
      
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none select-none">
        <h1 className="text-4xl md:text-6xl font-serif tracking-[0.2em] text-[#ffd700] drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]">
          ARIX
        </h1>
        <p className="text-xs tracking-[0.4em] uppercase text-[#ffd700]/90 mt-2 font-bold">
          Signature Interactive Christmas
        </p>
      </div>
    </div>
  );
};

export default App;
