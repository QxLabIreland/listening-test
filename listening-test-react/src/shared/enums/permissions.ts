export enum AppPermissions {
  User = 'User',
  Veido = 'Video',
  Storage = 'Storage',
  Template = 'Template',
  Testing = 'Testing',
}

export const FULL_PERMISSIONS = Object.values(AppPermissions).filter((v) => typeof v === 'string');
