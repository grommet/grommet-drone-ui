import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Paragraph from 'grommet/components/Paragraph';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Responsive from 'grommet/utils/Responsive';

import DroneStatusCircle from '../components/DroneStatusCircle';
import LogViewer from '../components/LogViewer';
import NotFound from './NotFound';
import { getJobKey, pageLoaded } from './utils';

import { startUserReposStream } from '../actions/user';
import { loadBuildLog, startLogStream, stopLogStream } from '../actions/repo';

class LogView extends Component {
  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);

    this.state = {
      small: false
    };
  }

  componentDidMount() {
    const { dispatch, params: { owner, name, number, log } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBuildLog(fullName, number, log));

    pageLoaded(`${name} Log ${log} View`);

    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillReceiveProps(nextProps) {
    const { build, dispatch, params: { owner, name, log } } = nextProps;
    const fullName = `${owner}/${name}`;

    const isAlreadyRunning = (
      this.props.build && this.props.build.status === 'running'
    );

    if (!isAlreadyRunning && build && build.status === 'running') {
      this._runningJob = undefined;
      build.jobs.some((j) => {
        if (j.number.toString() === log) {
          this._runningJob = j;
          return true;
        }
        return false;
      }, this);
      // needed to get the build status after job is finished
      dispatch(startUserReposStream());
      dispatch(startLogStream(fullName, build, this._runningJob));
    }
  }

  componentWillUnmount() {
    const { build } = this.props;
    this._responsive.stop();

    if (build && this._runningJob) {
      stopLogStream(build, this._runningJob);
    }
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  render() {
    const {
      build, error, params: { owner, name, number, log }
    } = this.props;
    const { small } = this.state;

    if (error) {
      return <NotFound />;
    }

    const repoName = `${owner}/${name}`;

    let content;
    let environmentTag;
    let job;
    if (build && build.log) {
      content = (
        <LogViewer log={build.log} />
      );

      build.jobs.some((j) => {
        if (j.number.toString() === log) {
          job = j;
          return true;
        }
        return false;
      });

      environmentTag = small ?
          (
            <Box align='end'>
              <Paragraph size='small' margin='none'>Build {number}</Paragraph>
              <Paragraph size='small' margin='none'>
                {getJobKey(job.environment)}
              </Paragraph>
            </Box>
          ) : (
            <Box align='end'>
              <Label margin='none'>Build {number}</Label>
              <Label margin='none'>
                {getJobKey(job.environment)}
              </Label>
            </Box>
        );
    }

    return (
      <Box colorIndex='grey-2' full='vertical'>
        <Header justify='between'
          pad={{ horizontal: 'small', vertical: 'medium' }}>
          <Box align='center' direction='row' responsive={false}
            pad={{ between: 'small' }}>
            <Anchor a11yTitle={`Return to ${name} build ${number}`}
              path={`/${repoName}/build/${number}`}
              icon={<LinkPrevious />} />
            <DroneStatusCircle status={
              build ? build.status : 'unknown'
            } />
            <Heading tag={small ? 'h4' : 'h3'} margin='none'>
              {small ? name : repoName}
            </Heading>
          </Box>
          {environmentTag}
        </Header>
        <Box flex={true}>
          {content}
        </Box>
      </Box>
    );
  }
}

LogView.propTypes = {
  build: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  params: PropTypes.object.isRequired
};

const select = state => ({ ...state.repo });

export default connect(select)(LogView);
