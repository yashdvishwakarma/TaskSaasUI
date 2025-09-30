// api/taskApi.ts
import apiService from './apiService';
import  ApiUrls  from '../ApiUrl';
import type { PaginatedResult } from './types';

export type TaskItem = {
  id: number;
  title: string;
  description?: string;
  dueDate?: Date;
  status: 0 | 1 | 2; // Todo | InProgress | Done
  ownerId: number;
  assigneeId?: number;
};

export type CreateTaskDto = 
{
  title: string;
  description?: string;
  dueDate?: Date;
  status: 0 | 1 | 2;
  owner: number;
  assigneeId?: number | null;
  assignessid_userid?: number;
}

export type TaskQueryParams = {
  
  page : number ;
  limit : number;
}

export const taskApi = {
  getTasks: (params?: any) => 
    apiService.get<PaginatedResult<TaskItem>>(ApiUrls.TaskUrls.GetTasks, params),

  getTask: (id: any) => 
    apiService.get<TaskItem>(`${ApiUrls.TaskUrls.GetTasks}/${id}`),

  createTask: (task: Partial<TaskItem>) => 
    apiService.post<TaskItem>(ApiUrls.TaskUrls.CreateTask, task),

  updateTask: ( task: Partial<TaskItem>) => 
    apiService.post<TaskItem>(`${ApiUrls.TaskUrls.UpdateTask}`, task),

  deleteTask: (id: number) => 
    apiService.delete<void>(`${ApiUrls.TaskUrls.DeleteTask}/${id}`),
};