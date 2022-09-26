import React, { useState } from 'react';
import {
  IconButton,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useTranslation } from 'next-i18next';
import { CustomProps } from '../../types/pages';
import { AuthenticationType } from '../../types/user';
import { Login } from '../login/login';
import { useRouter } from 'next/router';
import Axios from 'axios';
import { isUserAllowed } from '../../utils/auth';
import { Main } from './layout.style';

export const Layout = ({
  galleryList,
  user,
  gallery,
  requestAuth = false,
  children,
}: CustomProps & JSX.IntrinsicElements['div']) => {
  const { t } = useTranslation('common');
  const [drawerOpen, setDrawer] = useState(false);
  const [openLogin, setOpenLogin] = useState(requestAuth);
  const router = useRouter();

  const handleDrawerOpen = () => {
    setDrawer(true);
  };

  const handleDrawerClose = () => {
    setDrawer(false);
  };
  const handleLogout = () => {
    Axios.post('/api/logout').then((_x) => router.reload());
  };
  return (
    <>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        onClick={handleDrawerOpen}
        edge='start'
        style={{ display: drawerOpen ? 'none' : 'block', position: 'absolute' }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer variant='persistent' anchor='left' open={drawerOpen}>
        <div>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {!isUserAllowed(user) && (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={t('login')}
                  onClick={() => setOpenLogin(true)}
                />
              </ListItemButton>
            </ListItem>
          )}
          {isUserAllowed(user) && (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={t('logout')} onClick={handleLogout} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        {user?.authType === AuthenticationType.Admin && (
          <>
            <ListItem disablePadding>
              <ListItemButton href='/admin/new'>
                <ListItemText primary={t('new-gallery')} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        )}
        <List>
          {user?.authType === AuthenticationType.Admin &&
            galleryList &&
            galleryList.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton href={`/admin/gallery/${item.id}`}>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Main>
        <Login
          handleClose={() => setOpenLogin(false)}
          requestAuth={requestAuth}
          gallery={gallery?.id}
          isOpen={openLogin}
        />
        {children}
      </Main>
    </>
  );
};
