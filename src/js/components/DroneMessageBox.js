import React, { Component, PropTypes } from 'react';

import Box from 'grommet/components/Box';
import KeyboardAccelerators from 'grommet/utils/KeyboardAccelerators';

const CLASS_ROOT = 'drone-message-box';

class DroneMessageBox extends Component {
  constructor() {
    super();

    this._onMessageChange = this._onMessageChange.bind(this);
    this._onSendMessage = this._onSendMessage.bind(this);
    this._onPreviousMessage = this._onPreviousMessage.bind(this);

    this.state = {
      message: '',
      previousMessage: ''
    };
  }

  componentDidMount() {
    this._keys = {
      enter: this._onSendMessage,
      up: this._onPreviousMessage,
    };

    KeyboardAccelerators.startListeningToKeyboard(this, this._keys);
  }

  componentWillUnmount() {
    KeyboardAccelerators.stopListeningToKeyboard(this, this._keys);
  }

  _onMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  _onSendMessage() {
    const { onSend } = this.props;
    const { message } = this.state;
    this.setState({ message: '', previousMessage: message.trim() }, () => {
      onSend(message.trim());
    });
  }

  _onPreviousMessage(event) {
    const { previousMessage } = this.state;
    if (previousMessage !== '') {
      event.preventDefault();
      this.setState({ message: previousMessage, previousMessage: '' });
    }
  }

  render() {
    const { message } = this.state;

    return (
      <Box full='horizontal' className={CLASS_ROOT} colorIndex='light-1'>
        <input type='text' value={message}
          onChange={this._onMessageChange}
          placeholder='E.g: "help" (Press enter to send)' />
      </Box>
    );
  }
}

DroneMessageBox.propTypes = {
  onSend: PropTypes.func.isRequired
};

export default DroneMessageBox;
