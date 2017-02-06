import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Box from 'grommet/components/Box';

import Logo from './Logo';

const CLASS_ROOT = 'drone-message';

class DroneMessage extends Component {
  render() {
    const { avatar, colorIndex, message } = this.props;

    let avatarNode = <Logo />;
    if (avatar) {
      avatarNode = avatar;
    }

    const classes = classnames(CLASS_ROOT, {
      [`${CLASS_ROOT}--colored`]: colorIndex
    });

    return (
      <Box flex={false} align='end' className={classes} direction='row'
        full='horizontal'
        responsive={false} pad={{ between: 'small', vertical: 'small' }}>
        {avatarNode}
        <Box pad='small' className={`${CLASS_ROOT}__container`}
          colorIndex={colorIndex}>
          {message}
        </Box>
      </Box>
    );
  }
}

DroneMessage.propTypes = {
  avatar: PropTypes.node,
  colorIndex: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
};

export default DroneMessage;
