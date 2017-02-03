import React, { PropTypes } from 'react';

const Avatar = (props) => {
  const { name, src } = props;

  return <img className='drone-avatar' src={src} alt={`${name} avatar`} />;
};

Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Avatar;
