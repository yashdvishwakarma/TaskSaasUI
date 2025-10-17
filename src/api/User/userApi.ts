import apiService from '../apiService';
import  ApiUrls  from '../../ApiUrl';
import type { PaginatedResult } from '../types';
import type { User } from './types';


export const userApi = {

  getUsers : (params?: any) => 
    apiService.post<PaginatedResult<User>>(ApiUrls.UserUrls.GetUserList, params),

  registerUser : (data : any) => 
    apiService.post<any>(ApiUrls.loginUrls.Register, data),

  createUser : (data : any) => 
    apiService.post<any>(ApiUrls.UserUrls.createUer, data)
  
}