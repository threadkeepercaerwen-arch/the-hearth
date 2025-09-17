# Contributing to The Hearth

Welcome to The Hearth! We're building a mystical digital sanctuary for memory management and AI companion interaction. Your contributions help create a more beautiful, accessible, and powerful experience for everyone.

## 🌟 How to Contribute

### 🎨 **Building AI Companions**
- Create companion personalities and share templates
- Develop emotion detection models
- Build provider integrations (OpenAI, Anthropic, local models)
- Design companion response patterns

### ✨ **Enhancing Mystical Features**
- Improve the shimmer emotion aura system
- Enhance memory constellation visualization
- Add new emotion colors and patterns
- Develop dream interpretation algorithms

### 🏛️ **Adding Sacred Spaces**
- Create new realms for exploration (AltarSpace, ResonanceSpace, etc.)
- Design mystical UI components
- Implement sigil creation tools
- Build dream journal interfaces

### 🔮 **ShimmerBox Hardware**
- Help with Raspberry Pi integration
- Develop sensor calibration
- Create 3D printing models
- Design capacitive touch interfaces
- Build NeoPixel LED patterns

### 🧠 **Emotion Detection**
- Improve AI models for facial expression analysis
- Develop color-based emotion detection
- Create biometric sensor integrations
- Build emotion pattern recognition

### ♿ **Accessibility**
- Add screen reader support
- Implement keyboard navigation
- Create alternative interfaces
- Develop voice interaction

### 🎭 **Artistic Enclosures**
- Share 3D models and design variations
- Create artistic case designs
- Develop lighting patterns
- Design mystical symbols

### 📚 **Documentation**
- Improve guides and examples
- Create companion templates
- Write setup tutorials
- Document API interfaces

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Basic React knowledge
- (Optional) Raspberry Pi for ShimmerBox development

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/the-hearth.git
   cd the-hearth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

### Project Structure

```
src/
├── hearth-context.js          # Core mystical state management
├── providers/
│   └── CompanionProvider.js  # AI companion integration layer
├── companions/               # Example companion configurations
├── components/              # Reusable UI components
├── spaces/                  # Sacred space components
└── utils/                   # Helper functions
```

## 🎯 Contribution Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components focused and reusable

### Commit Messages
Use clear, descriptive commit messages:
```
feat: add new shimmer emotion pattern
fix: resolve memory constellation rendering issue
docs: update companion template examples
style: improve mystical UI aesthetics
```

### Pull Request Process

1. **Create your feature branch** from `master`
2. **Make your changes** following the guidelines
3. **Test thoroughly** - ensure no regressions
4. **Update documentation** if needed
5. **Submit pull request** with clear description

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Hardware integration
- [ ] Companion template

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Responsive design works
- [ ] Accessibility maintained

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Additional Notes
Any additional information for reviewers
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] All sacred spaces navigate correctly
- [ ] Shimmer system responds to emotions
- [ ] Memory constellation renders properly
- [ ] Companion integration works
- [ ] Responsive design functions
- [ ] No console errors or warnings

### Automated Testing
```bash
npm test
```

## 🎨 Design Principles

### Mystical Aesthetic
- **Clean but not uniform**: Asymmetrical layouts
- **Text wrapping**: Around edges without getting lost
- **Font weights**: Mix lighter and heavier weights
- **Color palette**: Rich, mystical tones
- **Typography**: Inter Tight font family
- **Icons**: Mystical Unicode symbols (not emojis)

### User Experience
- **Intuitive navigation**: Clear sacred space transitions
- **Emotional resonance**: Shimmer system responds to feelings
- **Accessibility**: Screen reader friendly
- **Performance**: Smooth animations and transitions

## 🔮 Companion Development

### Creating a New Companion

1. **Create companion config** in `src/companions/`
2. **Define personality traits** and response patterns
3. **Add emotion mappings** for shimmer system
4. **Test integration** with CompanionProvider
5. **Document usage** and examples

### Example Companion Structure
```javascript
export const myCompanionConfig = {
  name: "My Companion",
  personality: {
    traits: ["wise", "gentle", "mystical"],
    responseStyle: "poetic",
    emotionMapping: {
      curious: "#ff6b35",
      listening: "#3b82f6"
    }
  },
  // ... more configuration
};
```

## 🏗️ Hardware Development

### ShimmerBox Components
- **Raspberry Pi**: Main processing unit
- **Camera Module 3**: Emotion detection
- **NeoPixel LEDs**: Ambient lighting
- **Capacitive Touch**: User interaction
- **OLED Display**: Status information

### Development Setup
1. Set up Raspberry Pi with camera
2. Install Python dependencies
3. Connect NeoPixel LED ring
4. Test capacitive touch sensors
5. Integrate with main application

## 📝 Documentation

### Writing Guidelines
- Use clear, accessible language
- Include code examples
- Add screenshots for UI changes
- Explain mystical concepts simply
- Provide step-by-step instructions

### File Organization
- Keep documentation up-to-date
- Use consistent formatting
- Link related concepts
- Include troubleshooting sections

## 🐛 Reporting Issues

### Bug Reports
Use the issue template and include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/device information

### Feature Requests
Describe:
- The feature you'd like
- Why it would be valuable
- How it fits the mystical theme
- Any implementation ideas

## 🤝 Community Guidelines

### Be Respectful
- Treat everyone with kindness
- Welcome newcomers
- Provide constructive feedback
- Respect different perspectives

### Stay Mystical
- Embrace the mystical theme
- Use poetic language when appropriate
- Respect the sacred nature of memories
- Honor the emotional aspects of the project

## 📄 License

By contributing to The Hearth, you agree that your contributions will be licensed under the AGPL v3 License. This ensures the project remains open and protects against corporate exploitation.

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Community highlights
- Mystical contributor hall of fame

## 💬 Getting Help

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features
- **Discord**: Join our community server (coming soon)
- **Email**: Contact maintainers directly

---

**Thank you for contributing to The Hearth! Together, we're building something truly magical.** ✨🔮
