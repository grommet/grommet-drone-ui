import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Search from 'grommet/components/Search';
import Select from 'grommet/components/Select';
import Sidebar from 'grommet/components/Sidebar';
import Split from 'grommet/components/Split';
import Toast from 'grommet/components/Toast';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import Close from 'grommet/components/icons/base/Close';
import Sync from 'grommet/components/icons/base/Sync';
import Filter from 'grommet/components/icons/base/Filter';

import ElementCheckBox from '../components/ElementCheckBox';
import Loading from '../components/Loading';

import {
  addRepo, filterRepos, getAllRepos, removeRepo, searchRepos, syncRepos
} from '../actions/repo';
import { REPO_CLEAR_MESSAGE } from '../actions';
import { pageLoaded } from './utils';

class ManageRepos extends Component {

  constructor(props, context) {
    super(props, context);

    this._onRepoChange = this._onRepoChange.bind(this);
    this._onSearch = this._onSearch.bind(this);
    this._onSyncRepos = this._onSyncRepos.bind(this);
    this._onFilterStatus = this._onFilterStatus.bind(this);
    this._onFilterOwners = this._onFilterOwners.bind(this);

    this.state = {
      searchText: '',
      showFilter: false,
      filter: props.filter
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    pageLoaded('Manage Repos');

    dispatch(getAllRepos());
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.filter ||
      (nextProps.filter !== this.state.filter)) {
      this.setState({ filter: nextProps.filter });
    }
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
      dispatch(searchRepos(event.target.value));
    });
  }

  _onSyncRepos() {
    const { dispatch } = this.props;
    dispatch(syncRepos());
  }

  _onFilterStatus(event) {
    const { dispatch } = this.props;
    const status = event.option.value;

    dispatch(filterRepos({ status }));
  }

  _onFilterOwners(event) {
    const { dispatch } = this.props;
    const owner = event.option.value;

    if (owner === 'all') {
      dispatch(filterRepos({ owner: 'all' }));
    } else {
      let ownerGroup = event.value.filter(value => value !== 'all').map(value => (
        typeof value === 'object' ? value.value : value
      ));

      if (ownerGroup.length === 0) {
        ownerGroup = 'all';
      }
      dispatch(filterRepos({
        owner: ownerGroup
      }));
    }
  }

  render() {
    const { allRepos, dispatch, error, loading, success } = this.props;
    const { searchText, showFilter, filter } = this.state;

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
                path={`/${repo.full_name}/settings`}>
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

    let filterTop;
    let filterBottom;
    if (filter) {
      filterTop = (
        <Label size='small'>{filter.filteredTotal}</Label>
      );
      filterBottom = (
        <Label size='small'>{filter.unfilteredTotal}</Label>
      );
    }
    const content = (
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
              <Button a11yTitle='Open Filter sidebar'
                onClick={() => this.setState({
                  showFilter: true
                })}>
                <Box align='center' pad={{ horizontal: 'small' }}>
                  {filterTop}
                  <Filter />
                  {filterBottom}
                </Box>
              </Button>
            </Box>
          </Header>
          {reposNode}
        </Box>
      </Box>
    );

    if (showFilter) {
      let ownersFilterNode;
      if (filter.owners) {
        const options = filter.owners.map(owner => (
          { value: owner }
        ));
        ownersFilterNode = (
          <Box pad={{
            vertical: 'medium', horizontal: 'medium', between: 'small'
          }}>
            <Label uppercase={true} margin='none'>Owners</Label>
            <Select inline={true} multiple={true} options={[
              { label: 'All', value: 'all' },
              ...options
            ]} value={filter.owner} onChange={this._onFilterOwners} />
          </Box>
        );
      }

      return (
        <Split flex='left' priority='right'>
          {content}
          <Sidebar colorIndex='light-2'>
            <Header justify='between'
              pad={{ vertical: 'medium', horizontal: 'small' }}>
              <Box pad={{ horizontal: 'small' }}>
                <Heading tag='h3' margin='none' strong={true}>
                  Filter Repos
                </Heading>
              </Box>
              <Button a11yTitle='Close Filter sidebar' icon={<Close />}
                onClick={() => this.setState({
                  showFilter: false
                })} />
            </Header>
            <Box pad={{ horizontal: 'medium', between: 'small' }}>
              <Label uppercase={true} margin='none'>Status</Label>
              <Select inline={true} options={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' }
              ]} value={filter.status} onChange={this._onFilterStatus} />
            </Box>
            {ownersFilterNode}
          </Sidebar>
        </Split>
      );
    }
    return content;
  }
}

ManageRepos.propTypes = {
  allRepos: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  filter: PropTypes.object,
  loading: PropTypes.bool,
  success: PropTypes.string
};

const select = state => ({
  ...state.repo
});

export default connect(select)(ManageRepos);
