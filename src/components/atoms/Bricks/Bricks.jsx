/* eslint-disable react/prop-types */
import { Box } from '@mui/material';

const MobileBrick = ({ children }) => {
  const mobileBP = {
    display: { xs: 'block', sm: 'block', md: 'none', lg: 'none' },
  };

  return <Box sx={mobileBP}>{children}</Box>;
};

const WebBrick = ({ children }) => {
  const mobileBP = {
    display: { xs: 'none', sm: 'none', md: 'block', lg: 'block' },
  };

  return <Box sx={mobileBP}>{children}</Box>;
};

export { MobileBrick, WebBrick };
