export enum AuthenticationType {
  Admin,
  General,
  Gallery,
  None,
}

export type User = {
  authType: AuthenticationType;
  gallery?: string;
};
