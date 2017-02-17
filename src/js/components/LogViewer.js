import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import stripAnsi from 'strip-ansi';

import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';

const CLASS_ROOT = 'drone-log-viewer';

export default class LogViewer extends Component {
  constructor() {
    super();

    this._scrollToBottom = this._scrollToBottom.bind(this);
    this._onDisableAutoScroll = this._onDisableAutoScroll.bind(this);
    this._onEnableAutoScroll = this._onEnableAutoScroll.bind(this);

    this.state = {
      autoScroll: true
    };
  }

  componentDidMount() {
    this._scrollToBottom();
    if (this._logRef) {
      const logBoxNode = findDOMNode(this._logRef);
      logBoxNode.parentNode.addEventListener(
        'scroll', this._onDisableAutoScroll
      );
    }
  }

  componentWillReceiveProps() {
    this._scrollToBottom();
  }

  componentWillUnmount() {
    if (this._logRef) {
      const logBoxNode = findDOMNode(this._logRef);
      logBoxNode.parentNode.removeEventListener(
        'scroll', this._onDisableAutoScroll
      );
    }
    clearTimeout(this._autoScrollTimeout);
  }

  _scrollToBottom() {
    const { autoScroll } = this.state;
    if (autoScroll && this._logRef) {
      const logBoxNode = findDOMNode(this._logRef);
      logBoxNode.parentNode.scrollTop = logBoxNode.scrollHeight;
    }
  }

  _onDisableAutoScroll() {
    const { autoScroll } = this.state;
    if (autoScroll) {
      this.setState({ autoScroll: false });

      this._autoScrollTimeout = setTimeout(this._onEnableAutoScroll, 10000);
    }
  }

  _onEnableAutoScroll() {
    const { autoScroll } = this.state;
    if (!autoScroll) {
      this.setState({ autoScroll: true });
    }
  }

  render() {
    const { log } = this.props;
    const groupKeys = Object.keys(log);

    const codeNodes = [];

    groupKeys.forEach((groupKey, index) => {
      codeNodes.push(
        <Box key={`group-${index}`} pad={{ vertical: 'small' }}>
          <Label uppercase={true} margin='none'>{groupKey}</Label>
        </Box>
      );

      const linesNode = [];
      log[groupKey].forEach((line, lineIndex) => {
        if (line.out && line.out.trim() !== '') {
          if (line.type === 2) {
            linesNode.push(
              <div key={`group-${index}-line-${lineIndex}`}
                className={`${CLASS_ROOT}__line-item`}>
                <span className={`${CLASS_ROOT}__line-number`}>
                  exit code
                </span>
                <span>{stripAnsi(line.out)}</span>
              </div>
            );
          } else {
            linesNode.push(
              <div key={`group-${index}-line-${lineIndex}`}
                className={`${CLASS_ROOT}__line-item`}>
                <span className={`${CLASS_ROOT}__line-number`}>
                  [{line.pos + 1}]
                </span>
                <span>{line.out}</span>
              </div>
            );
          }
        }
      });

      codeNodes.push(
        <div key={`group-${index}-container`} className={CLASS_ROOT}>
          {linesNode}
        </div>
      );
    });

    return (
      <Box ref={ref => this._logRef = ref}
        pad={{ horizontal: 'medium', vertical: 'small' }}>
        {codeNodes}
      </Box>
    );
  }
}

LogViewer.propTypes = {
  log: PropTypes.object.isRequired
};
