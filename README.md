# 📸 InstaMoments

A modern photo-sharing platform for events and moments in the Philippines, built with Next.js 14, Supabase, and Tailwind CSS.

## ✨ Features

- **📱 Modern Web App**: Built with Next.js 14 and TypeScript
- **🔐 Authentication**: Secure user management with Supabase Auth
- **📊 Database**: PostgreSQL database with Row Level Security
- **☁️ Storage**: File uploads for photos and videos
- **🎨 Beautiful UI**: Responsive design with Tailwind CSS
- **🚀 Fast Deployment**: Optimized for Vercel deployment
- **📱 PWA Ready**: Progressive Web App capabilities

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, Prettier

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account
- Vercel account (for deployment)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/instamoments.git
cd instamoments
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=InstaMoments
```

### 4. Set up Supabase

Follow the [Supabase Setup Guide](./SUPABASE_SETUP.md) to:

- Create your Supabase project
- Set up the database schema
- Configure authentication
- Set up storage buckets

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
instamoments/
├── .github/              # GitHub Actions workflows
├── public/               # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   │   └── ui/         # UI component library
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   │   ├── auth.ts     # Authentication helpers
│   │   ├── database.ts # Database utilities
│   │   ├── storage.ts  # Storage utilities
│   │   └── supabase/   # Supabase clients
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── docs/               # Project documentation
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── .prettierrc         # Prettier configuration
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔐 Environment Variables

| Variable                        | Description                    | Required |
| ------------------------------- | ------------------------------ | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL      | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key         | ✅       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your Supabase service role key | ✅       |
| `NEXT_PUBLIC_APP_URL`           | Your app's URL                 | ✅       |
| `NEXT_PUBLIC_APP_NAME`          | Your app's name                | ✅       |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Development

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push and create pull request
4. Merge after review

See [GitHub Setup Guide](./GITHUB_SETUP.md) for detailed workflow.

### Database Changes

1. Create migration: `supabase migration new your_migration_name`
2. Edit the migration file
3. Apply migration: `supabase db push`
4. Commit migration files

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Complete backend setup
- [GitHub Setup Guide](./GITHUB_SETUP.md) - Repository and CI/CD setup
- [API Documentation](./docs/05-api-documentation.md) - API endpoints
- [Database Schema](./docs/04-database-schema.md) - Database structure

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/instamoments/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/instamoments/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ in the Philippines**

Your InstaMoments project is ready to capture and share life's beautiful moments! 🎉
