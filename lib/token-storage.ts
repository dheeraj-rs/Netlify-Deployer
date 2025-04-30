import { NetlifyTokenData } from './types';

// In a real application, you'd want to use a more secure storage mechanism
// This is a simplified version for demonstration purposes
class TokenStorage {
  private storageKey = 'netlify_token';
  
  saveToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    const tokenData: NetlifyTokenData = {
      token,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKey, JSON.stringify(tokenData));
  }
  
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const tokenDataString = localStorage.getItem(this.storageKey);
    if (!tokenDataString) return null;
    
    try {
      const tokenData: NetlifyTokenData = JSON.parse(tokenDataString);
      return tokenData.token;
    } catch (error) {
      console.error('Error parsing token data:', error);
      return null;
    }
  }
  
  removeToken(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.storageKey);
  }
  
  hasToken(): boolean {
    return this.getToken() !== null;
  }
}

// Create and export a singleton instance
const tokenStorage = new TokenStorage();
export default tokenStorage;