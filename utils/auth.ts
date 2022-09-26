import { AuthenticationType, User } from '../types/user';

export const isUserAllowed = (user?: User, gallery?: string) => {
  return (
    user &&
    (user.authType === AuthenticationType.Admin ||
      user.authType === AuthenticationType.General ||
      (user.authType === AuthenticationType.Gallery &&
        user.gallery === gallery))
  );
};

export const isUserAdmin = (user?: User) => {
  return user && user.authType === AuthenticationType.Admin;
};
