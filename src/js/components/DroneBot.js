import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';

import Avatar from './Avatar';
import DroneMessage from './DroneMessage';
import DroneMessageBox from './DroneMessageBox';

import { loadBot } from '../actions/bot';

class DroneBot extends Component {

  constructor() {
    super();

    this._onMessageReceived = this._onMessageReceived.bind(this);

    this.state = {
      customMessages: []
    };
  }

  componentDidMount() {
    this.props.dispatch(loadBot());
  }

  _onMessageReceived(message) {
    const customMessages = this.state.customMessages;
    customMessages.push(message);
    this.setState({ customMessages });
  }

  render() {
    const { bot, session: { user } } = this.props;
    const { customMessages } = this.state;

    let messagesNode;
    if (bot) {
      const messages = [
        <span>
          {`Hey ${user.login}, I’m your personal drone, `}
          <b className='drone-strong'>{bot.name}</b>.
        </span>,
        'Choose a project or type "help" to get started.'
      ];

      const customMessagesNode = customMessages.map((m, index) => (
        <DroneMessage key={`custom-message-${index}`} message={m}
          colorIndex='grey-4'
          avatar={<Avatar src={user.avatar_url} name={user.login} />} />
      ));
      messagesNode = messages.map((m, index) => (
        <DroneMessage key={`message-${index}`} message={m} />
      )).concat(customMessagesNode);
    }

    return (
      <Box colorIndex='grey-2' full='vertical'>
        <Box flex={true} pad='medium'>
          {messagesNode}
        </Box>
        <Footer flex={false} pad='medium'>
          <DroneMessageBox onSend={this._onMessageReceived} />
        </Footer>
      </Box>
    );
  }
}

DroneBot.propTypes = {
  dispatch: PropTypes.func.isRequired,
  bot: PropTypes.object,
  session: PropTypes.object
};

const select = state => ({ bot: state.bot, session: state.session });

export default connect(select)(DroneBot);
