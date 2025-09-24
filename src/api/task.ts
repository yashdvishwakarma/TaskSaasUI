import http from "./http";
import ApiUrls from "../ApiUrl";

export type TaskItem = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: 0 | 1 | 2; // Todo | InProgress | Done
  ownerId: number;
  assigneeId?: number;
};

export const getTasks = () =>
{
  const response = http.get<TaskItem[]>(ApiUrls.TaskUrls.GetTasks);
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
}) => http.post<TaskItem>(ApiUrls.TaskUrls.CreateTask, payload); 

export const updateTask = (payload: {
  TaskId : number;
  Title: string;
  Description?: string;
  DueDate?: string;
  status: number;
  owner: number;
}) => http.post<TaskItem>(ApiUrls.TaskUrls.UpdateTask, payload); 

export const GetProfile = (payload: {
  UserId : number; 
}) => http.post<TaskItem>(ApiUrls.UserUrls.GetProfile, payload); 