#!/bin/bash
# TuneTogether Deployment Script for GitHub Pages (Unix/Linux/Mac)

echo "🎵 TuneTogether - GitHub Pages Deployment"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "⚠️  Git repository not initialized. Initializing now..."
    git init
    echo "✅ Git initialized"
fi

# Check if config.js exists
if [ ! -f config.js ]; then
    echo "⚠️  config.js not found. Copying from template..."
    cp config.template.js config.js
    echo "✅ config.js created from template"
    echo "📝 Please edit config.js with your API keys before continuing"
    
    read -p "Have you configured your API keys in config.js? (y/n) " continue
    if [ "$continue" != "y" ]; then
        echo "❌ Please configure API keys first, then run this script again"
        exit 1
    fi
fi

# Get GitHub username
echo ""
read -p "Enter your GitHub username (default: ogarsh): " username
username=${username:-ogarsh}

# Get repository name (default: TuneTogether)
read -p "Enter repository name (default: TuneTogether): " repoName
repoName=${repoName:-TuneTogether}

# Update package.json with correct URLs
echo ""
echo "📝 Updating package.json with your repository info..."
sed -i.bak "s|YOUR_USERNAME|$username|g" package.json
sed -i.bak "s|TuneTogether|$repoName|g" package.json
rm package.json.bak 2>/dev/null || true
echo "✅ package.json updated"

# Stage all files
echo ""
echo "📦 Staging files for commit..."
git add .
echo "✅ Files staged"

# Commit
echo ""
read -p "Enter commit message (default: Initial commit): " commitMessage
commitMessage=${commitMessage:-"Initial commit: TuneTogether music app"}
git commit -m "$commitMessage"
echo "✅ Changes committed"

# Check if remote exists
if git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  Remote 'origin' already exists"
    read -p "Update remote URL? (y/n) " updateRemote
    if [ "$updateRemote" = "y" ]; then
        git remote set-url origin "https://github.com/$username/$repoName.git"
        echo "✅ Remote updated"
    fi
else
    git remote add origin "https://github.com/$username/$repoName.git"
    echo "✅ Remote added"
fi

# Set main branch
currentBranch=$(git branch --show-current)
if [ "$currentBranch" != "main" ]; then
    git branch -M main
    echo "✅ Branch renamed to main"
fi

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
echo "Note: Make sure you've created the repository on GitHub first!"
echo "Create it at: https://github.com/new"
echo ""

read -p "Ready to push? (y/n) " push
if [ "$push" = "y" ]; then
    if git push -u origin main; then
        echo "✅ Successfully pushed to GitHub!"
        
        echo ""
        echo "🎉 Deployment initiated!"
        echo ""
        echo "Next steps:"
        echo "1. Go to: https://github.com/$username/$repoName/settings/pages"
        echo "2. Under 'Source', select 'main' branch"
        echo "3. Click 'Save'"
        echo "4. Wait 2-5 minutes for deployment"
        echo "5. Visit: https://ogarsh.tech/$repoName/"
        echo ""
        echo "Don't forget to:"
        echo "- Add https://ogarsh.tech/$repoName/ to Spotify app redirect URIs"
        echo "- Add ogarsh.tech to Firebase authorized domains"
    else
        echo "❌ Push failed. Make sure:"
        echo "- The repository exists on GitHub"
        echo "- You have the correct permissions"
        echo "- You're logged into Git"
    fi
else
    echo "⏸️  Push cancelled. Run this script again when ready."
fi

echo ""
echo "📚 For more help, check README.md or setup.html"
