export type Role = {
  icon: string | null;
  unicodeEmoji: string | null;
  id: string;
  name: string;
  color: string;
  moderator: boolean;
};
export type Guild = {
  permissions: number;
  name: string;
  id: string;
  iconURL: string;
  roles: Role[];
  userRoles: string[];
  admin: boolean;
};
export type User = {
  admin: boolean;
};

export type CommandData = {
  card: {
    color: string;
    color2: string;
    title: string;
    type: string;
  };
};
