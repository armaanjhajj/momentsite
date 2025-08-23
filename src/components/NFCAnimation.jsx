import React from 'react';
import Lottie from 'lottie-react';
import nfcAnimationData from '../assets/NFC blue reader.json';

const NFCAnimation = ({ className = '' }) => {
  return (
    <div className={`nfc-animation ${className}`}>
      <Lottie 
        animationData={nfcAnimationData}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default NFCAnimation;
