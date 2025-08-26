import React from 'react';
import Lottie from 'lottie-react';
import networkGlobeAnimation from '../assets/Red Network Globe.json';

const BackgroundAnimation = () => {
  return (
    <div className="background-animation">
      <Lottie
        animationData={networkGlobeAnimation}
        loop={true}
        autoplay={true}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '180vw',
          height: '220vh',
          zIndex: 0,
          objectFit: 'fill'
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
