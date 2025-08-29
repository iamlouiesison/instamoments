# 🚀 GitHub Setup Guide for InstaMoments

This guide will help you set up GitHub integration for your InstaMoments project, including repository creation, branch management, and deployment workflows.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- SSH key configured (recommended) or Personal Access Token

## 🔧 Step 1: Create GitHub Repository

### 1.1 Create New Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `instamoments`
   - **Description**: `A photo-sharing platform for events and moments in the Philippines`
   - **Visibility**: Choose Public or Private
   - **Initialize with**: 
     - ✅ Add a README file
     - ✅ Add .gitignore (choose Node.js)
     - ✅ Choose a license (MIT recommended)

### 1.2 Repository Settings
After creation, go to Settings and configure:
- **Collaborators**: Add team members if any
- **Branches**: Set up branch protection rules
- **Pages**: Configure for GitHub Pages if needed

## 🔑 Step 2: Configure Local Git

### 2.1 Set Git Configuration
```bash
# Set your Git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### 2.2 SSH Key Setup (Recommended)
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519.pub

# Copy public key to clipboard (Linux)
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard

# Copy public key to clipboard (Windows)
clip < ~/.ssh/id_ed25519.pub
```

### 2.3 Add SSH Key to GitHub
1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key
4. Give it a descriptive title
5. Click "Add SSH key"

## 🔗 Step 3: Connect Local Repository to GitHub

### 3.1 Add Remote Origin
```bash
# Add GitHub as remote origin
git remote add origin git@github.com:yourusername/instamoments.git

# Verify remote
git remote -v
```

### 3.2 Push Initial Code
```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: InstaMoments project setup

- Next.js 14 with TypeScript
- Tailwind CSS configuration
- Supabase integration
- Authentication system
- Database schema and utilities
- Storage management
- Protected routes and middleware"

# Push to main branch
git push -u origin main
```

## 🌿 Step 4: Branch Strategy

### 4.1 Create Development Branch
```bash
# Create and switch to development branch
git checkout -b develop

# Push development branch
git push -u origin develop
```

### 4.2 Feature Branch Workflow
```bash
# Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/authentication-ui

# Work on feature...
git add .
git commit -m "feat: implement authentication UI components

- Login form with validation
- Signup form with profile creation
- Password reset functionality
- Responsive design for mobile"

# Push feature branch
git push -u origin feature/authentication-ui
```

### 4.3 Pull Request Process
1. Go to GitHub repository
2. Click "Compare & pull request" for your feature branch
3. Fill in PR description:
   - **Title**: `feat: implement authentication UI components`
   - **Description**: Detailed description of changes
   - **Reviewers**: Add team members if any
   - **Labels**: Add appropriate labels (enhancement, bug, etc.)
4. Create pull request
5. After review and approval, merge to develop

## 🚀 Step 5: Deployment Workflow

### 5.1 Vercel Integration
1. Go to [Vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 5.2 Environment Variables
In Vercel dashboard, add environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

### 5.3 Auto-Deployment
- **Production**: Deploy from `main` branch
- **Preview**: Deploy from `develop` and feature branches
- **Auto-deploy**: Enable for all pushes

## 📝 Step 6: Commit Message Convention

### 6.1 Conventional Commits
```bash
# Format: type(scope): description

# Examples:
git commit -m "feat(auth): add user profile management"
git commit -m "fix(ui): resolve mobile navigation issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): format code with prettier"
git commit -m "refactor(database): optimize user queries"
git commit -m "test(auth): add unit tests for login"
git commit -m "chore(deps): update dependencies"
```

### 6.2 Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🔒 Step 7: Security and Protection

### 7.1 Branch Protection Rules
1. Go to Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Restrict pushes to matching branches

### 7.2 Security Alerts
- Enable Dependabot alerts
- Enable secret scanning
- Enable code scanning with CodeQL

## 📊 Step 8: Project Management

### 8.1 GitHub Issues
- Create issue templates for bugs, features, and enhancements
- Use labels for categorization
- Assign milestones for project phases

### 8.2 GitHub Projects
- Create project board for task management
- Use Kanban-style workflow
- Automate with GitHub Actions

### 8.3 GitHub Actions (CI/CD)
Create `.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
    
    - name: Run linting
      run: npm run lint
```

## 🎯 Step 9: Daily Workflow

### 9.1 Start of Day
```bash
# Update local repository
git checkout main
git pull origin main
git checkout develop
git pull origin develop
```

### 9.2 During Development
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push and create PR
git push -u origin feature/your-feature
```

### 9.3 End of Day
```bash
# Clean up local branches
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# Update develop branch
git checkout develop
git pull origin develop
```

## 🚨 Troubleshooting

### Common Issues
1. **Permission Denied**: Check SSH key configuration
2. **Merge Conflicts**: Resolve conflicts manually, then commit
3. **Large Files**: Use Git LFS for large files
4. **Branch Sync Issues**: Reset local branch to match remote

### Useful Commands
```bash
# Check repository status
git status

# View commit history
git log --oneline --graph

# Reset to previous commit
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop

# View remote branches
git branch -r

# Clean up remote tracking
git remote prune origin
```

## 📚 Additional Resources

- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## 🎉 Success Checklist

- [ ] GitHub repository created
- [ ] Local Git configured
- [ ] SSH key added to GitHub
- [ ] Initial code pushed
- [ ] Development branch created
- [ ] Vercel integration configured
- [ ] Environment variables set
- [ ] Branch protection rules enabled
- [ ] CI/CD pipeline working
- [ ] Team members added (if applicable)

---

**Happy coding! 🚀**

Your InstaMoments project is now properly set up with GitHub integration, ready for collaborative development and seamless deployment.
