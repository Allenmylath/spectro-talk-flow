import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: {
					DEFAULT: 'hsl(var(--background))',
					secondary: 'hsl(var(--background-secondary))'
				},
				foreground: 'hsl(var(--foreground))',
				
				// Standard colors using HSL
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					light: 'hsl(var(--primary-light))',
					dark: 'hsl(var(--primary-dark))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					light: 'hsl(var(--secondary-light))',
					dark: 'hsl(var(--secondary-dark))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					light: 'hsl(var(--accent-light))',
					dark: 'hsl(var(--accent-dark))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				
				// Status colors
				success: {
					DEFAULT: 'hsl(var(--success))',
					light: 'hsl(var(--success-light))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					light: 'hsl(var(--warning-light))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					light: 'hsl(var(--destructive-light))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				
				// Neutral colors
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				
				// AI Interface specific
				ai: {
					indicator: 'hsl(var(--ai-indicator))',
					user: 'hsl(var(--user-message))',
					bot: 'hsl(var(--bot-message))',
					active: 'hsl(var(--connection-active))',
					inactive: 'hsl(var(--connection-inactive))'
				}
			},
			
			// Enhanced shadows
			boxShadow: {
				'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
			},
			
			// Font family
			fontFamily: {
				body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				// Accordion Animations
				'accordion-down': {
					from: { height: '0', opacity: '0' },
					to: { height: 'var(--radix-accordion-content-height)', opacity: '1' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)', opacity: '1' },
					to: { height: '0', opacity: '0' }
				},
				
				// Enhanced Entry Animations
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { opacity: '0', transform: 'translateX(100%)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'slide-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-100%)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				
				// Scale Animations
				'scale-in': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'scale-in-center': {
					'0%': { opacity: '0', transform: 'scale(0.8) translateX(-50%) translateY(-50%)' },
					'100%': { opacity: '1', transform: 'scale(1) translateX(-50%) translateY(-50%)' }
				},
				
				// Glow & Pulse Effects
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 5px hsl(var(--primary) / 0.5)' },
					'50%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.8), 0 0 30px hsl(var(--primary) / 0.4)' }
				},
				'pulse-connection': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(1.05)' }
				},
				
				// Loading Animations
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0%)' },
					'50%': { transform: 'translateY(-10%)' }
				},
				
				// Text Animations
				'text-shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				}
			},
			animation: {
				// Basic Animations
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				
				// Entry Animations
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				
				// Scale Animations
				'scale-in': 'scale-in 0.2s ease-out',
				'scale-in-center': 'scale-in-center 0.2s ease-out',
				
				// Enhanced Pulses
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'pulse-connection': 'pulse-connection 2s ease-in-out infinite',
				
				// Loading States
				'spin-slow': 'spin-slow 3s linear infinite',
				'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
				
				// Text Effects
				'text-shimmer': 'text-shimmer 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
