import apiService from '../apiService';
import  ApiUrls  from '../../ApiUrl';
import type { PaginatedResult } from '../types';
import type { User } from './types';


export const userApi = {

  getUsers : (params?: any) => 
    apiService.get<PaginatedResult<User>>(ApiUrls.TaskUrls.GetTasks, params),

  registerUser : (data : any) => 
    apiService.post<any>(ApiUrls.loginUrls.Register, data)
}