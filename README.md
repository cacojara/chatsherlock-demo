# ChatSherlock 🕵️‍♂️

**Your AI Conversation Detective**

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://chatsherlock.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/chatsherlock/deploys)

> Transform your ChatGPT conversation history into a searchable knowledge vault with detective-level precision.

## 🎯 Problem

ChatGPT users generate thousands of conversations but lose valuable insights because:
- **Native search is broken** - only exact keyword matches
- **No cross-device access** - mobile chats don't appear on desktop
- **Brilliant ideas get buried** - research breakthroughs and creative sessions become unsearchable
- **Time wasted scrolling** - hours lost hunting through conversation history

## ✨ Solution

ChatSherlock solves conversation search with:
- **🔍 Advanced Search** - Keyword + semantic search that understands context
- **⚡ Automatic Sync** - Browser extension captures conversations with zero effort
- **📱 Universal Access** - Works on phone, tablet, desktop with real-time sync
- **🔒 Privacy-First** - End-to-end encryption, you own your data

## 🚀 Live Demo

**Try it now:** [https://chatsherlock.netlify.app/](https://chatsherlock.netlify.app/)

### Demo Features
- **Three personas** - Researcher, Consultant, Creator with realistic ChatGPT conversations
- **Real-time search** with highlighting and context jumping
- **Split-view interface** - Search results on left, full conversations on right
- **Interactive UX** - Click snippets to expand, collapse conversations, guided tooltips
- **Email capture** - Working Mailchimp integration for beta signups

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Deployment**: Netlify with serverless functions
- **Email**: Mailchimp API integration
- **Icons**: Lucide React
- **Architecture**: Progressive Web App (PWA) ready

## 📋 Features

### Core Functionality
- ✅ **Real-time search** with match highlighting
- ✅ **Conversation filtering** by persona, date, content
- ✅ **Context preservation** - maintains conversation state during searches
- ✅ **Mobile responsive** - optimized for all screen sizes
- ✅ **Accessibility** - ARIA labels, keyboard navigation

### User Experience
- ✅ **First-time guidance** - Helpful tooltips and hints
- ✅ **Collapsible interface** - Click titles to expand/collapse conversations
- ✅ **Smart selection** - Preserves active conversation across searches
- ✅ **Visual feedback** - Loading states, hover effects, smooth transitions

### Technical
- ✅ **Optimized search** - RegExp escaping, efficient matching algorithms
- ✅ **Cross-browser support** - Works on Chrome, Firefox, Safari, Edge
- ✅ **Performance** - Fast rendering, minimal bundle size
- ✅ **SEO ready** - Meta tags, structured data

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chatsherlock-demo.git
   cd chatsherlock-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Deployment

#### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Deploy automatically on every push

#### Vercel Alternative
1. Import repository to Vercel
2. Auto-deploys with zero configuration

## 📧 Email Integration

The demo includes working Mailchimp integration via Netlify Functions:

### Setup Your Own Email Capture
1. **Get Mailchimp API key** from your Mailchimp account
2. **Create an audience** and note the Audience ID
3. **Update `netlify/functions/subscribe.js`** with your credentials:
   ```javascript
   hostname: 'YOUR_DC.api.mailchimp.com', // Your data center
   path: '/3.0/lists/YOUR_AUDIENCE_ID/members',
   Authorization: 'Basic ' + Buffer.from('anystring:YOUR_API_KEY').toString('base64')
   ```

## 🎨 Customization

### Demo Data
Edit the `MOCK_DATASETS` object in `src/app/page.tsx` to customize:
- Persona types and descriptions
- Sample conversations
- Search hints and suggestions

### Styling
- **Colors**: Update Tailwind classes in components
- **Layout**: Modify grid layouts and spacing in component JSX
- **Animations**: Customize transition classes and hover effects

### Search Behavior
- **Algorithm**: Modify `makeSnippet()` and `countMatches()` functions
- **Ranking**: Update sorting logic in search results
- **Highlighting**: Customize `highlight()` function for different styles

## 📊 Analytics

The demo includes Google Analytics event tracking:
- Email signups by source (hero, header, footer)
- Demo selection by persona type
- Search interactions and patterns

Add your GA4 tracking ID to start collecting metrics.

## 🔮 Roadmap

### Phase 1: MVP Demo ✅
- [x] Three persona demos
- [x] Real-time search with highlighting
- [x] Email capture integration
- [x] Mobile responsive design
- [x] Accessibility features

### Phase 2: Production Features 🚧
- [ ] Browser extension for real ChatGPT capture
- [ ] User authentication and data persistence
- [ ] Vector-based semantic search
- [ ] Conversation organization and tagging
- [ ] Cross-device synchronization

### Phase 3: Advanced Features 📋
- [ ] Team collaboration and sharing
- [ ] AI-powered conversation insights
- [ ] Integration with Claude, Gemini, other AI platforms
- [ ] Advanced filtering and search operators
- [ ] API access for third-party integrations

## 🤝 Contributing

This is currently a demo/prototype project. For the production version:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Contact & Feedback

- **Demo**: [https://chatsherlock.netlify.app/](https://chatsherlock.netlify.app/)
- **Website**: [https://chatsherlock.com](https://chatsherlock.com)
- **Feedback**: Use the email capture form in the demo to join our beta list

---

Built with ❤️ for ChatGPT power users who refuse to lose brilliant conversations in the digital void.

**Try the demo** → **Join the beta** → **Never lose an insight again** 🕵️‍♂️
