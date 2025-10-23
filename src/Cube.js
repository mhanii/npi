import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Cooldown period in milliseconds to prevent rapid selection toggling
const SELECT_COOLDOWN = 500;

function Cube({ frame }) {
  const mesh = useRef();
  const [isSelected, setIsSelected] = useState(false);
  const [lastSelectTime, setLastSelectTime] = useState(0);

  useFrame(() => {
    if (mesh.current) {
      if (frame && frame.hands.length > 0) {
        // Separate hands by type for individual control
        const leftHand = frame.hands.find(hand => hand.type === 'left');
        const rightHand = frame.hands.find(hand => hand.type === 'right');

        // --- Left Hand: Selection Control ---
        if (leftHand) {
          const grabStrength = leftHand.grabStrength;
          const currentTime = Date.now();

          // Toggle selection with a fist gesture, respecting the cooldown
          if (grabStrength > 0.9 && currentTime - lastSelectTime > SELECT_COOLDOWN) {
            setIsSelected(!isSelected);
            setLastSelectTime(currentTime);
          }
        }

        // --- Right Hand: Position and Rotation Control ---
        if (rightHand && isSelected) {
          const palmPosition = rightHand.palmPosition;
          const palmVelocity = rightHand.palmVelocity;

          // --- Position Control ---
          // The hand's palm position is used to control the cube's position in the 3D scene.
          // The raw Leap Motion coordinates are scaled to fit the scene's dimensions.
          const x = palmPosition[0] / 100;
          const y = (palmPosition[1] / 150) - 1.5; // Adjusted scaling and offset
          const z = palmPosition[2] / 100;
          mesh.current.position.set(x, y, z);

          // --- Rotation Control (Swipe Gesture) ---
          // We use the horizontal velocity of the hand to detect a swipe.
          // A velocity threshold ensures that only intentional swipes trigger rotation.
          const swipeVelocityThreshold = 200; // Velocity in mm/s
          const horizontalVelocity = palmVelocity[0];

          if (Math.abs(horizontalVelocity) > swipeVelocityThreshold) {
            // The rotation amount is proportional to the swipe velocity.
            const rotationAmount = (horizontalVelocity / 10000);
            mesh.current.rotation.y -= rotationAmount;
          }
        }

      } else {
        // If no hands are detected, perform a default rotation animation if the cube is not selected.
        if (!isSelected) {
            mesh.current.rotation.x += 0.005;
            mesh.current.rotation.y += 0.005;
        }
      }
    }
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      {/* The cube's color changes to 'hotpink' when it is "selected". */}
      <meshStandardMaterial color={isSelected ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

export default Cube;