export interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
}

export interface DeploymentStatus {
  id: string;
  status: 'queued' | 'building' | 'ready' | 'error';
  url?: string;
  createdAt: string;
  siteName: string;
  templateId: string;
  error?: string;
  siteId?: string;
  deployId?: string;
}

export interface NetlifyTokenData {
  token: string;
  createdAt: string;
}

export interface DeployOptions {
  templateId: string;
  siteName: string;
  token: string;
}

export interface DeployResponse {
  id: string;
  site_id: string;
  deploy_url: string;
  deploy_ssl_url: string;
  state: string;
  error_message?: string;
}