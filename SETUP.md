# Installation and Setup Guide

This guide will help you get the Ikira up and running on your local machine.

## Step 1: Install Dependencies

First, install all the required dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

## Step 2: Fix TypeScript Issues

The template is set up to ignore TypeScript build errors during development for easy starting. 

For a production setup, you should:

1. Install the missing type definitions:

```bash
npm install @types/react @types/react-dom @types/node --save-dev
```

2. Remove the `typescript.ignoreBuildErrors` option from `next.config.js` once you're ready for production.

## Step 3: Add Font Dependencies

The template uses Google Fonts. Add them to your project:

```bash
npm install @next/font
```

## Step 4: Run the Development Server

Start the development server:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

Your blog should now be running at [http://localhost:3000](http://localhost:3000).

## Step 5: Build for Production

When you're ready to deploy:

```bash
# Using npm
npm run build

# Using yarn
yarn build
```

## Common Issues and Solutions

### Module Not Found Errors

If you see errors like "Cannot find module 'next/image'", ensure:

1. Next.js is properly installed
2. Your Node.js version is compatible (14.x or higher recommended)
3. You've run `npm install` or `yarn install`

### TypeScript Errors

The template is configured to ignore TypeScript errors during development with:

```javascript
// next.config.js
typescript: {
  ignoreBuildErrors: true,
}
```

For a proper setup, install the required type definitions and remove this setting.

### Image Optimization

To use the Image component, ensure:

1. Placeholder images are added to the `/public/images` directory
2. The `next.config.js` file has proper image domain settings for any external images

## Customization

See the README.md file for more details on customizing the template.