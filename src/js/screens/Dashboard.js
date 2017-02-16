import React, { Component } from 'react';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Layer from 'grommet/components/Layer';
import Responsive from 'grommet/utils/Responsive';

import { pageLoaded } from './utils';

import DroneBot from '../components/DroneBot';
import Logo from '../components/Logo';
import NavSidebar from '../components/NavSidebar';

class Dashboard extends Component {

  constructor() {
    super();

    this._onResponsive = this._onResponsive.bind(this);

    this.state = {
      small: false,
      showNav: false
    };
  }

  componentDidMount() {
    pageLoaded('Dashboard');
    this._responsive = Responsive.start(this._onResponsive);
  }

  componentWillUnmount() {
    this._responsive.stop();
  }

  _onResponsive(small) {
    this.setState({ small });
  }

  render() {
    const { small, showNav } = this.state;
    let headerNode;
    if (small) {
      headerNode = (
        <Header colorIndex='grey-2' align='center' pad='medium'>
          <Anchor a11yTitle='Show navigation bar'
            onClick={() => this.setState({ showNav: true })}>
            <Logo />
          </Anchor>
        </Header>
      );
    }
    let navLayer;
    if (showNav) {
      navLayer = (
        <Layer flush={true} closer={true}
          onClose={() => this.setState({ showNav: false })}>
          <NavSidebar />
        </Layer>
      );
    }
    return (
      <Box full='vertical'>
        {headerNode}
        <DroneBot />
        {navLayer}
      </Box>
    );
  }
}

export default Dashboard;
