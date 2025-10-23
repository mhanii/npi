import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Statue = ({ frame }) => {
  const mesh = useRef();
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [initialHandX, setInitialHandX] = useState(0);
  const [initialStatueRotation, setInitialStatueRotation] = useState(0);

  useFrame(() => {
    // Auto-rotate if not grabbed
    if (mesh.current && !isGrabbed) {
      mesh.current.rotation.y += 0.01;
    }

    if (frame && frame.hands.length > 0) {
      const hand = frame.hands[0];
      const handPositionVec = new THREE.Vector3(...hand.palmPosition);
      const handPosition = mesh.current.worldToLocal(handPositionVec);

      // Start grabbing
      if (hand.grabStrength > 0.95 && !isGrabbed) {
        if (mesh.current.position.distanceTo(handPosition) < 1) {
          setIsGrabbed(true);
          setInitialHandX(hand.palmPosition[0]);
          setInitialStatueRotation(mesh.current.rotation.y);
        }
      }
      // Stop grabbing
      else if (hand.grabStrength < 0.8 && isGrabbed) {
        setIsGrabbed(false);
      }

      // Update rotation while grabbing
      if (isGrabbed) {
        const deltaX = (hand.palmPosition[0] - initialHandX) / 100;
        mesh.current.rotation.y = initialStatueRotation + deltaX;
      }
    } else {
      // If hands disappear, stop grabbing
      if (isGrabbed) {
        setIsGrabbed(false);
      }
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
