import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

function Cube({ frame }) {
  const mesh = useRef();
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isBall, setIsBall] = useState(false);

  useFrame(() => {
    if (mesh.current) {
      if (frame && frame.hands.length > 0) {
        const hand = frame.hands[0];
        const palmPosition = hand.palmPosition;

        // --- Position Control ---
        // The hand's palm position is used to control the cube's position in the 3D scene.
        // The raw Leap Motion coordinates are scaled to fit the scene's dimensions.
        // The 'y' coordinate is adjusted to center the cube vertically.
        const x = palmPosition[0] / 100;
        const y = (palmPosition[1] / 150) - 1.5; // Adjusted scaling and offset for better vertical positioning
        const z = palmPosition[2] / 100;

        mesh.current.position.set(x, y, z);

        // --- Rotation Control ---
        // The hand's orientation (pitch, yaw, roll) is directly mapped to the cube's rotation.
        // The yaw is inverted to provide a more intuitive mapping.
        mesh.current.rotation.set(hand.pitch(), -hand.yaw(), hand.roll());

        // --- Grab Interaction ---
        // 'grabStrength' is a value between 0 (open hand) and 1 (closed fist).
        // When the hand is nearly closed (grabStrength > 0.95), we consider the cube "grabbed".
        // This is a simple way to detect a grab gesture. More complex interactions could
        // involve checking individual finger states (e.g., thumb and index finger pinching).
        const grabStrength = hand.grabStrength;
        if (grabStrength > 0.95 && !isGrabbed) {
          setIsGrabbed(true);
        } else if (grabStrength < 0.8 && isGrabbed) {
          setIsGrabbed(false);
        }

        if (frame.hands.length === 2) {
            const hand1 = frame.hands[0];
            const hand2 = frame.hands[1];
            const y1 = hand1.palmPosition[1];
            const y2 = hand2.palmPosition[1];
            const palmNormal1 = hand1.palmNormal[0];
            const palmNormal2 = hand2.palmNormal[0];
            if (Math.abs(y1 - y2) < 25 && Math.abs(palmNormal1 - palmNormal2) > 1.6) {
                setIsBall(true);
            } else {
                setIsBall(false);
            }
        } else {
            setIsBall(false);
        }

      } else {
        // If no hand is detected, the cube performs a default rotation animation.
        mesh.current.rotation.x += 0.005;
        mesh.current.rotation.y += 0.005;
      }
    }
  });

  return (
    <mesh ref={mesh}>
      {isBall ? (
        <sphereGeometry args={[0.7, 32, 32]} />
      ) : (
        <boxGeometry args={[1, 1, 1]} />
      )}
      {/* The cube's color changes to 'hotpink' when it is "grabbed". */}
      <meshStandardMaterial color={isGrabbed ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default Cube;