import React, { PropTypes } from 'react';
import classnames from 'classnames';

const CLASS_ROOT = 'drone-status-circle';

const DroneStatusCircle = (props) => {
  const { size, status } = props;

  const classes = classnames(CLASS_ROOT, {
    [`${CLASS_ROOT}--${status}`]: status,
    [`${CLASS_ROOT}--${size}`]: size
  });

  return (
    <svg version='1.1' className={classes} width='12' height='12'
      viewBox='0 0 14 14'>
      <circle cx='7' cy='7' r='6' />
    </svg>
  );
};

DroneStatusCircle.propTypes = {
  status: PropTypes.string,
  size: PropTypes.string
};

DroneStatusCircle.defaultProps = {
  status: 'unknown'
};

export default DroneStatusCircle;
