import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';

import Box from 'grommet/components/Box';
import Paragraph from 'grommet/components/Paragraph';

import Logo from './Logo';

const CLASS_ROOT = 'drone-message';
const ONE_MINUTE = 60 * 1000;

class DroneMessage extends Component {
  render() {
    const { avatar, colorIndex, message, size, timestamp } = this.props;

    let timeAgo = '';
    if (timestamp) {
      const today = new Date().getTime();
      const messageDate = timestamp * 1000;

      if ((today - messageDate) < ONE_MINUTE) {
        timeAgo = 'Just now';
      } else {
        timeAgo = moment(messageDate).fromNow();
      }
    }

    let avatarNode = <Logo />;
    if (avatar) {
      avatarNode = avatar;
    }

    let messageNode = message;
    if (typeof messageNode === 'string') {
      messageNode = (
        <Paragraph margin='none'>
          {message}
        </Paragraph>
      );
    }

    const classes = classnames(CLASS_ROOT, {
      [`${CLASS_ROOT}--colored`]: colorIndex
    });

    return (
      <Box flex={false} responsive={false} align='end'
        className={classes} direction='row'
        pad={{ between: 'small', vertical: 'small' }}>
        {avatarNode}
        <Box pad={{ between: 'small' }} size={size}>
          <Box direction='row'
            pad='small' className={`${CLASS_ROOT}__container`}
            colorIndex={colorIndex}>
            {messageNode}
          </Box>
          <Paragraph size='small' margin='none'
            className={`${CLASS_ROOT}__timestamp`}>
            {timeAgo}
          </Paragraph>
        </Box>
      </Box>
    );
  }
}

DroneMessage.propTypes = {
  avatar: PropTypes.node,
  colorIndex: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  size: PropTypes.string,
  timestamp: PropTypes.number
};

export default DroneMessage;
