import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import Axios from 'axios';
import { useTranslation } from 'next-i18next';
import { User, AuthenticationType } from '../../types/user';
import { useRouter } from 'next/router';
type LoginProps = {
  isOpen: boolean;
  handleClose: () => void;
  gallery?: string;
  requestAuth?: boolean;
};

export const Login = ({
  isOpen,
  handleClose,
  requestAuth,
  gallery = '',
}: LoginProps) => {
  const { t } = useTranslation('common');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPassword(evt.target.value);
  };
  const handleLogin = () => {
    Axios.post<User>('/api/login', { gallery, password })
      .then((data) => {
        const user = data.data;
        if (user.authType !== AuthenticationType.None) {
          router.reload();
        } else {
          setError(t('user-not-auth'));
        }
      })
      .catch((e) => setError(e.message));
  };
  const handleLocalClose = () => {
    if (!requestAuth) {
      handleClose();
    }
  };
  return (
    <Dialog onClose={handleLocalClose} open={isOpen}>
      <DialogTitle>{t('authenticate')}</DialogTitle>
      <DialogContent>
        <p>{t('dont-share')}</p>
        <TextField
          id='password'
          label={t('gallery-password')}
          variant='outlined'
          type='password'
          value={password}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogin}>{t('login')}</Button>
      </DialogActions>
    </Dialog>
  );
};
