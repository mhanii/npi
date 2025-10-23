import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Heart = ({ frame }) => {
  const leftHalf = useRef();
  const rightHalf = useRef();
  const [isBroken, setIsBroken] = useState(false);

  const leftHeartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.25, 0.25);
    shape.bezierCurveTo(0.25, 0.25, 0.2, 0, 0, 0);
    shape.lineTo(0, 0.95);
    shape.bezierCurveTo(-0.3, 0.95, -0.1, 0.77, 0.25, 0.95);
    return shape;
  }, []);

  const rightHeartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0.25, 0.25);
    shape.bezierCurveTo(0.25, 0.25, 0.35, 0, 0.5, 0);
    shape.lineTo(0.8, 0.35);
    shape.bezierCurveTo(0.8, 0.55, 0.6, 0.77, 0.25, 0.95);
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 1,
  }), []);

  useFrame(() => {
    if (frame && frame.hands.length > 0) {
      const hand = frame.hands[0];
      const grabStrength = hand.grabStrength;

      if (grabStrength > 0.95 && !isBroken) {
        setIsBroken(true);
      } else if (grabStrength < 0.8 && isBroken) {
        setIsBroken(false);
      }
    }

    if (isBroken) {
      leftHalf.current.position.x = -0.5;
      rightHalf.current.position.x = 0.5;
    } else {
      leftHalf.current.position.x = 0;
      rightHalf.current.position.x = 0;
    }
  });

  return (
    <group>
      <mesh ref={leftHalf}>
        <extrudeGeometry args={[leftHeartShape, extrudeSettings]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh ref={rightHalf}>
        <extrudeGeometry args={[rightHeartShape, extrudeSettings]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
};

export default Heart;