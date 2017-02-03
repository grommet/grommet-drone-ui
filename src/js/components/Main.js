import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import App from 'grommet/components/App';
import Split from 'grommet/components/Split';

import NavSidebar from './NavSidebar';
import Login from '../screens/Login';

class Main extends Component {
  render() {
    const { children, session: { user } } = this.props;

    let mainNode;
    if (!user) {
      mainNode = <Login />;
    } else {
      mainNode = (
        <Split flex='right' priority='right' fixed={true}>
          <NavSidebar />
          {children}
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
  session: PropTypes.shape({
    user: PropTypes.object
  })
};

const select = state => ({
  session: state.session
});

export default connect(select)(Main);
