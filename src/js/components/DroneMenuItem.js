import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Anchor from 'grommet/components/Anchor';
import Box from 'grommet/components/Box';

import DroneStatusCircle from './DroneStatusCircle';

const CLASS_ROOT = 'drone-menu-item';

class DroneMenuItem extends Component {
  constructor(props, context) {
    super(props, context);

    this._onLocationChange = this._onLocationChange.bind(this);

    const { path } = props;
    const { router } = context;

    this.state = {
      active: router && path && router.isActive(path, {
        indexLink: true
      })
    };
  }

  componentDidMount() {
    const { path } = this.props;
    if (path) {
      const { router } = this.context;
      this._unlisten = router.listen(this._onLocationChange);
    }
  }

  componentWillUnmount() {
    const { path } = this.props;
    if (path) {
      this._unlisten();
    }
  }

  _onLocationChange(location) {
    const { path } = this.props;
    const active = location.pathname === path;
    this.setState({ active });
  }

  render() {
    const { label, path, status } = this.props;
    const { active } = this.state;

    const classes = classnames(CLASS_ROOT, {
      [`${CLASS_ROOT}--active`]: active
    });

    return (
      <Anchor title={label} className='drone-anchor' path={path}>
        <Box align='center' direction='row' className={classes}
          pad={{ vertical: 'medium', horizontal: 'medium', between: 'small' }}>
          <span className={`${CLASS_ROOT}__label`}>{label}</span>
          <DroneStatusCircle active={active} status={status} />
        </Box>
      </Anchor>
    );
  }
}

DroneMenuItem.contextTypes = {
  router: React.PropTypes.object
};

DroneMenuItem.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  status: PropTypes.string
};

export default DroneMenuItem;
