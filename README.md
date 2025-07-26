# Fantasy Trade AI

<div align="center">
  <img src="public/icons/Icon.png" alt="Fantasy Trade AI Logo" width="120" height="120">
  
  **Advanced Fantasy Football Trade Analyzer Powered by AI**
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://fantasytradeai.com)
  [![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0.47-green?style=for-the-badge)](https://daisyui.com/)
</div>

## 🚀 Overview

Fantasy Trade AI is a sophisticated web application that helps fantasy football managers make informed trading decisions through advanced statistical analysis and AI-powered recommendations. The app provides comprehensive player evaluations, trade fairness scoring, and intelligent insights to optimize your fantasy team performance.

### ✨ Key Features

- **🔍 Advanced Player Search** - Intelligent search with real-time filtering and autocomplete
- **📊 AI Trade Analysis** - Sophisticated algorithm evaluating trade fairness and value
- **📈 Comprehensive Player Stats** - Detailed statistics, projections, and trends
- **🏆 Multiple Scoring Formats** - Support for Standard, Half-PPR, and PPR leagues
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **🌙 Dark/Light Theme** - Customizable UI themes with system preference detection
- **💾 Local Storage** - Persistent data storage for trade history and preferences
- **⚡ Real-time Data** - Live NFL player data integration via Sleeper API

## 🎯 Live Demo

Experience Fantasy Trade AI in action: **[https://fantasytradeai.com](https://fantasytradeai.com)**

## 📸 Screenshots

<div align="center">
  <img src="https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fantasy Trade AI Interface" width="600">
  <p><em>Main interface showing player search and trade analysis</em></p>
</div>

## 🛠️ Technology Stack

### Frontend Framework
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development with advanced TypeScript features
- **Vite 5.4.2** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **DaisyUI 5.0.47** - Beautiful component library built on Tailwind
- **Lucide React** - Modern icon library with 1000+ icons
- **Custom Fonts** - Tomorrow (headings) and Noto Sans (body text)

### State Management & Data
- **Custom Hooks** - Efficient state management with React hooks
- **Local Storage API** - Persistent client-side data storage
- **Axios** - HTTP client for API requests
- **Sleeper API** - Real-time NFL player data integration

### Development Tools
- **ESLint** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixing

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header with branding
│   ├── PlayerSearch.tsx # Advanced player search interface
│   ├── TradeInterface.tsx # Trade setup and management
│   ├── TradeAnalysis.tsx # AI-powered trade analysis
│   ├── PlayerCard.tsx  # Individual player display component
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useFantasyData.ts # Player data management
│   ├── useLocalStorage.ts # Persistent storage
│   ├── useTheme.ts     # Theme management
│   └── useDebounce.ts  # Input debouncing
├── services/           # External API integrations
│   └── fantasyApi.ts   # Sleeper API service
├── types/              # TypeScript type definitions
│   └── index.ts        # Core application types
├── utils/              # Utility functions
│   └── tradeAnalyzer.ts # AI trade analysis logic
├── data/               # Static data and mocks
│   └── mockPlayers.ts  # Development player data
└── App.tsx             # Main application component
```

### Component Architecture

#### Core Components
- **App.tsx** - Main application container with state management
- **Header.tsx** - Navigation and branding with scoring format selector
- **PlayerSearch.tsx** - Advanced search with filtering and autocomplete
- **TradeInterface.tsx** - Drag-and-drop trade setup interface
- **TradeAnalysis.tsx** - AI-powered analysis with visual feedback

#### Utility Components
- **PlayerCard.tsx** - Reusable player display with multiple variants
- **LoadingSpinner.tsx** - Consistent loading states
- **ErrorMessage.tsx** - User-friendly error handling
- **ThemeSwitcher.tsx** - Theme selection interface

### Data Flow

1. **Data Fetching** - `useFantasyData` hook manages API calls to Sleeper
2. **State Management** - React hooks with local storage persistence
3. **Component Communication** - Props and callback patterns
4. **Trade Analysis** - Custom algorithm in `tradeAnalyzer.ts`

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- Modern web browser with ES2020 support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fantasy-trade-ai.git
   cd fantasy-trade-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📖 Usage Guide

### 1. Player Search
- Use the search bar to find players by name or team
- Apply filters for position, team, and injury status
- Sort results by fantasy points, position rank, or name
- Click on players to view detailed statistics

### 2. Setting Up Trades
- Select players from search results
- Assign players to Team 1 or Team 2
- View real-time trade value calculations
- Remove players as needed

### 3. Trade Analysis
- Click "Analyze Trade" to get AI-powered insights
- Review fairness score and trade grade (A-F)
- Read personalized recommendations
- View detailed value breakdown

### 4. Scoring Formats
- Switch between Standard, Half-PPR, and PPR scoring
- All statistics and projections update automatically
- Preferences are saved locally

### 5. Trade History
- View previously analyzed trades
- Re-analyze past trades with updated data
- Clear history when needed

## 🎨 Design System

### Color Palette
- **Primary**: `#135bf9` - Main brand color for CTAs and highlights
- **Success**: Green tones for positive indicators
- **Warning**: Amber tones for caution states
- **Error**: Red tones for negative indicators
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Tomorrow font family - modern, tech-focused
- **Body Text**: Noto Sans - highly readable, international support
- **Font Sizes**: 12pt base (16px) with consistent scaling

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Component Variants
- **PlayerCard**: Search and trade variants with different layouts
- **Buttons**: Multiple sizes (sm, md, lg) and states
- **Forms**: Consistent input styling with validation states

## 🔧 Configuration

### Environment Variables
The application uses client-side configuration. No environment variables are required for basic functionality.

### Customization Options

#### Theme Configuration
```typescript
// src/hooks/useTheme.ts
const themes = ['light', 'dark', 'system'];
```

#### API Configuration
```typescript
// src/services/fantasyApi.ts
const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
```

#### Scoring Formats
```typescript
// Supported formats in components
const formats = ['standard', 'halfPpr', 'ppr'];
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Strategy
- **Unit Tests** - Individual component and utility testing
- **Integration Tests** - Component interaction testing
- **E2E Tests** - Full user workflow testing

## 🚀 Deployment

### Netlify Deployment (Recommended)
The application is optimized for Netlify deployment:

1. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"
   ```

2. **Deploy**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Deploy automatically on push

### Alternative Deployment Options
- **Vercel** - Zero-config deployment
- **GitHub Pages** - Free static hosting
- **AWS S3 + CloudFront** - Scalable cloud hosting

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **TypeScript** - All new code must be typed
- **ESLint** - Follow existing linting rules
- **Prettier** - Use consistent code formatting
- **Component Structure** - Follow established patterns

### Commit Convention
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 📊 Performance

### Optimization Features
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Image and font optimization
- **Caching Strategy** - Intelligent data caching
- **Lazy Loading** - Component-level lazy loading

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🔒 Security

### Security Measures
- **Input Sanitization** - All user inputs are sanitized
- **XSS Protection** - React's built-in XSS protection
- **HTTPS Only** - Secure data transmission
- **No Sensitive Data** - No API keys exposed to client

### Privacy
- **Local Storage Only** - No server-side data collection
- **No Tracking** - No user behavior tracking
- **No Personal Data** - No personal information required

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Issues
```bash
# Check network connectivity
# Verify Sleeper API status
# Clear browser cache
```

#### Performance Issues
```bash
# Clear local storage
localStorage.clear()

# Disable browser extensions
# Check network throttling
```

## 📈 Roadmap

### Upcoming Features
- **🔄 Real-time Updates** - Live player news and injury updates
- **📱 Mobile App** - Native iOS and Android applications
- **🤖 Advanced AI** - Machine learning-powered projections
- **👥 League Integration** - Direct league platform connections
- **📊 Advanced Analytics** - Deeper statistical analysis
- **🏆 Playoff Optimizer** - Playoff-focused trade recommendations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced mobile experience
- **v1.2.0** - AI trade analysis improvements
- **v1.3.0** - Multi-source data integration (planned)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Courtney Stephenson**
- GitHub: [@StephensonCK](https://github.com/StephensonCK)
- Website: [https://fantasytradeai.com](https://fantasytradeai.com)

## 🙏 Acknowledgments

- **Sleeper API** - Providing comprehensive NFL player data
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **DaisyUI** - For beautiful, accessible components
- **Lucide** - For the comprehensive icon library
- **Fantasy Football Community** - For inspiration and feedback

## 📞 Support

### Getting Help
- **Documentation** - Check this README and inline code comments
- **Issues** - Open a GitHub issue for bugs or feature requests
- **Discussions** - Use GitHub Discussions for questions

### Contact
- **Website** - [https://fantasytradeai.com](https://fantasytradeai.com)

---

<div align="center">
  <p>Made with ❤️ for the fantasy football community</p>
  <p>
    <a href="https://fantasytradeai.com">🌐 Live Demo</a> •
    <a href="#-getting-started">🚀 Get Started</a> •
    <a href="#-contributing">🤝 Contribute</a>
  </p>
</div>