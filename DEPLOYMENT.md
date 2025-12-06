# 🚀 Deployment Instructions for TuneTogether

## Complete Guide to Publishing Your App on GitHub Pages

### 📋 Prerequisites Checklist

Before deploying, make sure you have:
- ✅ GitHub account created
- ✅ Git installed on your computer
- ✅ Repository created on GitHub (or ready to create)
- ✅ API keys configured in `config.js` (optional, works without them)

---

## 🎯 Three Deployment Methods

### Method 1: Automated Script (Easiest) ⭐

**For Windows:**
```powershell
.\deploy.ps1
```

**For Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Initialize git repository
- Configure remote
- Commit all files
- Push to GitHub
- Provide next steps

---

### Method 2: Manual Deployment (Recommended for Learning)

#### Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `TuneTogether`
3. Description: "Listen together, anywhere - Real-time music streaming app"
4. Make it **Public** (required for GitHub Pages)
5. **DO NOT** check "Initialize with README"
6. Click **Create repository**

#### Step 2: Initialize Local Repository

Open terminal/PowerShell in your project folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: TuneTogether music app"

# Rename branch to main
git branch -M main
```

#### Step 3: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/TuneTogether.git

# Push to GitHub
git push -u origin main
```

#### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Pages** in the left sidebar
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**

#### Step 5: Wait for Deployment

- Initial deployment takes 2-5 minutes
- Check the Pages section for deployment status
- You'll see a green checkmark when ready
- Your site will be at: `https://YOUR_USERNAME.github.io/TuneTogether/`

---

### Method 3: GitHub Actions (Automatic Updates)

Your project already includes a GitHub Actions workflow!

**What it does:**
- Automatically deploys on every push to main branch
- No manual steps needed after initial setup

**Setup:**

1. Complete Method 2 (Manual Deployment) first
2. Go to repository **Settings > Pages**
3. Under **Source**, select:
   - Source: `GitHub Actions`
4. Push any changes to main branch:
   ```bash
   git add .
   git commit -m "Update: New features"
   git push
   ```
5. Watch deployment in **Actions** tab

---

## 🔧 Post-Deployment Configuration

### Update API Settings

#### For Spotify:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Open your app
3. Click **Edit Settings**
4. Under **Redirect URIs**, add:
   ```
   https://ogarsh.tech/TuneTogether/
   ```
5. Click **Save**

#### For Firebase:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication > Settings > Authorized Domains**
4. Add:
   ```
   ogarsh.tech
   ```
5. Click **Add**

---

## ✅ Verify Deployment

### Check These URLs:

1. **Main App:**
   ```
   https://ogarsh.tech/TuneTogether/
   ```

2. **Welcome Page:**
   ```
   https://ogarsh.tech/TuneTogether/welcome.html
   ```

3. **Setup Guide:**
   ```
   https://ogarsh.tech/TuneTogether/setup.html
   ```

### Test Features:

- [ ] App loads without errors
- [ ] Search functionality works (demo or real)
- [ ] Music player controls respond
- [ ] Party mode room creation works
- [ ] Chat sends messages
- [ ] Playlists can be created
- [ ] Mobile view looks good

---

## 🐛 Troubleshooting

### Problem: "Repository not found"
**Solution:**
- Make sure repository exists on GitHub
- Check repository name spelling
- Verify you're logged into GitHub

### Problem: "Permission denied"
**Solution:**
```bash
# Configure Git with your credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Use personal access token instead of password
# Generate at: https://github.com/settings/tokens
```

### Problem: "GitHub Pages not showing changes"
**Solution:**
- Wait 5-10 minutes for deployment
- Clear browser cache (Ctrl+F5)
- Check Actions tab for build status
- Verify correct branch is selected in Pages settings

### Problem: "Config.js showing on GitHub"
**Solution:**
```bash
# If you accidentally committed config.js:
git rm --cached config.js
git commit -m "Remove config.js from tracking"
git push

# The file will remain locally but won't be on GitHub
```

### Problem: "API calls not working on live site"
**Solution:**
- Verify API keys are configured in your local `config.js`
- Check that you've added GitHub Pages URL to API settings
- Look at browser console (F12) for specific errors
- Ensure CORS is properly configured

---

## 📱 Making Updates

After initial deployment, update your app:

```bash
# Make your changes to files

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add: New feature description"

# Push to GitHub
git push
```

GitHub Pages will automatically update in 1-2 minutes!

---

## 🔒 Security Best Practices

### ⚠️ NEVER Commit API Keys!

Your `.gitignore` file prevents this, but double-check:

```bash
# Before committing, always check:
git status

# Make sure config.js is NOT in the list
# If it appears, it means .gitignore isn't working
```

### For Production Use:

1. **Firebase Security Rules:**
   - Update `firebase-rules.json`
   - Apply stricter rules than test mode
   - Set proper read/write permissions

2. **API Key Restrictions:**
   - Add domain restrictions in API settings
   - Set up rate limiting
   - Monitor usage regularly

3. **Environment Variables:**
   - Consider using environment variables for keys
   - Use GitHub Secrets for Actions

---

## 🎉 Success Checklist

After deployment, you should have:

- ✅ Live website on GitHub Pages
- ✅ Clean repository without sensitive data
- ✅ API keys configured (if using full features)
- ✅ All features working
- ✅ Mobile responsive design
- ✅ Share link ready for friends

---

## 📊 Monitoring Your Site

### GitHub Insights:

View in your repository:
- **Insights > Traffic**: See visitor stats
- **Actions**: Monitor deployments
- **Issues**: Track bugs and features

### Firebase Console:

Monitor in Firebase:
- **Database > Usage**: Real-time connections
- **Analytics**: User behavior (if enabled)
- **Performance**: Load times and errors

---

## 🔄 Updating API Keys

If you need to update keys after deployment:

1. Edit your local `config.js`
2. **DO NOT** commit this file
3. For live site, consider:
   - Environment variables
   - Backend proxy
   - Serverless functions

---

## 💡 Pro Tips

1. **Custom Domain:**
   - Add a CNAME file with your domain
   - Configure DNS settings
   - Enable HTTPS in GitHub Pages settings

2. **SEO Optimization:**
   - Add meta tags to `index.html`
   - Create sitemap.xml
   - Add robots.txt

3. **Analytics:**
   - Add Google Analytics
   - Track user engagement
   - Monitor performance

4. **Performance:**
   - Images already optimized
   - Service worker provides caching
   - Consider CDN for assets

---

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Basics Tutorial](https://git-scm.com/doc)
- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api/)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## 🆘 Need Help?

1. **Check existing documentation:**
   - README.md
   - QUICKSTART.md
   - PROJECT_SUMMARY.md

2. **GitHub Issues:**
   - Search existing issues
   - Create new issue with details

3. **Community:**
   - Stack Overflow for technical questions
   - GitHub Discussions for general questions

---

## 🎵 Share Your Success!

Once deployed:
1. Share your GitHub Pages link
2. Create party rooms
3. Invite friends to listen together
4. Enjoy music with friends worldwide!

**Your deployment URL:**
```
https://ogarsh.tech/TuneTogether/
```

---

**Congratulations on deploying TuneTogether! 🎉**

*Happy listening and coding!* 🎵✨
