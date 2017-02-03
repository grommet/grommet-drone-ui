import React, { Component } from 'react';

import { pageLoaded } from './utils';

import DroneBot from '../components/DroneBot';

class Dashboard extends Component {

  componentDidMount() {
    pageLoaded('Dashboard');
  }

  render() {
    return (
      <DroneBot />
    );
  }
}

export default Dashboard;
