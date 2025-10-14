import http from "./http";
import ApiUrls from "../ApiUrl";

export type TaskItem = {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 0 | 1 | 2; // Todo | InProgress | Done
  ownerId: number;
  assigneeId?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const getTasks = () =>
{
    const response = http.get(ApiUrls.TaskUrls.GetTasks);
  return response;
}
export const createTask = (payload: {
  title: string;
  description?: string;
  dueDate?: string;
  status: 0 | 1 | 2;
  owner: number;
  Role : "User" | "Admin";
}) => http.post<TaskItem>(ApiUrls.TaskUrls.CreateTask, payload); 

export const deleteTask = (payload: {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: 0 | 1 | 2;
  owner: number;
    Role : "User" | "Admin";
}) => http.post<TaskItem>(ApiUrls.TaskUrls.DeleteTask, payload); 


//moved to common component taskApis
// export const updateTask = (payload: {
//   task
// }) => http.post<TaskItem>(ApiUrls.TaskUrls.UpdateTask, payload); 

export const GetProfile = (payload: {
  UserId : number; 
}) => http.post<TaskItem>(ApiUrls.UserUrls.GetProfile, payload); 