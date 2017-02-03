import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Menu from 'grommet/components/Menu';
import Notification from 'grommet/components/Notification';
import Anchor from 'grommet/components/Anchor';
import ConnectIcon from 'grommet/components/icons/base/Connect';
import Spinning from 'grommet/components/icons/Spinning';

import DroneMenuItem from './DroneMenuItem';
import SessionMenu from './SessionMenu';

import { loadUserRepos, startUserReposStream } from '../actions/user';
import { loadBot } from '../actions/bot';

class NavSidebar extends Component {

  componentDidMount() {
    this.props.dispatch(loadUserRepos());
    this.props.dispatch(startUserReposStream());
    this.props.dispatch(loadBot());
  }

  render() {
    const { bot, error, loading, repos, session: { user } } = this.props;

    let errorNode;
    if (error) {
      errorNode = (
        <Notification status='critical' message='Could not load repos'
          state={error} />
      );
    }

    let reposNode;
    if (repos) {
      reposNode = repos.map((repo, index) => (
        <DroneMenuItem key={`menu-item-${index}`} path={`/${repo.full_name}`}
          label={repo.full_name} status={repo.status} />
      ));
    }

    if (loading) {
      reposNode = (
        <Box responsive={false} direction='row'
          pad={{ between: 'small', vertical: 'medium', horizontal: 'medium' }}>
          <Spinning />
          <span>Loading...</span>
        </Box>
      );
    }

    let botMenuItem;
    if (bot && bot.name) {
      botMenuItem = (
        <DroneMenuItem path='/' label={bot.name} status='success' />
      );
    }

    return (
      <Sidebar colorIndex='grey-3'>
        <Header align='end' direction='column' pad='medium'>
          <Anchor reverse={true} path='/manage' label='Manage Repos'
            icon={<ConnectIcon />} />
        </Header>
        {errorNode}
        <Menu fill={true} align='end'
          pad={{ vertical: 'small', between: 'small' }}>
          {botMenuItem}
          {reposNode}
        </Menu>
        <Footer pad='small'>
          <SessionMenu />
          {user.login}
        </Footer>
      </Sidebar>
    );
  }

}

NavSidebar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  repos: PropTypes.arrayOf(PropTypes.object),
  bot: PropTypes.object,
  session: PropTypes.object
};

const select = state => ({
  ...state.user, bot: state.bot, session: state.session
});

export default connect(select)(NavSidebar);
