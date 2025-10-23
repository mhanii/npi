import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const Statue = ({ frame }) => {
  const mesh = useRef();
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [initialRotation, setInitialRotation] = useState(0);

  useFrame(() => {
    if (frame && frame.hands.length > 0) {
      const hand = frame.hands[0];
      const handPosition = mesh.current.worldToLocal(hand.palmPosition);

      if (hand.grabStrength > 0.95 && !isGrabbed) {
        if (mesh.current.position.distanceTo(handPosition) < 1) {
          setIsGrabbed(true);
          setInitialRotation(hand.palmPosition[0]);
        }
      } else if (hand.grabStrength < 0.8) {
        setIsGrabbed(false);
      }

      if (isGrabbed) {
        const rotation = (hand.palmPosition[0] - initialRotation) / 100;
        mesh.current.rotation.y += rotation;
      }
    } else if (mesh.current) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} castShadow>
      <boxGeometry args={[1, 3, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Statue;
