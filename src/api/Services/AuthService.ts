// services/AuthService.ts
class AuthService {
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async logout(): Promise<void> {
    try {
      console.log('Logout initiated'); // Debug log
      
      // 1. Call logout API FIRST (before clearing token)
      await this.callLogoutAPI();
      
      // 2. Store redirect path BEFORE clearing localStorage
      this.storeRedirectPath();
      
      // 3. Clear all authentication data
      this.clearAuthData();
      
      // 4. Redirect to login
      this.redirectToLogin();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear data and redirect even if API call fails
      this.clearAuthData();
      this.redirectToLogin();
    }
  }

  private storeRedirectPath(): void {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/') {
      try {
        localStorage.setItem('redirectAfterLogin', currentPath);
      } catch (error) {
        console.warn('Could not store redirect path:', error);
      }
    }
  }

  private clearAuthData(): void {
    console.log('Clearing auth data'); // Debug log
    
    // Clear localStorage
    const itemsToRemove = ['token', 'refreshToken', 'user', 'permissions'];
    itemsToRemove.forEach(item => {
      try {
        localStorage.removeItem(item);
      } catch (error) {
        console.warn(`Could not remove ${item}:`, error);
      }
    });
    
    // Clear sessionStorage
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Could not clear sessionStorage:', error);
    }
    
    // Clear cookies
    this.clearAuthCookies();
  }

  private clearAuthCookies(): void {
    const cookies = ['token', 'refreshToken', 'sessionId'];
    cookies.forEach(cookie => {
      try {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      } catch (error) {
        console.warn(`Could not clear cookie ${cookie}:`, error);
      }
    });
  }

  private async callLogoutAPI(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('Calling logout API'); // Debug log
      
      // Use your configured http client instead of fetch
      const response = await fetch(`${import.meta.env.VITE_API_URL || "https://localhost:7048/api"}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Logout API failed: ${response.status}`);
      }
      
      console.log('Logout API successful');
    } catch (error) {
      console.error('API logout error:', error);
      // Don't throw error - we still want to clear data and redirect
    }
  }

  private redirectToLogin(): void {
    console.log('Redirecting to login'); // Debug log
    
    // Use replace to prevent back button issues
    window.location.replace('/login');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token && token.trim() !== '';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export default AuthService;