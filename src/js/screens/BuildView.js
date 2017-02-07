import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Menu from 'grommet/components/Menu';
import More from 'grommet/components/icons/base/More';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Validate from 'grommet/components/icons/base/Validate';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import DroneMessage from '../components/DroneMessage';
import DroneStatusCircle from '../components/DroneStatusCircle';
import NotFound from './NotFound';
import { pageLoaded } from './utils';

import { loadBuildLogs } from '../actions/repo';

class RepoView extends Component {
  componentDidMount() {
    const { dispatch, params: { owner, name, number } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBuildLogs(fullName, number));

    pageLoaded(`${name} Build ${number} View`);
  }

  render() {
    const {
      build, error, loading, params: { owner, name, number }
    } = this.props;

    const messageNodes = [];

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

    if (loading) {
      messageNodes.push(
        <DroneMessage key='loading-message'
          message='Hang tight, I am loading your recent logs...' />
      );
    }

    return (
      <Box colorIndex='grey-2' full='vertical'>
        <Header justify='between' pad='medium'>
          <Box align='center' direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Anchor a11yTitle={`Return to ${repoName}`} path={`/${repoName}`}
              icon={<LinkPrevious />} />
            <DroneStatusCircle active={true}
              status={
                build ? build.status : 'unknown'
              } />
            <Box>
              <Heading tag='h3' margin='none'>{repoName}</Heading>
              <Label uppercase={true} margin='none'>Build: {number}</Label>
            </Box>

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
          {build ? JSON.stringify(build.logs) : 'unset'}
        </Box>
      </Box>
    );
  }
}

RepoView.propTypes = {
  build: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  params: PropTypes.object.isRequired
};

const select = state => ({ ...state.repo });

export default connect(select)(RepoView);
