# Vercel Blog

A modern Ikira built with Next.js 14, Tailwind CSS, and deployed on Vercel.

## Deployment Instructions

### Automatic Deployment

1. **Connect to GitHub**
   - Push your repository to GitHub
   - Log in to [Vercel](https://vercel.com)
   - Click "Add New" > "Project"
   - Select your repository
   - Follow the on-screen instructions

2. **Configure Project Settings**
   - Framework Preset: Next.js
   - Environment Variables: Add any needed environment variables from `.env.production`
   - Build and Output Settings: These are already configured in `vercel.json`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your project

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # From the project root
   npm run deploy
   ```

## Configuration Files

- **vercel.json**: Contains Vercel-specific configuration
- **.vercelignore**: Lists files and directories to exclude from deployment
- **next.config.js**: Includes optimizations for Vercel deployment
- **.env.production**: Contains production environment variables

## Performance Monitoring

This project uses Vercel Analytics to monitor performance. You can view metrics in the Vercel dashboard.

## Custom Domain Setup

1. Go to your project on the Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain and follow the DNS configuration instructions

## Troubleshooting

If you encounter deployment issues:

1. Check build logs in the Vercel dashboard
2. Verify that all environment variables are correctly set
3. Make sure your Next.js configuration is compatible with Vercel
4. Check that client components properly handle both server-side and client-side rendering

For more assistance, refer to the [Vercel Documentation](https://vercel.com/docs).