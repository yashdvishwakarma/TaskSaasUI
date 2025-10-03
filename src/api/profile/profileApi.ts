// api/profileApi.ts
import apiService from '../apiService';
import  ApiUrls  from '../../ApiUrl';
import type { UserProfile, ChangePasswordDto } from '../profile/types';
import type { User } from '../User/types';

export const profileApi = {
  getProfile: (userId: number): Promise<UserProfile> =>
    apiService.post<UserProfile>(`${ApiUrls.ProfileUrls.GetProfile}`, { userId }),

  updateProfile: (userId: number, data: User): Promise<UserProfile> =>
    apiService.put<UserProfile>(ApiUrls.ProfileUrls.UpdateProfile, data),

  changePassword: (data: ChangePasswordDto): Promise<void> =>
    apiService.post<void>(ApiUrls.ProfileUrls.ChangePassword, data),
};