import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import Markdown from 'grommet/components/Markdown';
import Menu from 'grommet/components/Menu';
import Heading from 'grommet/components/Heading';
import Image from 'grommet/components/Image';
import Responsive from 'grommet/utils/Responsive';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import More from 'grommet/components/icons/base/More';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Validate from 'grommet/components/icons/base/Validate';

import DroneStatusCircle from '../components/DroneStatusCircle';
import NotFound from './NotFound';
import { pageLoaded } from './utils';

import { loadBuilds } from '../actions/repo';
import { NAV_HIDE, NAV_SHOW } from '../actions';

class RepoBadge extends Component {
  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);

    this.state = {
      small: false,
      host: undefined
    };
  }

  componentDidMount() {
    const { dispatch, params: { owner, name } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch({ type: NAV_HIDE });
    dispatch(loadBuilds(fullName));

    pageLoaded(`${fullName} Badges View`);

    this._responsive = Responsive.start(this._onResponsive);

    this.setState({ host: window.location.origin });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    this._responsive.stop();
    dispatch({ type: NAV_SHOW });
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  render() {
    const {
      error, params: { owner, name }, repoWithBuilds
    } = this.props;
    const { host, small } = this.state;

    if (error) {
      return <NotFound />;
    }

    const repoName = `${owner}/${name}`;
    const repo = repoWithBuilds && repoWithBuilds.full_name === repoName ?
      repoWithBuilds : undefined;

    let content;
    if (host) {
      const baseURL = (`${host}/api/badges/${repoName}`);
      content = [
        <Box key='markdown-node'>
          <Label uppercase={true}>Markdown</Label>
          <Markdown components={{
            img: { props: { size: 'small' } },
            p: { props: { margin: 'none' } }
          }} content={`[![](${baseURL}/status.svg)](${baseURL})`} />
          <pre>
            <code className='drone-repo-badge'>
              {`[![Build Status](${baseURL}/status.svg)](${baseURL})`}
            </code>
          </pre>
        </Box>,
        <Box key='markup-node'>
          <Label uppercase={true}>HTML</Label>
          <Anchor href={baseURL}>
            <Image size='small' alt='Build status'
              src={`${baseURL}/status.svg`} />
          </Anchor>
          <pre>
            <code className='drone-repo-badge'>
              {`<a href="${baseURL}"><img src="${baseURL}/status.svg"/></a>`}
            </code>
          </pre>
        </Box>
      ];
    }
    return (
      <Box colorIndex='grey-2' full='vertical'>
        <Header justify='between'
          pad={{ horizontal: 'small', vertical: 'medium' }}>
          <Box align='center' direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Anchor a11yTitle={`Return to ${repoName}`} path={`/${repoName}`}
              icon={<LinkPrevious />} />
            <DroneStatusCircle status={
              (repo && repo.builds && repo.builds.length > 0) ?
                repo.status : 'unknown'
            } />
            <Heading tag={small ? 'h4' : 'h3'} margin='none'>
              {small ? name : repoName}
            </Heading>
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
          {content}
        </Box>
      </Box>
    );
  }
}

RepoBadge.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  params: PropTypes.object.isRequired,
  repoWithBuilds: PropTypes.object
};

const select = state => ({ ...state.repo });

export default connect(select)(RepoBadge);
