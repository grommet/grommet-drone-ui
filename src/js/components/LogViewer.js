import React, { Component, PropTypes } from 'react';
import stripAnsi from 'strip-ansi';

import Box from 'grommet/components/Box';
import Label from 'grommet/components/Label';

const CLASS_ROOT = 'drone-log-viewer';

export default class LogViewer extends Component {

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
      <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
        {codeNodes}
      </Box>
    );
  }
}

LogViewer.propTypes = {
  log: PropTypes.object.isRequired
};
