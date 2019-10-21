import React from 'react';
import Image360 from './360-image.svg';
import Video360 from './360-video.svg';
import Banner from './banner.svg';
import ObjectIcon from './object.svg';
import Space from './space.svg';

function getImage(type) {
  switch (type) {
    case '360image':
      return Image360;

    case '360video':
      return Video360;

    case 'banner':
      return Banner;

    case 'object':
      return ObjectIcon;

    default:
      return Space;
  }
}

const SpaceImage = ({ type }) => {
  const image = getImage(type);
  return (
    <div
      style={{
        background: `url(${image})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      className="contain h-100 w-100"
    />
  );
};

export default SpaceImage;
