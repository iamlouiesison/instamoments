# InstaMoments

Instant collaborative photo and video galleries for events in the Philippines. Scan QR codes, capture moments, and create beautiful memories together.

## 🚀 Features

- **QR Code Access**: No app downloads required - just scan and start sharing
- **Real-time Galleries**: See photos appear live during events
- **Video Greetings**: Personal 20-second video messages
- **Philippine Market Focus**: Local payment methods and cultural understanding
- **PWA Ready**: Works like a native app without installation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Storage + Realtime)
- **Deployment**: Vercel
- **Development**: Cursor AI assistance
- **PWA**: Progressive Web App with Service Workers

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd instamoments
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
instamoments/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   └── supabase/          # Supabase client configuration
│   ├── types/                 # TypeScript type definitions
│   ├── hooks/                 # Custom React hooks
│   └── utils/                 # Utility functions
├── public/                    # Static assets
├── docs/                      # Project documentation
└── package.json               # Dependencies and scripts
```

## 🎨 UI Components

The project uses shadcn/ui components built on top of Tailwind CSS:

- **Button**: Multiple variants and sizes
- **Card**: Content containers with header, content, and footer
- **Input**: Form input fields
- **More components**: Will be added as needed

## 🔐 Authentication

Authentication is handled through Supabase Auth with custom hooks:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, signIn, signOut } = useAuth();
  // ... use auth functions
}
```

## 📱 PWA Features

The application is configured as a Progressive Web App with:

- Web App Manifest
- Service Worker (to be implemented)
- Mobile-optimized interface
- Offline capabilities (to be implemented)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Development Guidelines

- **TypeScript**: Strict mode enabled, no `any` types without justification
- **ESLint**: Configured with Next.js and Prettier rules
- **Prettier**: Automatic code formatting
- **Components**: Use shadcn/ui components when possible
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks and Supabase realtime subscriptions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Check TypeScript types

## 📚 Documentation

- [Project Overview](./docs/01-project-overview.md)
- [Product Requirements](./docs/02-product-requirements.md)
- [Technical Specifications](./docs/03-technical-specifications.md)
- [Database Schema](./docs/04-database-schema.md)
- [Development Guide](./docs/16-cursor-implementation-guide.md)

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

- Email: support@instamoments.ph
- Documentation: Check the docs/ folder
- Issues: Use GitHub Issues for bug reports

## 🎯 Next Steps

This is the foundation setup. Next tasks include:

1. ✅ **Task 1: Project Initialization** - COMPLETED
2. 🔄 **Task 2: Supabase Project Setup** - Next
3. 🔄 **Task 3: shadcn/ui Component Library Setup** - Next
4. 🔄 **Task 4: Basic Layout and Navigation** - Next

See [Development Guide](./docs/16-cursor-implementation-guide.md) for the complete roadmap.

---

**Built with ❤️ for the Philippines event industry**
