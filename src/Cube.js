import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

function Cube({ frame }) {
  const mesh = useRef();
  const { viewport } = useThree();
  const cubeSize = useMemo(() => Math.min(viewport.width, viewport.height) * 0.1, [viewport]);

  let lastHandX = useRef(null);
  const swipeThreshold = 5;

  useFrame(() => {
    if (mesh.current) {
      const rightHand = frame && frame.hands.find(hand => hand.type === 'right');

      if (rightHand) {
        const currentHandX = rightHand.palmPosition[0];

        if (lastHandX.current !== null) {
          const deltaX = currentHandX - lastHandX.current;

          if (Math.abs(deltaX) > swipeThreshold) {
            const normalizedDeltaX = deltaX / viewport.width;
            mesh.current.position.x += normalizedDeltaX * 10;
          }
        }
        lastHandX.current = currentHandX;
      } else {
        lastHandX.current = null;
        mesh.current.rotation.x += 0.005;
        mesh.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshStandardMaterial color={'orange'} />
    </mesh>
  );
}

export default Cube;
