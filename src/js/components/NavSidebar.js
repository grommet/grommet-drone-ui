import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Label from 'grommet/components/Label';
import Menu from 'grommet/components/Menu';
import Notification from 'grommet/components/Notification';
import Spinning from 'grommet/components/icons/Spinning';

import DroneMenuItem from './DroneMenuItem';
import Logo from './Logo';
import SessionMenu from './SessionMenu';

import {
  loadUserRepos, startUserReposStream
} from '../actions/user';
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

    let contentNode;
    if (repos) {
      const reposNode = repos.map((repo, index) => (
        <DroneMenuItem key={`menu-item-${index}`} path={`/${repo.full_name}`}
          label={repo.name} status={repo.status} />
      ));

      contentNode = (
        <Menu fill={true} align='end'
          pad={{ vertical: 'small', between: 'small' }}>
          {reposNode}
        </Menu>
      );
    }

    if (loading) {
      contentNode = (
        <Box flex={true} align='start' justify='end'
          responsive={false} direction='row'
          pad={{ between: 'small', vertical: 'medium', horizontal: 'medium' }}>
          <Spinning />
          <span>Loading...</span>
        </Box>
      );
    } else if (repos && repos.length === 0) {
      contentNode = (
        <Box flex={true} align='start' responsive={false} direction='row'
          justify='center'
          pad={{ between: 'small', vertical: 'medium', horizontal: 'medium' }}>
          <Button path='/manage' primary={true} label='Add my first repo' />
        </Box>
      );
    }

    let botNode;
    if (bot && bot.name) {
      botNode = (
        <span>{bot.name}</span>
      );
    }

    return (
      <Sidebar colorIndex='grey-3'>
        <Header align='center' pad='medium'>
          <Button path='/'>
            <Box align='center' direction='row' responsive={false}
              pad={{ between: 'small' }}>
              <Logo />
              <Label margin='none'>{botNode}</Label>
            </Box>
          </Button>
        </Header>
        {errorNode}
        {contentNode}
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
  ...state.user, ...state.bot, session: state.session
});

export default connect(select)(NavSidebar);
