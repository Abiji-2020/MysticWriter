# 🌟 MysticWriter

An AI-powered collaborative storytelling platform that brings your stories to life with intelligent character generation, seamless story continuation, and comprehensive writing analytics.

![MysticWriter](https://img.shields.io/badge/MysticWriter-AI--Powered%20Storytelling-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-blue?style=flat-square&logo=tailwindcss)
![InsForge](https://img.shields.io/badge/InsForge-Backend-orange?style=flat-square)

## ✨ Features

### 🤖 AI-Powered Storytelling

- **Intelligent Story Continuation**: GPT-4 powered responses that understand context and maintain narrative consistency
- **Dynamic Character Generation**: AI creates rich character descriptions and generates custom avatars
- **Context-Aware Responses**: AI remembers your story history, characters, and writing style

### 📚 Story Management

- **Persistent Storage**: All stories, characters, and progress saved to InsForge database
- **Story History Tracking**: Complete audit trail of all story modifications and additions
- **Real-time Collaboration**: Seamless user-AI conversation flow with timestamped segments
- **Story Analytics**: Track word counts, writing streaks, and contribution percentages

### 🎨 Character System

- **AI-Generated Avatars**: Custom character portraits created by AI image generation
- **Rich Character Profiles**: Detailed descriptions, roles, and personality traits
- **Character Management**: Create, edit, and delete characters with persistent storage

### 📊 Writing Analytics

- **Progress Tracking**: Monitor daily word counts and writing streaks
- **Story Statistics**: Track total words, character counts, and writing patterns
- **Visual Analytics**: Beautiful charts and graphs showing your writing journey

### 🔐 Authentication & Security

- **Multi-Provider Auth**: Email/password and Google OAuth integration
- **Secure Sessions**: JWT token management with automatic refresh
- **Protected Routes**: Secure access to user data and stories

### 🎯 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Themes**: Customizable theme system with smooth transitions
- **Intuitive Interface**: Clean, modern design with glassmorphism effects
- **Real-time Updates**: Live synchronization of story changes and analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- InsForge account and API access

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MysticWriter
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your InsForge credentials:

   ```env
   VITE_INSFORGE_API_URL=https://your-backend-url.insforge.app
   VITE_INSFORGE_API_KEY=your-api-key-here
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` and start writing!

## 🏗️ Architecture

### Frontend Stack

- **React 18.3.1** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **TailwindCSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Lucide React** for consistent iconography

### Backend Integration

- **InsForge SDK** for database operations and AI services
- **Insforge/PostgreSQL** for data persistence
- **AI Models**: GPT-4o, Gemini, and custom image generation using Insforge
- **Real-time Storage** for avatar uploads and file management using Buckets from Insforge

### State Management

- **React Context** for global authentication state
- **Custom Hooks** for business logic and data fetching
- **Service Layer** for API interactions and data transformation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── ui/             # Base UI primitives (Radix)
│   ├── Header.tsx      # Top navigation bar
│   ├── LeftSidebar.tsx # Story navigation
│   ├── StoryDisplay.tsx# Story content viewer
│   ├── RightPanel.tsx  # Character and analytics panel
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/               # Utilities and configurations
│   └── insforge/      # InsForge client setup
├── pages/             # Route components
│   └── auth/          # Authentication pages
├── services/          # Business logic services
│   ├── storyService.ts     # Story CRUD operations
│   ├── aiService.ts       # AI integration
│   ├── characterService.ts # Character management
│   ├── analyticsService.ts # Analytics tracking
│   └── storyHistoryService.ts # History logging
└── App.tsx           # Main application component
```

## 🔧 Key Services

### Story Service (`storyService.ts`)

- Create, read, update, delete stories
- Manage story segments (user/AI messages)
- Track word counts and metadata
- Database persistence with error handling

### AI Service (`aiService.ts`)

- Story continuation with GPT-4
- Character description generation
- Avatar image creation
- Context-aware responses with conversation history

### Character Service (`characterService.ts`)

- Character CRUD operations
- Avatar generation and storage
- Integration with AI services
- Database relationship management

### Analytics Service (`analyticsService.ts`)

- Writing progress tracking
- Daily/weekly/monthly statistics
- User engagement metrics
- Performance optimization

## 🎮 Usage

### Creating Your First Story

1. Click "New Story" in the sidebar
2. Enter a compelling title and optional starting text
3. Watch as AI begins to build upon your ideas

### Building Characters

1. Open the Characters panel (right sidebar)
2. Click "Generate Character" for AI suggestions
3. Customize descriptions and generate unique avatars
4. Characters are automatically saved and referenced in your story

### Tracking Progress

1. View real-time analytics in the dashboard
2. Monitor your writing streaks and word counts
3. Analyze your contribution vs AI responses
4. Track character development over time

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

```env
# Production
VITE_INSFORGE_API_URL=https://your-production-backend.insforge.app
VITE_INSFORGE_API_KEY=your-production-api-key

# Development
VITE_INSFORGE_API_URL=https://your-dev-backend.insforge.app
VITE_INSFORGE_API_KEY=your-dev-api-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Check the [InsForge Documentation](https://docs.insforge.dev/introduction)
- Create an issue in the repository

---

**Made with ❤️ by AI enthusiasts for storytellers everywhere**

_Transform your ideas into captivating stories with the power of AI_
