# Netlify Deployer

A one-click deployment tool for Netlify that lets you deploy templates to your Netlify account with ease.

## Features

- Deploy templates to Netlify with a single click
- Track deployment status in real-time
- View deployment history
- Manage your Netlify Personal Access Token

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Netlify account with a Personal Access Token

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## Deployment

### Deploying to Netlify

This project can be deployed to Netlify in two ways:

#### Method 1: Using the Netlify UI

1. Push your code to a GitHub repository
2. Log in to your Netlify account
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy site"

#### Method 2: Using the Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Build your project:
   ```bash
   npm run build
   ```
3. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Troubleshooting Deployments

If you encounter issues with your deployment:

1. Check the Netlify build logs for errors
2. Make sure your Netlify token has the correct permissions
3. Try triggering a manual build from the deployment status screen
4. Visit the Netlify dashboard to check site settings

## Usage

1. Add your Netlify Personal Access Token when prompted
2. Select a template from the templates page
3. Enter a site name (must be unique and only contain lowercase letters, numbers, and hyphens)
4. Click "Deploy to Netlify"
5. Monitor the deployment status
6. Once deployment is complete, click the link to view your site

## Development

### Project Structure

- `/app` - Next.js app directory with pages
- `/components` - React components
- `/lib` - Utility functions and API clients
- `/public` - Static assets

### Building for Production

```bash
npm run build
```

This will create a static export in the `out` directory that can be deployed to any static hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details. # Netlify-Deployer
