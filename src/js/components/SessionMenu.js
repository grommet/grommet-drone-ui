import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';
import Menu from 'grommet/components/Menu';

import Avatar from './Avatar';

class SessionMenu extends Component {

  render() {
    const { session: { user } } = this.props;
    return (
      <Menu icon={<Avatar src={user.avatar_url} name={user.login} />}
        a11yTitle='Session' dropAlign={{ bottom: 'bottom' }}>
        <Box pad='medium'>
          <Label margin='none'>{user.login}</Label>
        </Box>
        <Anchor href='/logout' label='Logout' />
      </Menu>
    );
  }

}

SessionMenu.propTypes = {
  session: PropTypes.object.isRequired
};

const select = state => ({
  session: state.session
});

export default connect(select)(SessionMenu);
