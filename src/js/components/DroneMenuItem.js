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
      active: (router && path) ?
        router.isActive(path, { indexLink: true }) : false
    };
  }

  componentDidMount() {
    const { path } = this.props;
    if (path) {
      const { router } = this.context;
      this._unlisten = router.listen(this._onLocationChange);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { path } = this.props;
    const { router } = this.context;

    if (path !== nextProps.path) {
      this.state = {
        active: router && nextProps.path ?
          router.isActive(nextProps.path, { indexLink: true }) :
          false
      };
    }
  }

  componentWillUnmount() {
    const { path } = this.props;
    if (path) {
      this._unlisten();
    }
    this._unmounted = true;
  }

  _onLocationChange(location) {
    // sometimes react router is still calling the listen callback even
    // if we called unlisten. So we added this check here to prevent
    // calling setState in a unmounted component
    if (!this._unmounted) {
      const { path } = this.props;
      const active = path === '/' ? location.pathname === path :
        location.pathname.startsWith(path);
      this.setState({ active });
    }
  }

  render() {
    const { label, path, status } = this.props;
    const { active } = this.state;

    const classes = classnames(CLASS_ROOT, {
      [`${CLASS_ROOT}--active`]: active,
      [`${CLASS_ROOT}--running`]: status === 'running'
    });

    return (
      <Anchor title={label} className='drone-anchor' path={path}>
        <Box align='center' direction='row' className={classes}
          responsive={false}
          pad={{ vertical: 'medium', horizontal: 'medium', between: 'small' }}>
          <span className={`${CLASS_ROOT}__label`}>{label}</span>
          <DroneStatusCircle status={status} />
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
