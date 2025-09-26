// api/profileApi.ts
import apiService from '../apiService';
import  ApiUrls  from '../../ApiUrl';
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '../profile/types';

export const profileApi = {
  getProfile: (userId: number): Promise<UserProfile> =>
    apiService.post<UserProfile>(`${ApiUrls.ProfileUrls.GetProfile}`, { userId }),

  updateProfile: (userId: number, data: UpdateProfileDto): Promise<UserProfile> =>
    apiService.put<UserProfile>(`${ApiUrls.ProfileUrls.UpdateProfile}/${userId}`, data),

  changePassword: (data: ChangePasswordDto): Promise<void> =>
    apiService.post<void>(ApiUrls.ProfileUrls.ChangePassword, data),
};