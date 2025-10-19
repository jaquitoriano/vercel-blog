/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        md: '2rem',
        lg: '3rem',
        xl: '4rem',
      },
      screens: {
        sm: '640px',
        md: '768px', 
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        "border-hover": "var(--border-hover)",
        background: "var(--background)",
        "background-soft": "var(--background-soft)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          hover: "var(--secondary-hover)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          border: "var(--card-border)",
        },
        code: {
          DEFAULT: "var(--code-bg)",
          foreground: "var(--code-text)",
        },
        focus: "var(--focus)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        '6xl': ['3.75rem', '1.2'],
        '5xl': ['3rem', '1.2'],
        '4xl': ['2.25rem', '1.2'],
        '3xl': ['1.875rem', '1.2'],
        '2xl': ['1.5rem', '1.3'],
        'xl': ['1.25rem', '1.4'],
        'lg': ['1.125rem', '1.5'],
        'base': ['1rem', '1.75'],
        'sm': ['0.875rem', '1.6'],
        'xs': ['0.75rem', '1.6'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'lg': '0.5rem',
        'md': '0.375rem',
        'sm': '0.25rem',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'var(--foreground)',
            maxWidth: '72rem',
            a: {
              color: 'var(--primary)',
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderBottom: '1px solid var(--primary)',
                color: 'var(--primary-hover)',
              },
            },
            strong: {
              color: 'var(--foreground)',
              fontWeight: '600',
            },
            h1: {
              color: 'var(--foreground)',
              fontWeight: '800',
              fontSize: theme('fontSize.4xl')[0],
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.6'),
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: 'var(--foreground)',
              fontWeight: '700',
              fontSize: theme('fontSize.3xl')[0],
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.2',
              letterSpacing: '-0.015em',
            },
            h3: {
              color: 'var(--foreground)',
              fontWeight: '700',
              fontSize: theme('fontSize.2xl')[0],
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.25',
            },
            h4: {
              color: 'var(--foreground)',
              fontWeight: '700',
              fontSize: theme('fontSize.xl')[0],
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
              lineHeight: '1.3',
            },
            blockquote: {
              fontStyle: 'italic',
              fontWeight: '500',
              paddingLeft: theme('spacing.6'),
              borderLeftWidth: '3px',
              borderLeftColor: 'var(--primary)',
              color: 'var(--muted-foreground)',
              backgroundColor: 'var(--background-soft)',
              padding: theme('spacing.4'),
              borderRadius: '0 0.375rem 0.375rem 0',
              margin: '2rem 0',
            },
            code: {
              color: 'var(--code-text)',
              backgroundColor: 'var(--code-bg)',
              borderRadius: theme('borderRadius.md'),
              padding: '0.2em 0.4em',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            pre: {
              backgroundColor: 'var(--code-bg)',
              borderRadius: theme('borderRadius.lg'),
              padding: theme('spacing.6'),
              overflowX: 'auto',
              border: '1px solid var(--border)',
              fontSize: '0.875em',
              lineHeight: '1.7',
            },
            img: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
              borderRadius: theme('borderRadius.lg'),
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            },
            figure: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
            },
            figcaption: {
              fontSize: theme('fontSize.sm')[0],
              color: 'var(--muted-foreground)',
              marginTop: theme('spacing.3'),
              textAlign: 'center',
              fontStyle: 'italic',
            },
            'ul': {
              paddingLeft: theme('spacing.6'),
              listStyleType: 'none',
              position: 'relative',
            },
            'ol': {
              paddingLeft: theme('spacing.8'),
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: theme('spacing.5'),
              marginBottom: theme('spacing.2'),
            },
            'ul > li::before': {
              content: '""',
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              position: 'absolute',
              left: 0,
              top: '0.6em',
            },
            'ol > li::marker': {
              color: 'var(--primary)',
              fontWeight: '600',
            },
            hr: {
              borderColor: 'var(--border)',
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.12'),
            },
            table: {
              fontSize: theme('fontSize.sm')[0],
              lineHeight: theme('lineHeight.6'),
            },
            'thead th': {
              padding: theme('spacing.3'),
              color: 'var(--foreground)',
              fontWeight: '600',
              borderBottomWidth: '2px',
              borderBottomColor: 'var(--border)',
            },
            'tbody td, tfoot td': {
              padding: theme('spacing.3'),
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--border)',
            }
          },
        },
        dark: {
          css: {
            color: 'var(--foreground)',
            a: {
              color: 'var(--primary)',
              '&:hover': {
                color: 'var(--primary-hover)',
                borderColor: 'var(--primary-hover)',
              },
            },
            strong: {
              color: 'var(--foreground)',
            },
            blockquote: {
              borderLeftColor: 'var(--primary)',
              color: 'var(--muted-foreground)',
              backgroundColor: 'var(--background-soft)',
            },
            h1: {
              color: 'var(--foreground)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            },
            h2: {
              color: 'var(--foreground)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            },
            h3: {
              color: 'var(--foreground)',
            },
            h4: {
              color: 'var(--foreground)',
            },
            code: {
              color: 'var(--code-text)',
              backgroundColor: 'var(--code-bg)',
            },
            pre: {
              backgroundColor: 'var(--code-bg)',
              color: 'var(--code-text)',
              borderColor: 'var(--border)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.2)',
            },
            hr: {
              borderColor: 'var(--border)',
            },
            'thead th': {
              color: 'var(--foreground)',
              borderBottomColor: 'var(--border)',
              backgroundColor: 'var(--background-soft)',
            },
            'tbody td, tfoot td': {
              borderBottomColor: 'var(--border)',
            },
            img: {
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
            },
            'ul > li::before': {
              backgroundColor: 'var(--primary)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}