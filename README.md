# RTVI Client - Real-Time Voice Intelligence

A sophisticated multi-modal AI assistant client built with React and TypeScript, featuring real-time voice, video, text chat, file processing, and screen sharing capabilities.

## 🚀 Features

### Multi-Modal Communication
- **Real-time Voice & Video**: High-quality audio/video communication with AI assistant
- **Text Chat**: Real-time messaging with conversation history
- **File Upload & Analysis**: Drag-drop support for images, PDFs, Word docs with AI analysis
- **Screen Sharing**: Share your screen with the AI for enhanced collaboration

### Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent panels with backdrop blur effects
- **Gradient System**: Sophisticated color palette with blue-purple gradients
- **Smooth Animations**: Micro-interactions and transitions throughout
- **Responsive Design**: Perfect experience on desktop and mobile
- **Dark Mode Support**: Automatic theme switching

### Real-time Features
- **Connection Status**: Visual indicators for connection quality
- **Live Analytics**: Real-time metrics and performance monitoring
- **Typing Indicators**: Live feedback during conversations
- **File Processing**: Progress tracking for uploads and analysis

## 🛠️ Technology Stack

- **Frontend**: React 18.3.1 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Real-time**: Pipecat AI client libraries with Daily transport
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Build**: Vite with optimized vendor chunking

## 🎨 Design System

The application features a comprehensive design system with:
- HSL color variables for consistent theming
- Glass effects with backdrop blur
- Gradient backgrounds and borders
- Custom animations and transitions
- Semantic color tokens
- Typography scale with Inter font

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── rtvi/                 # RTVI client components
│   │   ├── rtvi-client.tsx   # Main application component
│   │   ├── header.tsx        # Header with controls
│   │   ├── video-interface.tsx # Video communication
│   │   ├── chat-panel.tsx    # Text chat interface
│   │   ├── file-manager.tsx  # File upload and management
│   │   └── analytics-dashboard.tsx # Real-time analytics
│   └── ui/                   # Reusable UI components
├── types/                    # TypeScript type definitions
├── assets/                   # Images and static assets
└── pages/                    # Application pages
```

## 🎯 Key Components

### RTVIClient
The main application component that orchestrates all features:
- Connection management
- State handling for video, chat, and files
- Real-time analytics tracking

### VideoInterface
Handles video communication with controls overlay:
- Video/audio toggle controls
- Screen sharing functionality
- Fullscreen support
- Beautiful placeholder with AI avatar

### ChatPanel
Real-time messaging interface:
- Collapsible side panel
- Message bubbles with timestamps
- Typing indicators
- Mobile-responsive overlay

### FileManager
Drag-and-drop file handling:
- Multiple file type support
- Upload progress tracking
- File analysis integration
- Visual feedback for all states

### AnalyticsDashboard
Real-time performance monitoring:
- Connection metrics
- Message statistics
- File processing counts
- Performance indicators

## 🎨 Customization

The design system is fully customizable through CSS variables in `src/index.css`:
- Update color schemes
- Modify gradients and animations
- Adjust glass effects
- Change typography

## 🔧 Environment Configuration

Set up your environment variables:
```env
VITE_SERVER_URL=ws://localhost:7860
```

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly controls
- Adaptive layouts
- Gesture support for mobile

## 🌟 Advanced Features

- **Connection Quality Monitoring**: Real-time connection status
- **File Type Validation**: Comprehensive file type and size checking
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: Lazy loading and code splitting
- **Accessibility**: ARIA labels and keyboard navigation

## Project info

**URL**: https://lovable.dev/projects/4df56b31-a4bd-4caf-a7d2-49bb45e5fdd7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/4df56b31-a4bd-4caf-a7d2-49bb45e5fdd7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4df56b31-a4bd-4caf-a7d2-49bb45e5fdd7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
