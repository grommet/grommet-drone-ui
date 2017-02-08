import React, { PropTypes } from 'react';
import classnames from 'classnames';

import DroneStatusCircle from './DroneStatusCircle';

const CLASS_ROOT = 'drone-status-icon';

const StatusIcon = (props) => {
  const { status } = props;

  const classes = classnames(CLASS_ROOT, {
    [`${CLASS_ROOT}--${status}`]: status
  });

  if (status === 'success') {
    return (
      <svg className={classes} version='1.1' viewBox='0 0 20 20'>
        <path fill='none' strokeWidth='2'
          d='M10,19 C14.9705627,19 19,14.9705627 19,10 C19,5.02943725 14.9705627,1 10,1 C5.02943725,1 1,5.02943725 1,10 C1,14.9705627 5.02943725,19 10,19 Z M5.5,10 L9.1,12.7 L13.6,6.4' />
      </svg>
    );
  } else if (status === 'failure') {
    return (
      <svg className={classes} version='1.1' viewBox='0 0 20 20'>
        <g fill='none' fillRule='evenodd' strokeWidth='2'>
          <circle cx='10' cy='10' r='9'/>
          <path d='M6 6L14.3937309 14.3937309M6 14.3937309L14.3937309 6' />
        </g>
      </svg>
    );
  } else if (status === 'running') {
    return (
      <svg className={classes} version='1.1' viewBox='0 0 20 20'>
        <path fill='none' strokeWidth='2'
          d='M17,5 C15.5974037,2.04031171 12.536972,0 9,0 C4.02943725,0 0,4.02943725 0,9 C0,13.9705627 4.02943725,18 9,18 L9,18 C13.9705627,18 18,13.9705627 18,9 M18,0 L18,6 L12,6' transform='translate(1 1)'/>
      </svg>
    );
  }
  return <DroneStatusCircle size='large' />;
};

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusIcon;
