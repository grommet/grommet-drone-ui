import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Split from 'grommet/components/Split';

import NavSidebar from './NavSidebar';
import Login from '../screens/Login';

class Main extends Component {
  render() {
    const { children, nav, session: { user } } = this.props;

    let mainNode;
    if (!user) {
      mainNode = <Login />;
    } else if (nav && nav.hide) {
      mainNode = <Box primary={true}>{children}</Box>;
    } else {
      mainNode = (
        <Split flex='right' priority='right' fixed={true}>
          <NavSidebar />
          <Box primary={true}>
            {children}
          </Box>
        </Split>
      );
    }
    return (
      <App centered={false}>
        {mainNode}
      </App>
    );
  }
}

Main.propTypes = {
  children: PropTypes.any,
  nav: PropTypes.object,
  session: PropTypes.shape({
    user: PropTypes.object
  })
};

const select = state => ({
  session: state.session, nav: state.nav
});

export default connect(select)(Main);
