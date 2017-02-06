import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Menu from 'grommet/components/Menu';
import Paragraph from 'grommet/components/Paragraph';
import More from 'grommet/components/icons/base/More';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Validate from 'grommet/components/icons/base/Validate';

import Avatar from '../components/Avatar';
import DroneMessage from '../components/DroneMessage';
import DroneMessageBox from '../components/DroneMessageBox';
import DroneStatusCircle from '../components/DroneStatusCircle';
import NotFound from './NotFound';
import { pageLoaded } from './utils';

import { loadBuilds } from '../actions/repo';

class RepoView extends Component {

  constructor() {
    super();

    this._onMessageReceived = this._onMessageReceived.bind(this);

    this.state = {
      customMessages: []
    };

    this._previousMessages = [];
  }

  componentDidMount() {
    const { dispatch, params: { owner, name } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBuilds(fullName));

    pageLoaded(`${fullName} View`);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, params: { owner, name } } = nextProps;
    const fullName = `${owner}/${name}`;
    const previousOwner = this.props.params.owner;
    const previousName = this.props.params.name;
    const previousFullName = `${previousOwner}/${previousName}`;
    if (fullName !== previousFullName) {
      dispatch(loadBuilds(fullName));

      this._previousMessages = [];
    }

    this.setState({ customMessages: [] });
  }

  _onMessageReceived(message) {
    const customMessages = this.state.customMessages;
    customMessages.push(message);
    this.setState({ customMessages });
  }

  render() {
    const {
      error, loading, params: { owner, name }, repoWithBuilds, session: { user }
    } = this.props;
    const { customMessages } = this.state;

    let messageNodes = this._previousMessages;

    if (error) {
      if (error === 'Not Found') {
        return <NotFound />;
      }
      messageNodes.push(
        <DroneMessage key='error-message'
          colorIndex='critical'
          message={error} />
      );
    }

    const repoName = `${owner}/${name}`;
    const repo = repoWithBuilds && repoWithBuilds.full_name === repoName ?
      repoWithBuilds : undefined;

    if (loading) {
      messageNodes.push(
        <DroneMessage key='loading-message'
          message='Hang tight, I am loading your recent builds...' />
      );
    } else if (repo && (!repo.builds || repo.builds.length === 0)) {
      messageNodes.push(
        <DroneMessage key='empty-repo-message'
          message='This repo does not have any build yet. Add a .drone.yml to get started...' />
      );
    }

    this._previousMessages = messageNodes;

    let buildNodes;
    if (repo && repo.builds) {
      buildNodes = repo.builds.map((build, index) => {
        const message = (
          <Box pad={{
            vertical: 'small', horizontal: 'small', between: 'small'
          }}>
            <Box direction='row' align='center' justify='between'
              responsive={false}>
              <Paragraph size='large' margin='none'>
                #{build.number} {build.message}
              </Paragraph>
              <DroneStatusCircle active={true}
                status={build.status} />
            </Box>
            <Label margin='none'>{build.author} pushed to {build.branch}</Label>
          </Box>
        );
        return (
          <DroneMessage key={`build-message-${index}`} message={message}
            colorIndex='grey-4'
            avatar={<Avatar src={build.author_avatar} name={build.author} />} />
        );
      });
    }

    messageNodes = messageNodes.concat(buildNodes)
      .concat(customMessages.map((m, index) => (
        <DroneMessage key={`custom-message-${index}`} message={m}
          colorIndex='grey-4'
          avatar={<Avatar src={user.avatar_url} name={user.login} />} />
      )));

    return (
      <Box colorIndex='grey-2' full='vertical'>
        <Header justify='between' pad='medium'>
          <Box align='center' direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <DroneStatusCircle active={true}
              status={
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
        <Box flex={true} pad='medium'>
          {messageNodes}
        </Box>
        <Footer full='horizontal' pad='medium'>
          <DroneMessageBox onSend={this._onMessageReceived} />
        </Footer>
      </Box>
    );
  }
}

RepoView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  params: PropTypes.object.isRequired,
  repoWithBuilds: PropTypes.object,
  session: PropTypes.object
};

const select = state => ({ session: state.session, ...state.repo });

export default connect(select)(RepoView);
