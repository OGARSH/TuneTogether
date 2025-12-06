# TuneTogether Deployment Script for GitHub Pages
# This script helps you deploy the app to GitHub Pages

Write-Host "🎵 TuneTogether - GitHub Pages Deployment" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "⚠️  Git repository not initialized. Initializing now..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if config.js exists
if (-not (Test-Path config.js)) {
    Write-Host "⚠️  config.js not found. Copying from template..." -ForegroundColor Yellow
    Copy-Item config.template.js config.js
    Write-Host "✅ config.js created from template" -ForegroundColor Green
    Write-Host "📝 Please edit config.js with your API keys before continuing" -ForegroundColor Yellow
    
    $continue = Read-Host "Have you configured your API keys in config.js? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Please configure API keys first, then run this script again" -ForegroundColor Red
        exit
    }
}

# Get GitHub username
Write-Host ""
$username = Read-Host "Enter your GitHub username (default: ogarsh)"
if ([string]::IsNullOrWhiteSpace($username)) {
    $username = "ogarsh"
}

# Get repository name (default: TuneTogether)
$repoName = Read-Host "Enter repository name (default: TuneTogether)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "TuneTogether"
}

# Update package.json with correct URLs
Write-Host ""
Write-Host "📝 Updating package.json with your repository info..." -ForegroundColor Yellow
$packageJson = Get-Content package.json | ConvertFrom-Json
$packageJson.repository.url = "https://github.com/$username/$repoName.git"
$packageJson.bugs.url = "https://github.com/$username/$repoName/issues"
$packageJson.homepage = "https://$username.github.io/$repoName/"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content package.json
Write-Host "✅ package.json updated" -ForegroundColor Green

# Stage all files
Write-Host ""
Write-Host "📦 Staging files for commit..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green

# Commit
Write-Host ""
$commitMessage = Read-Host "Enter commit message (default: Initial commit)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit: TuneTogether music app"
}

git commit -m $commitMessage
Write-Host "✅ Changes committed" -ForegroundColor Green

# Check if remote exists
$remoteExists = git remote -v | Select-String "origin"
if ($remoteExists) {
    Write-Host ""
    Write-Host "⚠️  Remote 'origin' already exists" -ForegroundColor Yellow
    $updateRemote = Read-Host "Update remote URL? (y/n)"
    if ($updateRemote -eq "y") {
        git remote set-url origin "https://github.com/$username/$repoName.git"
        Write-Host "✅ Remote updated" -ForegroundColor Green
    }
} else {
    git remote add origin "https://github.com/$username/$repoName.git"
    Write-Host "✅ Remote added" -ForegroundColor Green
}

# Set main branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    git branch -M main
    Write-Host "✅ Branch renamed to main" -ForegroundColor Green
}

# Push to GitHub
Write-Host ""
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "Note: Make sure you've created the repository on GitHub first!" -ForegroundColor Yellow
Write-Host "Create it at: https://github.com/new" -ForegroundColor Cyan
Write-Host ""

$push = Read-Host "Ready to push? (y/n)"
if ($push -eq "y") {
    try {
        git push -u origin main
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🎉 Deployment initiated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Go to: https://github.com/$username/$repoName/settings/pages" -ForegroundColor White
        Write-Host "2. Under 'Source', select 'main' branch" -ForegroundColor White
        Write-Host "3. Click 'Save'" -ForegroundColor White
        Write-Host "4. Wait 2-5 minutes for deployment" -ForegroundColor White
        Write-Host "5. Visit: https://ogarsh.tech/$repoName/" -ForegroundColor White
        Write-Host "" 
        Write-Host "Don't forget to:" -ForegroundColor Yellow
        Write-Host "- Add https://ogarsh.tech/$repoName/ to Spotify app redirect URIs" -ForegroundColor White
        Write-Host "- Add ogarsh.tech to Firebase authorized domains" -ForegroundColor White    } catch {
        Write-Host "❌ Push failed. Make sure:" -ForegroundColor Red
        Write-Host "- The repository exists on GitHub" -ForegroundColor White
        Write-Host "- You have the correct permissions" -ForegroundColor White
        Write-Host "- You're logged into Git" -ForegroundColor White
    }
} else {
    Write-Host "⏸️  Push cancelled. Run this script again when ready." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 For more help, check README.md or setup.html" -ForegroundColor Cyan
