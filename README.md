# UnPocket

A simple, elegant alternative to Pocket. Save, organize, and access your content effortlessly.

UnPocket is a free, open-source alternative to Pocket that allows you to save URLs and metadata via a browser extension and manage them through a web application.

## Project Structure

This is a **Turborepo** monorepo containing multiple workspaces:

### Apps

- **`web`**: React web application built with [Vite](https://vitejs.dev) and TypeScript
  - Main dashboard for managing saved content
  - Built with TanStack Router
  - Hosted at [unpocket.me](https://unpocket.me)

- **`ext`**: Browser extension built with [WXT](https://wxt.dev)
  - Cross-browser extension for saving content
  - Supports Chrome, Firefox, and other Chromium-based browsers
  - Integrates with the web app backend

### Packages

- **`@repo/ui`**: Shared component library using Tailwind CSS and Radix UI
  - Reusable components used across web and extension
  - Consistent design system

- **`@repo/db`**: Database utilities and Supabase client configuration
  - Shared database types and queries
  - Supabase client setup

- **`@repo/eslint-config`**: Shared ESLint configurations
- **`@repo/typescript-config`**: Shared TypeScript configurations

### Backend

- **`supabase/`**: Backend infrastructure
  - PostgreSQL database with Row Level Security
  - Edge functions for metadata fetching
  - Authentication via OAuth providers
  - Real-time subscriptions

## Technologies Used

- **Frontend**: React, TypeScript, Vite, TanStack Router/Query
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth)
- **Extension**: WXT framework
- **Monorepo**: Turborepo with pnpm workspaces

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/akshat-OwO/unpocket.git
cd unpocket
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up Supabase:
```bash
npx supabase start
```

4. Set up environment variables for each app (see respective `.env.example` files)

5. Run the development servers:
```bash
pnpm dev:web
pnpm dev:ext
```

## Contributing

Contributions are welcome from everyone! Whether you're fixing bugs, adding features, improving documentation, or suggesting new ideas, we'd love to have your help.

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Please open an issue
- ✨ **Feature Requests**: Have an idea? Let's discuss it
- 📝 **Documentation**: Help improve our docs
- 🔧 **Code**: Submit pull requests for bug fixes or new features
- 🎨 **Design**: UI/UX improvements are always appreciated

### Getting Started with Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests if applicable
4. Commit your changes: `git commit -m "Add your feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Submit a pull request

Please make sure to:
- Follow the existing code style
- Update documentation as needed
- Keep pull requests focused and atomic

## Roadmap

### Upcoming Features

- [ x ] **Import from Pocket**: Allow users to migrate their existing Pocket saves
- [ ] **Collections**: Advanced organization system for grouping saves beyond tags
- [ ] **Improved UI**: Enhanced user interface with better visual design and user experience
- [ ] **Mobile App**: Native mobile applications for iOS and Android
- [ ] **Collaborative Features**: Share collections and saves with others
- [ ] **Advanced Filtering**: Filter by date ranges, content types, reading time

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## Links

- 🌐 **Website**: [unpocket.me](https://unpocket.me)
- 🦊 **Firefox Extension**: [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/unpocket/)
- 🟢 **Chrome Extension**: Coming Soon
- 📧 **Support**: [GitHub Issues](https://github.com/akshat-OwO/unpocket/issues)
- 🐦 **Twitter**: [@akshat_OwO](https://x.com/akshat_OwO)
