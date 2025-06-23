import type { Guild } from './types';

export const PERMISSIONS = {
  ADMINISTRATOR: 0x0000000000000008,
};

export const hasPermission = (permissionMap: number, permissionKey: keyof typeof PERMISSIONS) =>
  (permissionMap & PERMISSIONS[permissionKey]) === PERMISSIONS[permissionKey];

export const isGuildAdmin = (guild: Guild) => guild.admin // hasPermission(guild.permissions, 'ADMINISTRATOR');

export const isGuildModerator = (guild: Guild) => {
  for (const role of guild.userRoles)
    if (guild.roles.find((r) => r.id === role)?.moderator) return true;
  return false;
};
