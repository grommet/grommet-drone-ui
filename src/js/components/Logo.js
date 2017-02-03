import React, { PropTypes } from 'react';
import classnames from 'classnames';

const CLASS_ROOT = 'drone-logo';
const Logo = (props) => {
  const { size } = props;

  const classes = classnames(CLASS_ROOT, {
    [`${CLASS_ROOT}--${size}`]: size
  });

  return (
    <svg className={classes} viewBox='0 0 30 30'>
      <path fill='#D06000' fillRule='evenodd'
        d='M29,16 L21,16 C21,12.6862915 18.3137085,10 15,10 C11.6862915,10 9,12.6862915 9,16 L1,16 C1,8.2680135 7.2680135,2 15,2 C22.7319865,2 29,8.2680135 29,16 Z M5,18 L9,18 C9,21.3137085 11.6862915,24 15,24 C18.3137085,24 21,21.3137085 21,18 L25,18 C25,23.5228475 20.5228475,28 15,28 C9.4771525,28 5,23.5228475 5,18 Z M19,16 C19,13.790861 17.209139,12 15,12 C12.790861,12 11,13.790861 11,16 L11,17.9835468 C11,20.209139 12.790861,22 15,22 C17.209139,22 19,20.209139 19,18 L19,16 Z' />
    </svg>
  );
};

Logo.propTypes = {
  size: PropTypes.string
};

Logo.defaultProps = {
  size: 'medium'
};

export default Logo;
