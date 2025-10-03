export type User = {
  id: number;
  fullName: string;
  email: string;
  role: number | null;
  createdAt: string;
  updatedAt: string;
  activityLog: string;
  password: string;
  idTask_AssigneeId : string;
  idTask_OwnerId : string;
  organizationId : number;
  isActive : boolean | true;
};

export type UpdateProfileDto = {
  fullName: string;
  email: string;
  UserId: number;
};

export type CreateProfileDto = {
  fullName: string;
  email: string;
  UserId: number;
  password: string;
  Role : string;
};
