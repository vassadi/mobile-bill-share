/* eslint-disable react/prop-types */
import { useContext } from 'react';
import FlexDiv from '../../atoms/FlexDiv';
import { UserContext } from '../../../context/userContext';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import StyledDiv from '../../atoms/StyledDiv/StyledDiv';

const NoBills = ({ callbackAction }) => {
  const { isAdmin, name } = useContext(UserContext);
  const { t } = useTranslation();

  const message = isAdmin ? t('noBillsAdminMsg') : t('noBillsMsg');

  return (
    <>
      <StyledDiv>
        <h2>Hi {name}, </h2>
        <h3>{t('newUserWelcomeMessage')}</h3>
      </StyledDiv>
      {/* 
      <StyledDiv>
        <Typography
          variant="h4"
          sx={{ mb: 2, p: 2, textAlign: 'center' }}
          component="div"
        >
          {t('noBillsTitle')}
        </Typography>
        <Typography sx={{ mb: 2, fontSize: 16 }} color="text.secondary">
          {message}
        </Typography>
        <div>
          {isAdmin && (
            <Button size="small" onClick={callbackAction}>
              Add bill
            </Button>
          )}
        </div>
      </StyledDiv> */}
      <FlexDiv justify={'center'} margin={'2rem'}>
        <Card sx={{ minWidth: 275, borderRadius: 2.5 }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{ mb: 2, p: 2, textAlign: 'center' }}
              component="div"
            >
              {t('noBillsTitle')}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color="text.secondary">
              {message}
            </Typography>
          </CardContent>
          <CardActions sx={{ p: 2 }}>
            {isAdmin && (
              <Button size="small" onClick={callbackAction}>
                Add bill
              </Button>
            )}
          </CardActions>
        </Card>
      </FlexDiv>
    </>
  );
};

export default NoBills;
