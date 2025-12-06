# 🎵 TuneTogether - Command Reference

Quick reference for all commands to test, deploy, and manage your app.

---

## 🧪 TESTING LOCALLY

### Start Local Server

**Windows (PowerShell):**
```powershell
# Using the provided script (easiest)
.\start-server.ps1

# Or manually with Python
python -m http.server 8080

# Or with Node.js
npx http-server -p 8080
```

**Mac/Linux:**
```bash
# With Python 3
python3 -m http.server 8080

# With Python 2
python -m SimpleHTTPServer 8080

# With Node.js
npx http-server -p 8080
```

**Then visit:** http://localhost:8080

---

## 🚀 DEPLOYING TO GITHUB

### Automated Deployment

**Windows:**
```powershell
.\deploy.ps1
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

```bash
# Step 1: Initialize Git
git init

# Step 2: Add all files
git add .

# Step 3: Create first commit
git commit -m "Initial commit: TuneTogether music app"

# Step 4: Rename branch to main
git branch -M main

# Step 5: Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/TuneTogether.git

# Step 6: Push to GitHub
git push -u origin main
```

---

## 📝 MAKING UPDATES

### After Making Changes

```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Update: Description of changes"

# Push to GitHub
git push
```

### Specific File Updates

```bash
# Stage specific file
git add filename.html

# Commit
git commit -m "Fix: Specific change description"

# Push
git push
```

---

## 🔧 GIT CONFIGURATION

### First Time Setup

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email
git config --global user.email "your.email@example.com"

# Check configuration
git config --list
```

### Repository Setup

```bash
# Check remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/USERNAME/REPO.git

# Remove remote
git remote remove origin

# Add remote
git remote add origin https://github.com/USERNAME/REPO.git
```

---

## 📦 FILE MANAGEMENT

### Check Repository Status

```bash
# See changed files
git status

# See commit history
git log

# See recent commits (compact)
git log --oneline

# See changes in files
git diff
```

### Undo Changes

```bash
# Discard changes in file (before staging)
git checkout -- filename.html

# Unstage file (after git add)
git reset HEAD filename.html

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 🔐 HANDLING CONFIG.JS

### If Accidentally Committed

```bash
# Remove from Git tracking (keeps local file)
git rm --cached config.js

# Commit the removal
git commit -m "Remove config.js from tracking"

# Push changes
git push
```

### Ensure It's Ignored

```bash
# Check if file is in .gitignore
cat .gitignore | grep config.js

# Check if file is tracked
git ls-files | grep config.js

# Should return nothing if properly ignored
```

---

## 🌿 BRANCH MANAGEMENT

### Working with Branches

```bash
# Create new branch
git branch feature-name

# Switch to branch
git checkout feature-name

# Create and switch in one command
git checkout -b feature-name

# List all branches
git branch

# Delete branch
git branch -d feature-name

# Merge branch into main
git checkout main
git merge feature-name
```

---

## 🔄 SYNCING WITH GITHUB

### Pull Latest Changes

```bash
# Fetch and merge
git pull

# Or separately
git fetch
git merge origin/main
```

### Force Push (Use Carefully!)

```bash
# Only if you know what you're doing
git push --force
```

---

## 📊 VIEWING INFORMATION

### Repository Info

```bash
# Show remote URLs
git remote -v

# Show current branch
git branch --show-current

# Show all branches (including remote)
git branch -a

# Show latest commit
git show
```

### File History

```bash
# See history of a file
git log -- filename.html

# See who changed what
git blame filename.html
```

---

## 🗑️ CLEANUP

### Remove Untracked Files

```bash
# See what would be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd
```

---

## 🔍 SEARCH AND FIND

### Search in Git

```bash
# Search in code
git grep "search term"

# Search in commit messages
git log --grep="search term"

# Find when text was added
git log -S "search term"
```

---

## 🎯 GITHUB PAGES SPECIFIC

### Enable GitHub Pages

Via GitHub website:
1. Go to repository Settings
2. Click Pages in sidebar
3. Select main branch
4. Click Save

### Check Deployment Status

```bash
# Via GitHub CLI (if installed)
gh run list

# View specific workflow
gh run view
```

---

## 🆘 COMMON FIXES

### Reset to Remote State

```bash
# Discard all local changes
git fetch origin
git reset --hard origin/main
```

### Fix Merge Conflicts

```bash
# See conflicted files
git status

# After manually fixing conflicts
git add .
git commit -m "Resolve merge conflicts"
```

### Change Last Commit Message

```bash
# Edit last commit message
git commit --amend -m "New message"

# Push amended commit
git push --force
```

---

## 🔧 NPM COMMANDS (Optional)

If you add npm packages:

```bash
# Initialize npm
npm init -y

# Install package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update packages
npm update

# Run scripts (from package.json)
npm run script-name
```

---

## 🐛 DEBUGGING

### Check Configuration

```bash
# Verify Git is installed
git --version

# Check current directory
pwd  # Mac/Linux
cd   # Windows

# List files
ls   # Mac/Linux
dir  # Windows
```

### Common Issues

**"Permission denied":**
```bash
# Add SSH key or use HTTPS
git remote set-url origin https://github.com/USERNAME/REPO.git
```

**"Updates were rejected":**
```bash
# Pull first, then push
git pull origin main
git push
```

**"Repository not found":**
```bash
# Check remote URL
git remote -v

# Fix if wrong
git remote set-url origin CORRECT_URL
```

---

## 📱 QUICK COMMANDS CHEAT SHEET

### Most Used Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# View history
git log --oneline

# Create branch
git checkout -b branch-name

# Switch branch
git checkout branch-name
```

---

## 🎓 LEARNING RESOURCES

### Git Documentation
- Official Git Docs: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Git Cheat Sheet: https://training.github.com/downloads/github-git-cheat-sheet/

### Testing
- Open http://localhost:8080 after starting server
- Check browser console (F12) for errors
- Test on mobile devices

---

## 💡 PRO TIPS

1. **Commit Often:** Small, frequent commits are better
2. **Descriptive Messages:** Write clear commit messages
3. **Test Before Push:** Always test locally first
4. **Pull Before Push:** Sync before pushing changes
5. **Use .gitignore:** Never commit sensitive files
6. **Backup Important Data:** Keep config.js safe locally

---

## 🎯 WORKFLOW SUMMARY

### Standard Workflow:

```bash
# 1. Make changes to files
# 2. Test locally
.\start-server.ps1

# 3. Stage changes
git add .

# 4. Commit
git commit -m "Add: New feature"

# 5. Push
git push

# 6. Wait for GitHub Pages to update (1-2 min)
# 7. Test live site
```

---

## 📞 GETTING HELP

### Git Help Commands

```bash
# General help
git help

# Command-specific help
git help commit
git help push

# Quick reference
git commit --help
```

---

**Keep this file handy for quick reference!** 📚

*All commands tested and verified for TuneTogether project*
