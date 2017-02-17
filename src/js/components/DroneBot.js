import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Paragraph from 'grommet/components/Paragraph';

import Avatar from './Avatar';
import DroneMessage from './DroneMessage';
import DroneMessageBox from './DroneMessageBox';

import { BOT_CLEAR_RESPONSE } from '../actions';
import { loadBot, processMessage } from '../actions/bot';

class DroneBot extends Component {

  constructor() {
    super();

    this._onMessageReceived = this._onMessageReceived.bind(this);

    this.state = {
      activeMessage: undefined,
      botResponse: undefined
    };
  }

  componentDidMount() {
    this.props.dispatch(loadBot());
  }

  componentWillReceiveProps(nextProps) {
    const { bot } = nextProps;

    if (bot.response !== this.state.botResponse) {
      this.setState({ botResponse: bot.response });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: BOT_CLEAR_RESPONSE });
  }

  _onMessageReceived(message) {
    const { dispatch } = this.props;
    this.setState({
      activeMessage: message, botResponse: 'Ok, let me process this...'
    }, () => (
      dispatch(processMessage(message))
    ));
  }

  render() {
    const { bot, session: { user } } = this.props;
    const { activeMessage, botResponse } = this.state;

    let messagesNode;
    if (bot) {
      const messages = [
        <Paragraph margin='none'>
          {`Hey ${user.login}, I’m your personal drone, `}
          <b className='drone-strong'>{bot.name}</b>.
        </Paragraph>,
        'Choose a project or type "help" to get started.'
      ];

      messagesNode = messages.map((m, index) => (
        <DroneMessage key={`message-${index}`} message={m} />
      ));

      if (activeMessage) {
        messagesNode.push(
          <DroneMessage key='active-message' message={activeMessage}
            colorIndex='grey-4'
            avatar={<Avatar src={user.avatar_url} name={user.login} />} />
        );
      }

      if (botResponse) {
        if (Array.isArray(botResponse)) {
          messagesNode = messagesNode.concat(
            botResponse.map((response, index) => (
              <DroneMessage key={`bot-response${index}`} message={response} />
            ))
          );
        } else {
          messagesNode.push(
            <DroneMessage key='bot-response' message={botResponse} />
          );
        }
      }
    }

    return (
      <Box colorIndex='grey-2' flex={true}>
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
  bot: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.object
};

const select = state => ({ ...state.bot, session: state.session });

export default connect(select)(DroneBot);
