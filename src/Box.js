import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Box = ({ frame }) => {
  const mesh = useRef();
  const [isGrabbed, setIsGrabbed] = useState(false);

  useFrame(() => {
    if (frame && frame.hands.length > 0) {
      const hand = frame.hands[0];
      const handPositionVec = new THREE.Vector3(...hand.palmPosition);
      const handPosition = mesh.current.worldToLocal(handPositionVec);

      if (hand.grabStrength > 0.95 && !isGrabbed) {
        if (mesh.current.position.distanceTo(handPosition) < 0.5) {
          setIsGrabbed(true);
        }
      } else if (hand.grabStrength < 0.8) {
        setIsGrabbed(false);
      }

      if (isGrabbed) {
        mesh.current.position.set(hand.palmPosition[0] / 100, (hand.palmPosition[1] / 150) - 1.5, hand.palmPosition[2] / 100);
      }
    }
  });

  return (
    <mesh ref={mesh} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
};

export default Box;