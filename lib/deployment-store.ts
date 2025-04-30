import { DeploymentStatus } from './types';

const STORAGE_KEY = 'netlify-deployer-deployments';

// Enhanced store for deployments with localStorage persistence
class DeploymentStore {
  private deployments: DeploymentStatus[] = [];

  constructor() {
    // Load deployments from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          this.deployments = JSON.parse(storedData);
        }
      } catch (error) {
        console.error('Failed to load deployments from storage:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.deployments));
      } catch (error) {
        console.error('Failed to save deployments to storage:', error);
      }
    }
  }

  addDeployment(deployment: DeploymentStatus): DeploymentStatus {
    this.deployments.push(deployment);
    this.saveToStorage();
    return deployment;
  }

  getDeploymentById(id: string): DeploymentStatus | undefined {
    return this.deployments.find(dep => dep.id === id);
  }

  updateDeployment(id: string, updates: Partial<DeploymentStatus>): DeploymentStatus | undefined {
    const index = this.deployments.findIndex(dep => dep.id === id);
    
    if (index === -1) return undefined;
    
    this.deployments[index] = {
      ...this.deployments[index],
      ...updates
    };
    
    this.saveToStorage();
    return this.deployments[index];
  }

  getAllDeployments(): DeploymentStatus[] {
    // Return a copy to prevent direct modification
    return [...this.deployments].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  deleteDeployment(id: string): boolean {
    const initialLength = this.deployments.length;
    this.deployments = this.deployments.filter(dep => dep.id !== id);
    
    if (this.deployments.length !== initialLength) {
      this.saveToStorage();
      return true;
    }
    
    return false;
  }
}

// Create and export a singleton instance
const deploymentStore = new DeploymentStore();
export default deploymentStore;