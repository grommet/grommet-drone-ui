import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';
import Responsive from 'grommet/utils/Responsive';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';

import LogViewer from '../components/LogViewer';
import DroneStatusCircle from '../components/DroneStatusCircle';
import StatusIcon from '../components/StatusIcon';
import NotFound from './NotFound';
import { getJobKey, pageLoaded } from './utils';

import { NAV_HIDE, NAV_SHOW } from '../actions';
import { startUserReposStream } from '../actions/user';
import { loadBuildLogs, startLogStream, stopLogStream } from '../actions/repo';

class BuildView extends Component {
  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);

    this.state = {
      small: false
    };
  }

  componentDidMount() {
    const { dispatch, params: { owner, name, number } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBuildLogs(fullName, number));

    dispatch({ type: NAV_HIDE });

    pageLoaded(`${name} Build ${number} View`);

    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillReceiveProps(nextProps) {
    const { build, dispatch, params: { owner, name } } = nextProps;
    const fullName = `${owner}/${name}`;

    const isAlreadyRunning = (
      this.props.build && this.props.build.status === 'running'
    );

    if (!isAlreadyRunning && build && build.status === 'running' &&
      build.jobs.length === 1) {
      // needed to get the build status after job is finished
      dispatch(startUserReposStream());
      dispatch(startLogStream(fullName, build, build.jobs[0]));
    }
  }

  componentWillUnmount() {
    const { build, dispatch } = this.props;
    this._responsive.stop();
    if (build && build.jobs.length === 1) {
      stopLogStream(build, build.jobs[0]);
    }
    dispatch({ type: NAV_SHOW });
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  render() {
    const {
      build, error, params: { owner, name, number }
    } = this.props;
    const { small } = this.state;

    if (error) {
      return <NotFound />;
    }

    const repoName = `${owner}/${name}`;

    let content;
    if (build) {
      if (build.jobs.length > 1) {
        const environmentNodes = build.jobs.map((job, index) => {
          const path = `/${repoName}/build/${build.number}/${job.number}`;
          return (
            <ListItem key={`log-env-${index}`}>
              <Button fill={true} path={path}>
                <Box direction='row' responsive={false} justify='between'>
                  <Label>
                    {getJobKey(job.environment)}
                  </Label>
                  <Box direction='row' responsive={false} align='center'
                    pad={{ between: 'small' }}>
                    <Paragraph>#{job.number}</Paragraph>
                    <StatusIcon status={job.status} />
                  </Box>
                </Box>
              </Button>
            </ListItem>
          );
        });
        content = (
          <List>
            {environmentNodes}
          </List>
        );
      } else if (build.log) {
        content = (
          <LogViewer log={build.log} />
        );
      }
    }

    let buildNode = (
      <Label uppercase={true} margin='none'>Build {number}</Label>
    );
    if (small) {
      buildNode = (
        <Paragraph size='small' margin='none'>Build {number}</Paragraph>
      );
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
              build ? build.status : 'unknown'
            } />
            <Heading tag={small ? 'h4' : 'h3'} margin='none'>
              {small ? name : repoName}
            </Heading>
          </Box>
          {buildNode}
        </Header>
        <Box flex={true}>
          {content}
        </Box>
      </Box>
    );
  }
}

BuildView.propTypes = {
  build: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  params: PropTypes.object.isRequired
};

const select = state => ({ ...state.repo });

export default connect(select)(BuildView);
