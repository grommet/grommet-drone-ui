import React from 'react';

import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

export default () => (
  <Box responsive={false} direction='row'
    pad={{ between: 'small', vertical: 'medium', horizontal: 'medium' }}>
    <Spinning />
    <span>Loading...</span>
  </Box>
);
