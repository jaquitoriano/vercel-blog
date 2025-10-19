# Next.js Blog Template# Vercel Blog CMS



A modern, responsive blog template built with Next.js, React, TypeScript, and Tailwind CSS.A simple blog CMS built with Next.js and deployable on Vercel. This project includes a custom CMS for blog posts with Markdown support.



## Features## Features



- Modern, clean design- 📝 Blog post creation and editing with Markdown support

- Dark mode support with Next.js Themes- 🔒 Admin authentication

- Fully responsive- 📱 Responsive design

- TypeScript for type safety- 🚀 Ready for deployment on Vercel

- Tailwind CSS for styling- 🔄 SSR and SSG for optimal performance

- Authentication ready

- SEO optimized## Getting Started



## Getting Started### Prerequisites



### Prerequisites- Node.js 18+ and npm



- Node.js 16.8.0 or later### Local Development

- npm or yarn

1. Clone the repository:

### Installation

```bash

1. Clone the repository or download the source code:git clone <repository-url>

cd vercel-blog

```bash```

git clone https://github.com/yourusername/vercel-blog.git

cd vercel-blog2. Install dependencies:

```

```bash

2. Install dependencies:npm install

```

```bash

npm install3. Run the development server:

# or

yarn install```bash

```npm run dev

```

3. Run the development server:

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```bash

npm run dev### Admin Access

# or

yarn devYou can access the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin)

```

Default admin credentials:

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.- Email: admin@example.com

- Password: adminpassword123

## Project Structure

## Project Structure

```

vercel-blog/- `src/app/` - Application pages using Next.js App Router

├── public/            # Static assets- `src/components/` - React components

├── src/- `src/lib/` - Utility functions

│   ├── app/           # App router pages- `content/posts/` - Markdown files for blog posts

│   │   ├── about/     # About page

│   │   ├── posts/     # Posts pages## Built With

│   │   ├── globals.css # Global styles

│   │   └── layout.tsx # Root layout- [Next.js](https://nextjs.org/) - React framework

│   ├── components/    # Reusable components- [TailwindCSS](https://tailwindcss.com/) - CSS framework

│   └── lib/           # Utilities and helpers- [NextAuth.js](https://next-auth.js.org/) - Authentication

├── package.json       # Project dependencies- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

├── tailwind.config.js # Tailwind configuration

└── tsconfig.json      # TypeScript configuration## Deployment

```

You can deploy this project to Vercel with a few clicks:

## Customization

1. Push your code to a GitHub repository

### Theme2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your repository

You can customize the theme by modifying `tailwind.config.js` and `src/app/globals.css`.4. Deploy!



### Adding Pages## Customization



1. Create a new directory in `src/app/` with the name of your page### Blog Settings

2. Create a `page.tsx` file inside that directory

3. Export a default React component from that fileYou can customize the blog settings in `src/app/layout.tsx` to change the title, description, and other metadata.



### Adding Components### Authentication



Create new components in the `src/components/` directory and import them in your pages.This project uses a simple in-memory authentication system. In a production environment, you should connect it to a database or authentication provider.



## License### Styling



This project is licensed under the MIT License - see the LICENSE file for details.The project uses TailwindCSS for styling. You can customize the theme in `tailwind.config.js`.



## Acknowledgments## License



- [Next.js](https://nextjs.org/)This project is open source and available under the [MIT License](LICENSE).

- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [TypeScript](https://www.typescriptlang.org/)