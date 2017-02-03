import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Label from 'grommet/components/Label';
import Toast from 'grommet/components/Toast';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import SettingsOption from 'grommet/components/icons/base/SettingsOption';
import Spinning from 'grommet/components/icons/Spinning';


import Loading from '../components/Loading';

import {
  addRepo, getAllRepos, removeRepo
} from '../actions/repo';
import { REPO_CLEAR_MESSAGE } from '../actions';
import { pageLoaded } from './utils';

class RepoCheckBox extends Component {
  constructor(props, context) {
    super(props, context);

    this._onChange = this._onChange.bind(this);

    this.state = {
      checked: !!props.repo.id
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ checked: !!nextProps.repo.id, changed: false });
  }

  _onChange() {
    const { onChange, repo } = this.props;
    const { checked } = this.state;
    onChange(repo);
    this.setState({ checked: !checked, changed: true });
  }

  render() {
    const { checked, changed } = this.state;

    if (changed) {
      return <Box pad={{ horizontal: 'medium' }}><Spinning /></Box>;
    }
    return (
      <CheckBox toggle={true} checked={checked}
        onChange={this._onChange} />
    );
  }
}

RepoCheckBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  repo: PropTypes.object.isRequired
};

class ManageRepos extends Component {

  constructor() {
    super();

    this._onRepoChange = this._onRepoChange.bind(this);
  }

  componentDidMount() {
    pageLoaded('Manage Repos');

    this.props.dispatch(getAllRepos());
  }

  _onRepoChange(repo) {
    if (repo.id > 0) {
      this.props.dispatch(removeRepo(repo));
    } else {
      this.props.dispatch(addRepo(repo));
    }
  }

  render() {
    const { allRepos, dispatch, error, loading, success } = this.props;

    let toastNode;
    if (success || error) {
      toastNode = (
        <Toast status={success ? 'ok' : 'critical'}
          onClose={() => dispatch({ type: REPO_CLEAR_MESSAGE })}>
          {success || error}
        </Toast>
      );
    }

    let reposNode;
    if (allRepos) {
      const itemsNode = allRepos.map((repo, index) => {
        let settingsAchor;
        if (repo.id) {
          settingsAchor = (
            <Anchor a11yTitle={`See ${repo.full_name} settings`}
              path={`/${repo.owner}/${repo.name}/settings`}>
              <SettingsOption />
            </Anchor>
          );
        }
        return (
          <ListItem key={`menu-item-${index}`} justify='between'>
            <Box align='center' direction='row' responsive={false}>
              <Label>{repo.full_name}</Label>
              {settingsAchor}
            </Box>
            <RepoCheckBox repo={repo} onChange={this._onRepoChange} />
          </ListItem>
        );
      });

      reposNode = (
        <List>
          {itemsNode}
        </List>
      );
    }

    if (loading) {
      reposNode = <Loading />;
    }
    return (
      <Box>
        {toastNode}
        <Header fixed={false} align='start' direction='column'
          pad={{
            vertical: 'medium', horizontal: 'medium', between: 'medium'
          }}>
          <Anchor a11yTitle='Return to Dashboard' path='/'
            label='Back' icon={<LinkPrevious />} />
          <Heading margin='none'>manage repos</Heading>
        </Header>
        {reposNode}
      </Box>
    );
  }
}

ManageRepos.propTypes = {
  allRepos: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  success: PropTypes.string
};

const select = state => ({
  ...state.repo
});

export default connect(select)(ManageRepos);
