// types/profile.types.ts
export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

export type UpdateProfileDto = {
  fullName: string;
  email: string;
  UserId: number;
};

export type ChangePasswordDto = {
  UserId : number;
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword: string;
};

export type User = {
  id: number;
  fullName: string;
  email: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  activityLog: string;
  idTask_AssigneeId : string;
  idTask_OwnerId : string;
};


