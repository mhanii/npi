import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Hand = ({ hand }) => {
  const palmRef = useRef();

  useFrame(() => {
    if (hand && palmRef.current) {
      const { palmPosition } = hand;
      palmRef.current.position.set(palmPosition[0] / 100, (palmPosition[1] / 150) - 1.5, palmPosition[2] / 100);
    }
  });

  return (
    <group>
      {/* Palm */}
      <mesh ref={palmRef} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.5]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* Fingers */}
      {hand &&
        hand.fingers.map((finger, i) => (
          <group key={i}>
            {finger.bones.map((bone, j) => {
              const startPoint = new THREE.Vector3(...bone.prevJoint).divideScalar(100).add(new THREE.Vector3(0, -1.5, 0));
              const endPoint = new THREE.Vector3(...bone.nextJoint).divideScalar(100).add(new THREE.Vector3(0, -1.5, 0));

              const distance = startPoint.distanceTo(endPoint);
              const position = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
              const quaternion = new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                endPoint.clone().sub(startPoint).normalize()
              );

              return (
                <group key={j}>
                  {/* Joint Sphere */}
                  <mesh position={startPoint}>
                    <sphereGeometry args={[0.05, 32, 32]} />
                    <meshStandardMaterial color="hotpink" />
                  </mesh>

                  {/* Bone Cylinder */}
                  <mesh position={position} quaternion={quaternion}>
                    <cylinderGeometry args={[0.04, 0.04, distance, 16]} />
                    <meshStandardMaterial color="lightblue" />
                  </mesh>

                  {/* Final joint sphere */}
                  {j === finger.bones.length - 1 && (
                    <mesh position={endPoint}>
                      <sphereGeometry args={[0.05, 32, 32]} />
                      <meshStandardMaterial color="hotpink" />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        ))}
    </group>
  );
};

export default Hand;