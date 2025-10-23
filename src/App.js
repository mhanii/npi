import React from 'react';
import { Canvas } from '@react-three/fiber';
import Hand from './Hand';
import Heart from './Heart';
import useLeap from './useLeap';
import './App.css';

function App() {
  const frame = useLeap();

  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {frame && frame.hands.map((hand, i) => <Hand key={i} hand={hand} />)}
        <Heart frame={frame} />
      </Canvas>
    </div>
  );
}

export default App;