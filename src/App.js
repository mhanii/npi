import React from 'react';
import { Canvas } from '@react-three/fiber';
import Cube from './Cube';
import useLeap from './useLeap';
import './App.css';

function App() {
  const frame = useLeap();

  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube frame={frame} />
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px' }}>
        <h2>Leap Motion Data</h2>
        {frame && frame.hands.length > 0 ? (
          <p>
            Hand Position:
            X: {frame.hands[0].palmPosition[0].toFixed(2)},
            Y: {frame.hands[0].palmPosition[1].toFixed(2)},
            Z: {frame.hands[0].palmPosition[2].toFixed(2)}
          </p>
        ) : (
          <p>No hands detected</p>
        )}
      </div>
    </div>
  );
}

export default App;