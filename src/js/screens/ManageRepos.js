import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import Toast from 'grommet/components/Toast';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Sync from 'grommet/components/icons/base/Sync';

import ElementCheckBox from '../components/ElementCheckBox';
import Loading from '../components/Loading';

import {
  addRepo, filterRepos, getAllRepos, removeRepo, syncRepos
} from '../actions/repo';
import { REPO_CLEAR_MESSAGE, NAV_HIDE, NAV_SHOW } from '../actions';
import { pageLoaded } from './utils';

class ManageRepos extends Component {

  constructor() {
    super();

    this._onRepoChange = this._onRepoChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onSyncRepos = this._onSyncRepos.bind(this);

    this.state = {
      searchText: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    pageLoaded('Manage Repos');

    dispatch(getAllRepos());
    dispatch({ type: NAV_HIDE });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: NAV_SHOW });
  }

  _onRepoChange(repo) {
    if (repo.id > 0) {
      this.props.dispatch(removeRepo(repo));
    } else {
      this.props.dispatch(addRepo(repo));
    }
  }

  _onSearch(event) {
    const { dispatch } = this.props;
    this.setState({ searchText: event.target.value }, () => {
      dispatch(filterRepos(event.target.value));
    });
  }

  _onSyncRepos() {
    const { dispatch } = this.props;
    dispatch(syncRepos());
  }

  render() {
    const { allRepos, dispatch, error, loading, success } = this.props;
    const { searchText } = this.state;

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
        let labelNode = (
          <Label>{repo.full_name}</Label>
        );
        if (repo.id) {
          labelNode = (
            <Label>
              <Anchor a11yTitle={`See ${repo.full_name} settings`}
                path={`/${repo.owner}/${repo.name}/settings`}>
                {repo.full_name}
              </Anchor>
            </Label>
          );
        }
        return (
          <ListItem key={`menu-item-${index}`} justify='between'>
            {labelNode}
            <ElementCheckBox async={true} element={repo}
              onChange={this._onRepoChange} checked={!!repo.id} />
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
      <Box full={true} colorIndex='grey-2'>
        <Box flex={false}>
          {toastNode}
          <Header align='center' justify='between' direction='row'
            pad={{
              vertical: 'medium', horizontal: 'small'
            }}>
            <Box direction='row' responsive={false} align='center'>
              <Anchor a11yTitle='Return to Dashboard' path='/'
                icon={<LinkPrevious />} />
              <Label uppercase={true} margin='none'>repos</Label>
            </Box>
            <Box direction='row' responsive={false} align='center'
              justify='end' flex={true}>
              <Search inline={true} fill={true} size='medium' placeHolder='Search'
                value={searchText} onDOMChange={this._onSearch} />
              <Button a11yTitle='Sync repos' icon={<Sync />}
                onClick={this._onSyncRepos} />
            </Box>
          </Header>
          {reposNode}
        </Box>
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
