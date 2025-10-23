import React from 'react';
import { Canvas } from '@react-three/fiber';
import Hand from './Hand';
import Statue from './Statue';
import Box from './Box';
import ControlPanel from './ControlPanel';
import useLeap from './useLeap';
import './App.css';
import './ControlPanel.css';

function App() {
  const frame = useLeap();

  return (
    <div className="App">
      <ControlPanel frame={frame} />
      <Canvas camera={{ position: [0, 2, 5] }} shadows>
        <color attach="background" args={['#111']} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        {frame && frame.hands.map((hand, i) => <Hand key={i} hand={hand} />)}
        <Statue frame={frame} />
        <Box frame={frame} />
      </Canvas>
    </div>
  );
}

export default App;