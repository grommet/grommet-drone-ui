import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import FormFields from 'grommet/components/FormFields';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import Menu from 'grommet/components/Menu';
import NumberInput from 'grommet/components/NumberInput';
import Heading from 'grommet/components/Heading';
import Toast from 'grommet/components/Toast';
import Responsive from 'grommet/utils/Responsive';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import More from 'grommet/components/icons/base/More';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Validate from 'grommet/components/icons/base/Validate';
import Spinning from 'grommet/components/icons/Spinning';

import DroneStatusCircle from '../components/DroneStatusCircle';
import { pageLoaded } from './utils';

import { loadBuilds, updateRepo } from '../actions/repo';
import { REPO_CLEAR_MESSAGE } from '../actions';

class RepoSettings extends Component {
  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);
    this._onSettingChange = this._onSettingChange.bind(this);
    this._onTimeoutChange = this._onTimeoutChange.bind(this);
    this._onUpdateRepo = this._onUpdateRepo.bind(this);

    this.state = {
      small: false
    };
  }

  componentDidMount() {
    const { dispatch, params: { owner, name } } = this.props;
    const fullName = `${owner}/${name}`;

    dispatch(loadBuilds(fullName));

    pageLoaded(`${fullName} Badges View`);

    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillReceiveProps(nextProps) {
    const { repoWithBuilds } = nextProps;
    if (repoWithBuilds && !this.state.timeout) {
      this.setState({
        allowPush: repoWithBuilds.allow_push,
        allowPr: repoWithBuilds.allow_pr,
        allowTags: repoWithBuilds.allow_tags,
        allowDeploys: repoWithBuilds.allow_deploys,
        trusted: repoWithBuilds.trusted,
        timeout: repoWithBuilds.timeout
      });
    }
  }

  componentWillUnmount() {
    this._responsive.stop();
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  _onSettingChange(setting) {
    const change = {};
    return (event) => {
      change[setting] = event.target.checked;
      this.setState(change);
    };
  }

  _onTimeoutChange(event) {
    if (event.target.value !== '' && Number(event.target.value) > 0) {
      this.setState({ timeout: event.target.value });
    } else {
      this.setState({ timeout: 1 });
    }
  }

  _onUpdateRepo(event) {
    event.preventDefault();
    const { dispatch, repoWithBuilds } = this.props;
    const {
      allowPush, allowPr, allowTags, allowDeploys, trusted, timeout
    } = this.state;

    const data = {
      allow_push: allowPush,
      allow_pr: allowPr,
      allow_tags: allowTags,
      allow_deploys: allowDeploys,
      trusted, timeout: Number(timeout)
    };

    dispatch(updateRepo(repoWithBuilds.full_name, data));
  }

  render() {
    const {
      dispatch, error, loading, params: { owner, name }, repoWithBuilds, success
    } = this.props;
    const {
      allowPush, allowPr, allowTags, allowDeploys, trusted, timeout, small
    } = this.state;

    let toastNode;
    if (success || error) {
      toastNode = (
        <Toast status={success ? 'ok' : 'critical'}
          onClose={() => dispatch({ type: REPO_CLEAR_MESSAGE })}>
          {success || error}
        </Toast>
      );
    }
    const repoName = `${owner}/${name}`;
    const repo = repoWithBuilds && repoWithBuilds.full_name === repoName ?
      repoWithBuilds : undefined;

    let submitNode = (
      <Button label='Update' primary={true} onClick={this._onUpdateRepo} />
    );

    if (loading) {
      submitNode = (<Label margin='none'><Spinning /> Updating...</Label>);
    }

    let content;
    if (repo) {
      content = (
        <Form onSubmit={this._onUpdateRepo}>
          <FormFields>
            <FormField>
              <CheckBox onChange={this._onSettingChange('allowPush')}
                checked={allowPush} label='Push Hooks' toggle={true} />
            </FormField>
            <FormField>
              <CheckBox onChange={this._onSettingChange('allowPr')}
                checked={allowPr} label='Pull Request Hooks' toggle={true} />
            </FormField>
            <FormField>
              <CheckBox onChange={this._onSettingChange('allowTags')}
                checked={allowTags} label='Tag Hooks' toggle={true} />
            </FormField>
            <FormField>
              <CheckBox onChange={this._onSettingChange('allowDeploys')}
                checked={allowDeploys} label='Deploy Hooks' toggle={true} />
            </FormField>
            <FormField>
              <CheckBox onChange={this._onSettingChange('trusted')}
                checked={trusted} label='Trusted' toggle={true} />
            </FormField>
            <FormField label='Timeout (minutes)'>
              <NumberInput value={timeout} onChange={this._onTimeoutChange} />
            </FormField>
          </FormFields>
          <Footer pad={{ vertical: 'medium' }}>
            {submitNode}
          </Footer>
        </Form>
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
        {toastNode}
      </Box>
    );
  }
}

RepoSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  params: PropTypes.object.isRequired,
  repoWithBuilds: PropTypes.object,
  success: PropTypes.string
};

const select = state => ({ ...state.repo });

export default connect(select)(RepoSettings);
