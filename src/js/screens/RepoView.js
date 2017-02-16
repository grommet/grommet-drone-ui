import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Layer from 'grommet/components/Layer';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import More from 'grommet/components/icons/base/More';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Validate from 'grommet/components/icons/base/Validate';
import Responsive from 'grommet/utils/Responsive';

import Avatar from '../components/Avatar';
import DroneMessage from '../components/DroneMessage';
import DroneMessageBox from '../components/DroneMessageBox';
import DroneStatusCircle from '../components/DroneStatusCircle';
import Logo from '../components/Logo';
import NavSidebar from '../components/NavSidebar';
import StatusIcon from '../components/StatusIcon';
import NotFound from './NotFound';
import { pageLoaded } from './utils';

import { loadBuilds } from '../actions/repo';
import { loadBot, processInContextMessage } from '../actions/bot';

class RepoView extends Component {

  constructor() {
    super();

    this._onMessageReceived = this._onMessageReceived.bind(this);
    this._onResponsive = this._onResponsive.bind(this);
    this._scrollToBottom = this._scrollToBottom.bind(this);

    this.state = {
      activeMessage: undefined,
      botResponse: undefined,
      small: false,
      showNav: false
    };
  }

  componentDidMount() {
    const { dispatch, params: { owner, name } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBot());
    dispatch(loadBuilds(fullName));

    pageLoaded(`${fullName} View`);

    this._responsive = Responsive.start(this._onResponsive);

    this._scrollToBottom();
  }

  componentWillReceiveProps(nextProps) {
    const { bot, dispatch, params: { owner, name } } = nextProps;
    const fullName = `${owner}/${name}`;
    const previousOwner = this.props.params.owner;
    const previousName = this.props.params.name;
    const previousFullName = `${previousOwner}/${previousName}`;

    let botResponse;
    if (bot && bot.response !== this.state.botResponse) {
      botResponse = bot.response;
    }

    let activeMessage = this.state.activeMessage;
    if (fullName !== previousFullName) {
      activeMessage = undefined; // clear messages if you are in another repo
      botResponse = undefined; // clear messages if you are in another repo
      dispatch(loadBuilds(fullName));
    }

    this.setState(
      { activeMessage, showNav: false, botResponse },
      () => this._scrollToBottom()
    );
  }

  componentWillUnmount() {
    this._responsive.stop();
  }

  _scrollToBottom() {
    if (this._chatRef) {
      const chatBoxNode = findDOMNode(this._chatRef);
      chatBoxNode.scrollTop = chatBoxNode.scrollHeight;
    }
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  _onMessageReceived(message) {
    const { dispatch, params: { owner, name } } = this.props;
    const fullName = `${owner}/${name}`;
    this.setState({
      activeMessage: message, botResponse: 'Ok, let me process this...'
    }, () => (
      dispatch(processInContextMessage(message, fullName))
    ));
  }

  render() {
    const {
      error, params: { owner, name }, repoWithBuilds, session: { user }
    } = this.props;
    const { activeMessage, botResponse, small, showNav } = this.state;

    if (error) {
      return <NotFound />;
    }

    const repoName = `${owner}/${name}`;
    const repo = repoWithBuilds && repoWithBuilds.full_name === repoName ?
      repoWithBuilds : undefined;

    let content;
    if (repo && (!repo.builds || repo.builds.length === 0)) {
      content = [
        <DroneMessage key='empty-repo-message'
          message='This repo does not have any build yet.' />,
        <DroneMessage key='drone-config-reference'
          message={<Paragraph margin='none'>
            Check out the <Anchor target='_blank' label='get started'
              href='http://readme.drone.io/usage/getting-started/' /> page for
            instructions on how to create your first .drone.yml. Or simply push
            a new commit if you already have it.
          </Paragraph>} />
      ];
    } else if (repo && repo.builds) {
      content = repo.builds.map((build, index) => {
        const message = (
          <Button fill={true} a11yTitle={`See build ${build.number} details`}
            path={`/${repoName}/build/${build.number}`}>
            <Box direction='row' flex={true} justify='between'
              pad={{ vertical: 'small', horizontal: 'small', between: 'small' }}>
              <Box pad={{ between: 'small' }}>
                <Box direction='row' align='center' justify='between'
                  responsive={false}>
                  <Paragraph margin='none' className='drone-strong-text'>
                    {build.message}
                  </Paragraph>
                </Box>
                <Paragraph size='small' margin='none'>
                  {build.author} pushed to {build.branch}
                </Paragraph>
              </Box>
              <Box align={small ? 'start' : 'end'} pad={{ between: 'small' }}>
                <Box direction='row' responsive={false} align='center'
                  pad={{ between: 'small' }}>
                  <Paragraph margin='none'>#{build.number}</Paragraph>
                  <StatusIcon status={build.status} />
                </Box>
                <Paragraph align='end' size='small' margin='none'>{
                  build.status === 'pending' || build.status === 'running' ?
                    'Running' :
                    `Finished ${moment.duration(
                      (build.finished_at - build.started_at) * 1000
                    ).humanize(true)}`
                }</Paragraph>
              </Box>
            </Box>
          </Button>
        );
        return (
          <DroneMessage key={`build-message-${index}`} message={message}
            colorIndex='grey-4' size='large' timestamp={build.enqueued_at}
            avatar={<Avatar src={build.author_avatar} name={build.author} />} />
        );
      });
    }

    if (content && activeMessage) {
      content.push(
        <DroneMessage key='active-message' message={activeMessage}
          colorIndex='grey-4'
          avatar={<Avatar src={user.avatar_url} name={user.login} />} />
      );
    }

    if (content && botResponse) {
      if (Array.isArray(botResponse)) {
        content = content.concat(
          botResponse.map((response, index) => (
            <DroneMessage key={`bot-response${index}`} message={response} />
          ))
        );
      } else {
        content.push(
          <DroneMessage key='bot-response' message={botResponse} />
        );
      }
    }

    let headerNode = (
      <Header justify='between' pad='medium'>
        <Box align='center' direction='row' responsive={false}
          pad={{ between: 'small' }}>
          <DroneStatusCircle status={
            (repo && repo.builds && repo.builds.length > 0) ?
              repo.status : 'unknown'
          } />
          <Heading tag='h3' margin='none'>{repoName}</Heading>
        </Box>
        <Menu icon={<More />} a11yTitle='More Actions'
          dropAlign={{ right: 'right' }}>
          <Anchor path={`/${repoName}/settings`} label='Settings'
            icon={<SettingsOption />} />
          <Anchor path={`/${repoName}/badges`} label='Badges'
            icon={<Validate />} />
        </Menu>
      </Header>
    );

    if (small) {
      headerNode = (
        <Header justify='between' colorIndex='grey-2' align='center'
          pad='medium'>
          <Box align='center' direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Anchor a11yTitle='Show navigation bar'
              onClick={() => this.setState({ showNav: true })}>
              <Logo />
            </Anchor>
            <DroneStatusCircle status={
              (repo && repo.builds && repo.builds.length > 0) ?
                repo.status : 'unknown'
            } />
            <Heading tag='h4' margin='none'>{name}</Heading>
          </Box>
          <Menu icon={<More />} a11yTitle='More Actions'
            dropAlign={{ right: 'right' }}>
            <Anchor path={`/${repoName}/settings`} label='Settings'
              icon={<SettingsOption />} />
            <Anchor path={`/${repoName}/badges`} label='Badges'
              icon={<Validate />} />
          </Menu>
        </Header>
      );
    }

    let navLayer;
    if (showNav) {
      navLayer = (
        <Layer flush={true} closer={true}
          onClose={() => this.setState({ showNav: false })}>
          <NavSidebar />
        </Layer>
      );
    }

    return (
      <Box colorIndex='grey-2' full='vertical'>
        {headerNode}
        <Box ref={ref => this._chatRef = ref} flex={true}
          pad={{ vertical: 'medium', horizontal: 'medium', between: 'medium' }}>
          {content}
        </Box>
        <Footer flex={false} pad='medium'>
          <DroneMessageBox onSend={this._onMessageReceived} />
        </Footer>
        {navLayer}
      </Box>
    );
  }
}

RepoView.propTypes = {
  bot: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  params: PropTypes.object.isRequired,
  repoWithBuilds: PropTypes.object,
  session: PropTypes.object
};

const select = state => (
  { ...state.bot, ...state.repo, session: state.session }
);

export default connect(select)(RepoView);
