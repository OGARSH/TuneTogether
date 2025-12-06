# Contributing to TuneTogether

First off, thank you for considering contributing to TuneTogether! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When submitting a bug report, include:**
- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots if applicable
- Browser and OS information
- Console errors (F12 → Console tab)

### 💡 Suggesting Features

Feature requests are welcome! Please provide:
- Clear description of the feature
- Why this feature would be useful
- Possible implementation approach
- Examples or mockups if applicable

### 🔧 Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## Development Guidelines

### Code Style

**JavaScript:**
- Use camelCase for variables and functions
- Use const/let, avoid var
- Add comments for complex logic
- Keep functions small and focused

**CSS:**
- Follow existing naming conventions
- Group related styles together
- Use CSS variables for colors
- Maintain mobile-first approach

**HTML:**
- Use semantic elements
- Maintain proper indentation
- Add ARIA labels for accessibility

### Testing

Before submitting:
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices
- Verify API integrations work
- Check console for errors
- Test party mode with multiple users

### Commit Messages

Use clear, descriptive commit messages:
- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for changes to existing features
- `Remove:` for removed features
- `Refactor:` for code improvements
- `Docs:` for documentation changes

Examples:
```
Add: Volume control with mute button
Fix: Progress bar not updating on mobile
Update: Improve visualizer animation
Docs: Add Firebase setup instructions
```

## Project Structure

```
TuneTogether/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── app.js             # Main JavaScript logic
├── config.js          # API configuration
├── config.template.js # Config template
├── service-worker.js  # PWA support
├── setup.html         # Setup guide
├── README.md          # Documentation
├── QUICKSTART.md      # Quick start guide
├── CONTRIBUTING.md    # This file
├── LICENSE            # MIT License
├── .gitignore         # Git ignore rules
├── deploy.ps1         # Windows deployment
└── deploy.sh          # Unix deployment
```

## Feature Ideas

Looking for something to work on? Here are some ideas:

### Easy
- [ ] Add keyboard shortcuts (space for play/pause, arrows for skip)
- [ ] Add more emoji reactions
- [ ] Create additional color themes
- [ ] Improve mobile touch gestures
- [ ] Add song sharing buttons

### Medium
- [ ] Implement queue management (reorder, remove songs)
- [ ] Add search history
- [ ] Create playlist import/export
- [ ] Add user avatars
- [ ] Implement voting system for party queue

### Advanced
- [ ] Add voice chat to party mode
- [ ] Implement YouTube Music API integration
- [ ] Create desktop app with Electron
- [ ] Add lyrics display
- [ ] Implement audio effects (equalizer, bass boost)

## Questions?

Feel free to:
- Open an issue for questions
- Reach out via GitHub Discussions
- Check existing documentation

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- README.md acknowledgments section
- Release notes for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to TuneTogether! 🎵
