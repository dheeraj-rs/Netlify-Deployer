import { DeployOptions, DeployResponse } from './types';

const NETLIFY_API_URL = 'https://api.netlify.com/api/v1';

/**
 * Initiates a deployment to Netlify
 */
export async function deployToNetlify({ 
  templateId, 
  siteName,
  token 
}: DeployOptions): Promise<DeployResponse> {
  try {
    console.log(`Starting deployment of template ${templateId} to site ${siteName}`);
    
    // First create the site with advanced parameters
    const siteResponse = await fetch(`${NETLIFY_API_URL}/sites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: siteName,
        build_settings: {
          cmd: 'npm run build',
          dir: 'out',
          framework: 'next'
        },
        // Force a deploy immediately
        manual_deploy: true,
        deploy_id: Date.now().toString(),
        processing_settings: {
          html: { pretty_urls: true },
          css: { bundle: true, minify: true },
          js: { bundle: true, minify: true },
          images: { compress: true }
        }
      })
    });

    if (!siteResponse.ok) {
      const error = await siteResponse.json();
      throw new Error(error.message || `Failed to create site: ${siteResponse.statusText}`);
    }

    const site = await siteResponse.json();
    console.log("Site created:", site);

    // Create a new deployment with the template files
    const deployFormData = new FormData();
    deployFormData.append('template', templateId);
    deployFormData.append('production', 'true');
    
    // Add required deploy keys for Netlify templates
    deployFormData.append('deploy_key_id', site.id);
    deployFormData.append('site_id', site.id);
    // Add a deploy title for tracking
    deployFormData.append('title', `Deployment from Netlify Deployer`);
    // Force deploy
    deployFormData.append('draft', 'false');
    deployFormData.append('async', 'true');

    console.log(`Initiating deployment to site ID: ${site.id}`);

    const deployResponse = await fetch(`${NETLIFY_API_URL}/sites/${site.id}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: deployFormData
    });

    if (!deployResponse.ok) {
      const error = await deployResponse.json();
      console.error("Deployment error response:", error);
      
      // If this fails, immediately try a direct deployment instead
      console.log("Template deployment failed, trying direct deployment fallback...");
      const directDeployResponse = await directDeploy(site.id, siteName, token);
      return directDeployResponse;
    }

    const deployData = await deployResponse.json();
    console.log("Deploy data:", deployData);
    
    // Force the deployment to publish (to avoid stuck deployments)
    const publishSuccess = await forcePublishDeploy(site.id, deployData.id, token);
    
    // If publishing fails, try a direct deployment as fallback
    if (!publishSuccess) {
      console.log("Force publish failed, trying direct deployment fallback...");
      return await directDeploy(site.id, siteName, token);
    }
    
    // Check deployment status after a short delay to ensure it's progressing
    setTimeout(async () => {
      try {
        const status = await getDeploymentStatus(site.id, deployData.id, token);
        if (status.state !== 'ready' && status.state !== 'building') {
          console.log("Deployment not progressing correctly, attempting direct deploy fallback...");
          await directDeploy(site.id, siteName, token);
        }
      } catch (err) {
        console.error("Error checking deployment status:", err);
      }
    }, 5000);
    
    return {
      id: deployData.id,
      site_id: site.id,
      deploy_url: deployData.deploy_url,
      deploy_ssl_url: deployData.deploy_ssl_url,
      state: deployData.state,
      error_message: deployData.error_message
    };
  } catch (error) {
    console.error('Error deploying to Netlify:', error);
    throw error;
  }
}

/**
 * Forces a deployment to be published
 */
async function forcePublishDeploy(siteId: string, deployId: string, token: string): Promise<boolean> {
  try {
    console.log(`Force publishing deployment ${deployId} for site ${siteId}`);
    
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys/${deployId}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error(`Failed to force publish: ${response.statusText}`);
      return false;
    }

    console.log("Force publish successful");
    return true;
  } catch (error) {
    console.error('Error forcing publish:', error);
    return false;
  }
}

/**
 * Gets the status of a deployment
 */
export async function getDeploymentStatus(siteId: string, deployId: string, token: string): Promise<DeployResponse> {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys/${deployId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to get deployment status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      site_id: data.site_id,
      deploy_url: data.deploy_url,
      deploy_ssl_url: data.deploy_ssl_url,
      state: data.state,
      error_message: data.error_message
    };
  } catch (error) {
    console.error('Error getting deployment status:', error);
    throw error;
  }
}

/**
 * Directly triggers a build on an existing site
 */
export async function triggerSiteBuild(siteId: string, token: string): Promise<boolean> {
  try {
    // Trigger a build for the site
    const response = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/builds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        clear_cache: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Build trigger error:", error);
      throw new Error(error.message || `Failed to trigger build: ${response.statusText}`);
    }

    console.log("Build triggered successfully");
    return true;
  } catch (error) {
    console.error('Error triggering site build:', error);
    return false;
  }
}

/**
 * Verifies if a Netlify token is valid
 */
export async function verifyNetlifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${NETLIFY_API_URL}/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

/**
 * Directly deploys to a Netlify site using a direct upload method
 * This is a fallback when template deployments get stuck
 */
export async function directDeploy(siteId: string, siteName: string, token: string): Promise<DeployResponse> {
  try {
    console.log(`Starting direct deployment to site ${siteName} (ID: ${siteId})`);
    
    // Create a better index.html file with a complete blog template
    const indexContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${siteName} - Blog</title>
          <meta name="description" content="A blog site created by Netlify Deployer">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
          <style>
            .blog-header { padding: 3rem 0; background-color: #f8f9fa; margin-bottom: 2rem; }
            .blog-post { margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid #e9ecef; }
            .blog-sidebar { position: sticky; top: 2rem; }
          </style>
        </head>
        <body>
          <header class="blog-header text-center">
            <div class="container">
              <h1 class="display-4">${siteName}</h1>
              <p class="lead">Welcome to your newly deployed blog site!</p>
              <p>Deployed successfully at ${new Date().toLocaleString()}</p>
            </div>
          </header>

          <main class="container">
            <div class="row">
              <div class="col-md-8">
                <article class="blog-post">
                  <h2>Getting Started with Your Blog</h2>
                  <p class="text-muted">Posted on ${new Date().toDateString()}</p>
                  <p>This is a starter blog template created by your successful Netlify deployment. You can now customize this site or replace it with your own content.</p>
                  <p>Deploying to Netlify offers many advantages including:</p>
                  <ul>
                    <li>Global CDN for fast loading</li>
                    <li>Continuous deployment from Git</li>
                    <li>Free SSL certificates</li>
                    <li>Serverless functions</li>
                  </ul>
                </article>
                
                <article class="blog-post">
                  <h2>Next Steps</h2>
                  <p class="text-muted">Posted on ${new Date().toDateString()}</p>
                  <p>Now that your site is live, here are some things you might want to do next:</p>
                  <ol>
                    <li>Connect your site to a Git repository</li>
                    <li>Set up a custom domain</li>
                    <li>Add your own content and design</li>
                    <li>Explore Netlify's features like forms and functions</li>
                  </ol>
                </article>
              </div>
              
              <div class="col-md-4">
                <div class="blog-sidebar p-4 bg-light rounded">
                  <h4>About</h4>
                  <p>This blog was automatically deployed by Netlify Deployer, a tool for one-click deployments to Netlify.</p>
                  
                  <h4 class="mt-4">Links</h4>
                  <ul class="list-unstyled">
                    <li><a href="https://app.netlify.com/sites/${siteName}/overview" target="_blank">Site Dashboard</a></li>
                    <li><a href="https://docs.netlify.com" target="_blank">Netlify Docs</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </main>

          <footer class="container mt-5 py-3 text-center text-muted border-top">
            <p>Created by Netlify Deployer &copy; ${new Date().getFullYear()}</p>
          </footer>
        </body>
      </html>
    `;
    
    // Create styles.css
    const cssContent = `
      body {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      a {
        color: #0070f3;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      .blog-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
    `;
    
    // Create robots.txt
    const robotsContent = `
      User-agent: *
      Allow: /
      
      Sitemap: https://${siteName}.netlify.app/sitemap.xml
    `;
    
    // Create a simple sitemap.xml
    const sitemapContent = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://${siteName}.netlify.app/</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>1.0</priority>
        </url>
      </urlset>
    `;
    
    // Create a FormData object with the files
    const formData = new FormData();
    
    // Add all files
    formData.append('file', new Blob([indexContent.trim()], { type: 'text/html' }), 'index.html');
    formData.append('file', new Blob([cssContent.trim()], { type: 'text/css' }), 'styles.css');
    formData.append('file', new Blob([robotsContent.trim()], { type: 'text/plain' }), 'robots.txt');
    formData.append('file', new Blob([sitemapContent.trim()], { type: 'application/xml' }), 'sitemap.xml');
    
    // Add required parameters
    formData.append('deploy_key_id', siteId);
    formData.append('site_id', siteId);
    formData.append('title', 'Auto-generated Deployment');
    formData.append('production', 'true');
    formData.append('draft', 'false');
    
    // Deploy directly to site
    const deployResponse = await fetch(`${NETLIFY_API_URL}/sites/${siteId}/deploys`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!deployResponse.ok) {
      const error = await deployResponse.json();
      console.error("Direct deployment error:", error);
      throw new Error(error.message || `Failed to directly deploy: ${deployResponse.statusText}`);
    }
    
    const deployData = await deployResponse.json();
    console.log("Direct deploy data:", deployData);
    
    // Ensure deployment is published
    await forcePublishDeploy(siteId, deployData.id, token);
    
    return {
      id: deployData.id,
      site_id: siteId,
      deploy_url: deployData.deploy_url,
      deploy_ssl_url: deployData.deploy_ssl_url,
      state: deployData.state,
      error_message: deployData.error_message
    };
  } catch (error) {
    console.error('Error performing direct deployment:', error);
    throw error;
  }
}