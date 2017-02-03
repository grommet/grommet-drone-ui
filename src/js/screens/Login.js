import React, { Component } from 'react';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Footer from 'grommet/components/Footer';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import SocialGithub from 'grommet/components/icons/base/SocialGithub';
import SocialTwitter from 'grommet/components/icons/base/SocialTwitter';

import { pageLoaded } from './utils';
import Logo from '../components/Logo';

class Login extends Component {
  componentDidMount() {
    pageLoaded('Login');
  }
  render() {
    return (
      <Box full={true} colorIndex='grey-2' align='center' justify='center'
        pad='medium'>
        <Box align='start' justify='center' flex={true} pad='medium'>
          <Box direction='row' justify='center' responsive={false}
            pad={{ between: 'small' }}>
            <Logo size='large' />
            <Heading className='drone-heading' strong={true}>drone</Heading>
          </Box>

          <Box pad={{ vertical: 'medium' }}>
            <Paragraph size='large'>
              Drone is a Continuous Delivery platform built on Docker,
              written in Go.
            </Paragraph>
          </Box>

          <Button label='Sign in with Github' href='/login' primary={true} />
        </Box>
        <Footer justify='end' responsive={false}>
          <span>© 2017 Drone.IO Inc.</span>
          <Anchor href='https://github.com/drone/drone' target='_blank'>
            <SocialGithub />
          </Anchor>
          <Anchor href='https://twitter.com/droneio' target='_blank'>
            <SocialTwitter />
          </Anchor>
        </Footer>
      </Box>
    );
  }
}

export default Login;
