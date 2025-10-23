import React from 'react';

const ControlPanel = ({ frame, objects }) => {
  return (
    <div className="control-panel">
      <h2>Leap Motion Controls</h2>
      {frame && frame.hands.length > 0 ? (
        frame.hands.map((hand, i) => (
          <div key={i}>
            <h3>Hand {hand.type}</h3>
            <p>Fingers: {hand.fingers.length}</p>
            <p>Grab Strength: {hand.grabStrength.toFixed(2)}</p>
            <p>Palm Position: {hand.palmPosition.map(p => p.toFixed(2)).join(', ')}</p>
          </div>
        ))
      ) : (
        <p>No hands detected</p>
      )}
    </div>
  );
};

export default ControlPanel;
