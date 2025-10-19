import { Post } from '@/types';

export const posts: Post[] = [
  {
    id: "post-1",
    title: "Getting Started with Next.js and TypeScript",
    slug: "getting-started-with-nextjs-and-typescript",
    excerpt: "Learn how to build a type-safe Next.js application from scratch using TypeScript and best practices for structuring your project.",
    content: `
# Getting Started with Next.js and TypeScript

Next.js has become the go-to React framework for building production-ready applications. When combined with TypeScript, it provides an excellent developer experience with type safety, improved autocompletion, and better error detection.

## Setting Up Your Project

To create a new Next.js project with TypeScript support, run the following command:

\`\`\`bash
npx create-next-app@latest my-app --typescript
\`\`\`

This will scaffold a new project with TypeScript configuration already set up. Navigate into the project directory and start the development server:

\`\`\`bash
cd my-app
npm run dev
\`\`\`

## Project Structure

A typical Next.js project with TypeScript might have the following structure:

\`\`\`
my-app/
├── components/     # Reusable UI components
├── pages/          # Route components
├── public/         # Static assets
├── styles/         # Global styles
├── types/          # TypeScript type definitions
├── utils/          # Helper functions
├── next.config.js  # Next.js configuration
└── tsconfig.json   # TypeScript configuration
\`\`\`

## Creating Type-Safe Components

Here's an example of a type-safe React component in Next.js:

\`\`\`tsx
// components/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
}) => {
  return (
    <button
      onClick={onClick}
      className={\`btn \${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}\`}
    >
      {text}
    </button>
  );
};
\`\`\`

## Type-Safe API Routes

Next.js API routes also benefit from TypeScript. Here's an example:

\`\`\`tsx
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' });
}
\`\`\`

## Conclusion

TypeScript is a powerful addition to Next.js projects, helping catch errors early and improve code quality. As your application grows, the benefits of TypeScript become even more apparent, making maintenance and collaboration easier.
    `,
    coverImage: "/images/posts/nextjs-typescript.jpg",
    date: "2025-10-15",
    featured: true,
    views: 1240,
    authorId: "author-1",
    categoryId: "category-1",
    tags: ["tag-2", "tag-3"],
  },
  {
    id: "post-2",
    title: "Building Accessible UI Components with React",
    slug: "building-accessible-ui-components-with-react",
    excerpt: "Discover how to create accessible UI components in React that work for everyone, including keyboard navigation, screen readers, and other assistive technologies.",
    content: `
# Building Accessible UI Components with React

Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. Creating accessible components in React requires attention to semantic HTML, ARIA attributes, and keyboard navigation.

## Why Accessibility Matters

- **Inclusivity**: Ensures your application can be used by people with various disabilities
- **Legal compliance**: Many countries have laws requiring digital accessibility
- **SEO benefits**: Many accessibility practices also improve search engine optimization
- **Better user experience**: Accessible designs often benefit all users

## Semantic HTML

Always start with semantic HTML elements that clearly communicate the purpose:

\`\`\`jsx
// Bad example
<div onClick={handleClick}>Click me</div>

// Good example
<button onClick={handleClick}>Click me</button>
\`\`\`

## ARIA Attributes

When HTML semantics aren't enough, use ARIA (Accessible Rich Internet Applications) attributes:

\`\`\`jsx
function Accordion({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="accordion">
      <button
        aria-expanded={isExpanded}
        aria-controls="accordion-content"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
      </button>
      <div 
        id="accordion-content" 
        hidden={!isExpanded}
      >
        {children}
      </div>
    </div>
  );
}
\`\`\`

## Keyboard Navigation

Ensure all interactive elements are keyboard accessible:

\`\`\`jsx
function Card({ title, description, onAction }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onAction();
      event.preventDefault();
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onAction}
      onKeyDown={handleKeyDown}
      className="card"
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
\`\`\`

## Focus Management

Manage focus correctly, especially in modals and dynamic content:

\`\`\`jsx
function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current.focus();
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="modal-overlay" aria-modal="true" role="dialog">
      <div 
        className="modal" 
        ref={modalRef}
        tabIndex={-1}
      >
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
}
\`\`\`

## Testing Accessibility

Always test your components for accessibility using:

1. Keyboard navigation only (no mouse)
2. Screen reader software (like NVDA, VoiceOver)
3. Automated tools like:
   - React's ESLint plugin with jsx-a11y
   - Lighthouse in Chrome DevTools
   - axe-core for automated testing

By focusing on accessibility from the start, you'll create components that work for everyone while also improving overall quality and user experience.
    `,
    coverImage: "/images/posts/accessible-ui.jpg",
    date: "2025-10-10",
    views: 956,
    authorId: "author-2",
    categoryId: "category-2",
    tags: ["tag-1", "tag-10"],
  },
  {
    id: "post-3",
    title: "Optimizing React Performance with Memo, Callback and useMemo",
    slug: "optimizing-react-performance-with-memo-callback-and-usememo",
    excerpt: "Learn advanced React optimization techniques to prevent unnecessary re-renders and improve your application's performance.",
    content: `
# Optimizing React Performance with Memo, Callback and useMemo

React applications can suffer from performance issues as they grow in complexity. Understanding when and how to use React's memoization tools can significantly improve your application's speed and responsiveness.

## Understanding Re-renders

React components re-render when:
1. Their state changes
2. Their props change
3. Their parent component re-renders

Unnecessary re-renders can cause performance bottlenecks, especially in large applications.

## React.memo for Component Memoization

\`React.memo\` is a higher-order component that prevents a component from re-rendering if its props haven't changed:

\`\`\`jsx
import React from 'react';

const ExpensiveComponent = ({ data }) => {
  console.log('Rendering ExpensiveComponent');
  
  // Imagine this component does something CPU-intensive
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

// Only re-render if props have changed
export default React.memo(ExpensiveComponent);
\`\`\`

## useCallback for Stable Function References

\`useCallback\` memoizes function definitions to maintain stable references:

\`\`\`jsx
import React, { useState, useCallback } from 'react';
import ExpensiveComponent from './ExpensiveComponent';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState([/* some data */]);
  
  // Without useCallback, this function would be recreated on every render
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
    // Do something with the itemId
  }, []); // Empty deps array means this function never changes
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      
      {/* This won't re-render when count changes */}
      <ExpensiveComponent 
        data={data} 
        onItemClick={handleItemClick}
      />
    </div>
  );
}
\`\`\`

## useMemo for Expensive Computations

\`useMemo\` caches the results of expensive computations:

\`\`\`jsx
import React, { useState, useMemo } from 'react';

function DataProcessingComponent({ rawData }) {
  const [filter, setFilter] = useState('');
  
  // This expensive calculation will only run when rawData or filter changes
  const processedData = useMemo(() => {
    console.log('Processing data...');
    
    // Imagine this is an expensive operation
    return rawData
      .filter(item => item.name.includes(filter))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(item => ({
        ...item,
        processedValue: complexCalculation(item)
      }));
  }, [rawData, filter]);
  
  return (
    <div>
      <input 
        type="text" 
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Filter items..."
      />
      <ul>
        {processedData.map(item => (
          <li key={item.id}>{item.name}: {item.processedValue}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

## Measuring Performance

Always measure performance before and after optimization using:

1. React DevTools Profiler
2. Performance panel in Chrome DevTools
3. User-centric metrics (like FCP, LCP, TTI)

## When Not to Optimize

Premature optimization can lead to more complex code. Don't use these techniques unless:

1. You've identified a genuine performance problem
2. You've measured and confirmed the issue
3. The complexity trade-off is worth it

Remember that React is already quite fast for most use cases. Optimize only when necessary.
    `,
    coverImage: "/images/posts/react-performance.jpg",
    date: "2025-10-05",
    views: 1873,
    authorId: "author-1",
    categoryId: "category-1",
    tags: ["tag-1", "tag-9"],
  },
  {
    id: "post-4",
    title: "Creating a Design System with Tailwind CSS",
    slug: "creating-a-design-system-with-tailwind-css",
    excerpt: "Learn how to build a consistent design system for your application using Tailwind CSS's customization features.",
    content: `
# Creating a Design System with Tailwind CSS

A design system provides a unified language for your application's UI components, ensuring consistency and speeding up development. Tailwind CSS offers powerful customization features that make it ideal for implementing a design system.

## What Makes a Good Design System?

An effective design system includes:

- **Design tokens**: Variables for colors, typography, spacing, etc.
- **Components**: Reusable UI patterns
- **Documentation**: Usage guidelines and examples
- **Consistency**: Visual and functional coherence
- **Flexibility**: Adaptability to various contexts

## Setting Up Tailwind CSS

Start by installing Tailwind CSS and creating a configuration file:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Customizing Design Tokens

The \`tailwind.config.js\` file is where you'll define your design tokens:

\`\`\`js
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Primary palette
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      // Secondary and other colors
      // ...
    },
    fontFamily: {
      sans: ['Inter var', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    spacing: {
      px: '1px',
      0: '0',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      // ...and so on
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    // Add other design tokens here
    extend: {},
  },
  plugins: [],
}
\`\`\`

## Creating Component Abstractions

Use Tailwind's \`@apply\` directive to create reusable component styles:

\`\`\`css
/* components.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500;
  }
  
  .card {
    @apply bg-white rounded-lg shadow overflow-hidden;
  }
  
  /* Add more component styles */
}
\`\`\`

## Component Creation

Create React components that use your design system:

\`\`\`jsx
// components/Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) {
  const sizeClasses = {
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  return (
    <button 
      className={\`btn btn-\${variant} \${sizeClasses[size]}\`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
\`\`\`

## Documentation with Storybook

Document your components with Storybook:

\`\`\`bash
npx sb init
\`\`\`

Create stories for your components:

\`\`\`jsx
// Button.stories.jsx
import React from 'react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'outline'] },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
  },
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Small Button',
};
\`\`\`

## Theme Variants with Tailwind

For dark mode and other theme variants:

\`\`\`js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...other config
}
\`\`\`

Use dark mode variants in your components:

\`\`\`jsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  This adapts to light/dark mode
</div>
\`\`\`

## Maintaining Your Design System

1. Create a single source of truth for design tokens
2. Use version control and semantic versioning
3. Regularly audit usage and consistency
4. Get feedback from designers and developers
5. Evolve the system iteratively

A well-implemented design system with Tailwind CSS will streamline your development process, ensure consistency, and provide a solid foundation for your application's UI.
    `,
    coverImage: "/images/posts/tailwind-design-system.jpg",
    date: "2025-09-28",
    views: 1256,
    authorId: "author-3",
    categoryId: "category-2",
    tags: ["tag-6", "tag-5"],
  },
  {
    id: "post-5",
    title: "Building a REST API with Node.js and Express",
    slug: "building-a-rest-api-with-nodejs-and-express",
    excerpt: "A comprehensive guide to creating a RESTful API using Node.js, Express, and best practices for authentication, validation, and error handling.",
    content: `
# Building a REST API with Node.js and Express

REST (Representational State Transfer) APIs provide a standard way for systems to communicate over HTTP. In this guide, we'll build a robust REST API using Node.js and Express with best practices for structure, authentication, and error handling.

## Project Setup

First, let's create our project structure:

\`\`\`bash
mkdir api-project
cd api-project
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet express-validator
npm install --save-dev nodemon
\`\`\`

Create a basic directory structure:

\`\`\`
api-project/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   ├── config/         # Configuration files
│   └── app.js          # Express application
├── .env                # Environment variables
├── package.json
└── server.js           # Entry point
\`\`\`

## Basic Express Setup

Let's set up our Express application:

\`\`\`javascript
// src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
\`\`\`

\`\`\`javascript
// server.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(\`Server running on port \${PORT}\`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
\`\`\`

## Creating Models

Let's create a user model:

\`\`\`javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
\`\`\`

## Authentication Middleware

Create JWT-based authentication:

\`\`\`javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
};
\`\`\`

## Creating Controllers

Let's implement authentication controllers:

\`\`\`javascript
// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Register a new user
exports.register = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });
    
    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user data with token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
\`\`\`

## Setting Up Routes

Create routes for authentication:

\`\`\`javascript
// src/routes/userRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  register
);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
\`\`\`

## Error Handling

Create a centralized error handler:

\`\`\`javascript
// src/middleware/errorHandler.js
exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
\`\`\`

## Request Validation

Use express-validator for input validation:

\`\`\`javascript
// Example route with validation
router.post(
  '/posts',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
  ],
  protect,
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Continue with post creation...
  }
);
\`\`\`

## Testing Your API

Use tools like Postman or curl to test your endpoints:

\`\`\`bash
# Register a user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'
\`\`\`

## Conclusion

We've built a solid foundation for a REST API with Node.js and Express, including:

- Project structure and setup
- User authentication with JWT
- Middleware for route protection
- Input validation
- Error handling

From here, you can expand with features like pagination, filtering, rate limiting, and more advanced access control.
    `,
    coverImage: "/images/posts/nodejs-express-api.jpg",
    date: "2025-09-20",
    views: 2108,
    authorId: "author-1",
    categoryId: "category-1",
    tags: ["tag-7", "tag-8"],
  },
  {
    id: "post-6",
    title: "Mastering Git Workflow for Team Collaboration",
    slug: "mastering-git-workflow-for-team-collaboration",
    excerpt: "Learn effective Git branching strategies and workflows that will help your team collaborate more efficiently on software projects.",
    content: `
# Mastering Git Workflow for Team Collaboration

Git is essential for modern software development teams, but without a clear workflow, it can lead to confusion and merge conflicts. This guide will help you establish an effective Git workflow for your team.

## Common Git Workflows

### Gitflow Workflow

The Gitflow workflow uses two main branches with an infinite lifetime:

- **main/master**: Always contains production-ready code
- **develop**: Integration branch for features

And three supporting branch types:

- **feature/\***: For new features, branched from and merged back to develop
- **release/\***: Preparation for production releases
- **hotfix/\***: For urgent fixes to production

#### Implementation Example

\`\`\`bash
# Starting a feature
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# After feature development is complete
git add .
git commit -m "Implement user authentication"
git push origin feature/user-authentication

# Create a pull request to develop branch
# After PR is approved and merged...

# Preparing a release
git checkout develop
git pull origin develop
git checkout -b release/1.0.0

# Make any release-specific changes
git add .
git commit -m "Bump version to 1.0.0"

# Merge to main AND develop
git checkout main
git merge release/1.0.0 --no-ff
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin main --tags

git checkout develop
git merge release/1.0.0 --no-ff
git push origin develop

# Delete the release branch
git branch -d release/1.0.0
\`\`\`

### GitHub Flow

A simpler alternative with one main branch:

1. Create a branch from main
2. Add commits
3. Open a pull request
4. Discuss and review
5. Merge to main and deploy

#### Implementation Example

\`\`\`bash
# Starting work on a feature or fix
git checkout main
git pull origin main
git checkout -b add-login-form

# After making changes
git add .
git commit -m "Add login form"
git push origin add-login-form

# Create a pull request to main
# After PR is approved and tests pass, merge and deploy
\`\`\`

### Trunk-Based Development

An even simpler approach focusing on small, frequent changes to the main branch:

1. Work on small changes
2. Use feature flags for incomplete features
3. Merge to main frequently (at least once a day)
4. Deploy continuously

#### Implementation Example

\`\`\`bash
# Starting work
git checkout main
git pull origin main
git checkout -b quick-fix

# Make small changes, then
git add .
git commit -m "Fix navigation bug"
git pull origin main # Rebase or merge
git push origin quick-fix

# Create a PR and merge quickly
\`\`\`

## Best Practices for Any Workflow

### Commit Messages

Follow a consistent commit message format:

\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

Example:

\`\`\`
feat(auth): implement OAuth2 login

Add Google and GitHub OAuth2 providers for user authentication.
This allows users to sign in without creating a new account.

Closes #123
\`\`\`

Common types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting, missing semi colons, etc.
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **test**: Adding or refactoring tests
- **chore**: Changes to build process or auxiliary tools

### Pull Requests

1. **Keep PRs small** - Easier to review and less likely to introduce bugs
2. **Descriptive titles** - Summarize what the PR does
3. **Detailed description** - Explain the changes and why they're needed
4. **Reference issues** - Link to related tickets or issues
5. **Screenshots** - For UI changes
6. **CI checks** - Ensure all tests and linters pass

### Code Review

1. **Be respectful and constructive**
2. **Focus on the code, not the person**
3. **Explain why, not just what**
4. **Ask questions rather than making demands**
5. **Suggest alternatives**

### Continuous Integration

Set up CI to run on all branches:

1. **Lint** - Check code style
2. **Test** - Run unit and integration tests
3. **Build** - Ensure the project builds correctly
4. **Security scans** - Check for vulnerabilities

## Handling Merge Conflicts

When conflicts occur:

\`\`\`bash
# Get the latest changes from the target branch
git checkout develop
git pull origin develop

# Switch back to your branch
git checkout feature/your-feature

# Merge or rebase
git merge develop
# OR
git rebase develop

# Resolve conflicts in your editor
# Then continue
git add .
git commit # For merge
# OR
git rebase --continue # For rebase

# Push your changes
git push origin feature/your-feature --force # Only if rebasing
\`\`\`

## Git Hooks

Use pre-commit hooks to ensure quality:

\`\`\`bash
npm install --save-dev husky lint-staged
\`\`\`

Configure in package.json:

\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.js": ["eslint --fix", "prettier --write", "git add"],
    "*.{json,md}": ["prettier --write", "git add"]
  }
}
\`\`\`

## Choosing the Right Workflow

- **Gitflow**: Good for teams with scheduled releases
- **GitHub Flow**: Ideal for continuous delivery environments
- **Trunk-Based**: Best for experienced teams with strong testing practices

The most important thing is consistency. Choose a workflow that fits your team's needs and ensure everyone understands and follows it.
    `,
    coverImage: "/images/posts/git-workflow.jpg",
    date: "2025-09-15",
    views: 1542,
    authorId: "author-2",
    categoryId: "category-3",
    tags: ["tag-12"],
  }
];

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter(post => post.featured);
}

export function getRecentPosts(limit: number = 5): Post[] {
  return [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}