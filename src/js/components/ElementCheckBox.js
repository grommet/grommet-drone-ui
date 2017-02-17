import React, { Component, PropTypes } from 'react';

import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';
import Spinning from 'grommet/components/icons/Spinning';

export default class RepoCheckBox extends Component {
  constructor(props, context) {
    super(props, context);

    this._onChange = this._onChange.bind(this);

    this.state = {
      changed: false
    };
  }

  componentWillReceiveProps() {
    this.setState({
      changed: false
    });
  }

  _onChange() {
    const { onChange, element } = this.props;
    onChange(element);
    this.setState({ changed: true });
  }

  render() {
    const { async, checked, label } = this.props;
    const { changed } = this.state;

    if (async && changed) {
      return <Box pad={{ horizontal: 'medium' }}><Spinning /></Box>;
    }
    return (
      <CheckBox toggle={true} defaultChecked={checked} label={label}
        onChange={this._onChange} />
    );
  }
}

RepoCheckBox.propTypes = {
  async: PropTypes.bool,
  checked: PropTypes.bool,
  element: PropTypes.object.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired
};
