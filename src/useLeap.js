import { useState, useEffect } from 'react';
import Leap from 'leapjs';

const useLeap = () => {
  const [frame, setFrame] = useState(null);

  useEffect(() => {
    const controller = Leap.loop((frame) => {
      setFrame(frame);
    });

    return () => {
      controller.disconnect();
    };
  }, []);

  return frame;
};

export default useLeap;