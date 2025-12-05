# Movies React Web

A movie information display web application built with React + TypeScript, featuring multi-language support, theme switching, infinite scroll, and more.

## Video Demonstration

![Video Demonstration](./public/video_demonstration.gif)

## Tech Stack

- **React 19.2.1** - UI Framework
- **TypeScript 4.9.5** - Type System
- **React Router DOM 7.10.1** - Routing
- **i18next 25.7.1** - Internationalization
- **Axios 1.13.2** - HTTP Client
- **Sass 1.94.2** - CSS Preprocessor
- **React Scripts 5.0.1** - Build Tool

## Project Structure

```
movies-reace-web/
├── public/                      # Static assets
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
│
├── src/                         # Source code
│   ├── api/                     # API layer
│   │   └── api.ts              # API definitions
│   │
│   ├── components/              # Reusable components
│   │   ├── Drawer/             # Drawer component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── Header/             # Header navigation component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── LazyImage/          # Lazy loading image component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── Loading/            # Loading animation component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── Message/            # Message component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MessageContainer/   # Message container component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MovieCard/          # Movie card component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MovieCardSkeleton/  # Movie card skeleton loader
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MovieInfoPageSkeleton/ # Movie detail page skeleton
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MovieListItem/      # Movie list item component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── MovieListItemSkeleton/ # Movie list item skeleton
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── SearchBox/          # Search box component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── Skeleton/           # Generic skeleton component
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   └── ThemeToggle.tsx     # Theme toggle component
│   │
│   ├── config/                  # Configuration files
│   │   └── routes.ts           # Route configuration
│   │
│   ├── contexts/                # React Contexts
│   │   └── MessageContext.tsx  # Message notification context
│   │
│   ├── hooks/                   # Custom Hooks
│   │   ├── useDebounce.ts      # Debounce hook
│   │   ├── useInfiniteScroll.ts # Infinite scroll hook
│   │   ├── useLanguage.ts      # Language switching hook
│   │   ├── useMessage.ts       # Message notification hook
│   │   ├── useRequest.ts       # Request hook
│   │   └── useTheme.ts         # Theme switching hook
│   │
│   ├── i18n/                    # Internationalization config
│   │   └── config.ts           # i18n configuration
│   │
│   ├── locales/                 # Language packs
│   │   ├── en.json             # English language pack
│   │   └── zh-TW.json          # Traditional Chinese language pack
│   │
│   ├── pages/                   # Page components
│   │   ├── MovieInfoPage/      # Movie detail page
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── NowPlayingPage/     # Now playing movies page
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   ├── SearchResultPage/   # Search results page
│   │   │   ├── index.module.scss
│   │   │   └── index.tsx
│   │   └── TopRatedPage/       # Top rated movies page
│   │       ├── index.module.scss
│   │       └── index.tsx
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── i18n.d.ts           # i18n type definitions
│   │   ├── message.ts          # Message type definitions
│   │   └── movie.ts            # Movie type definitions
│   │
│   ├── utils/                   # Utility functions
│   │   └── request.ts          # HTTP request wrapper
│   │
│   ├── App.tsx                  # Root component
│   ├── index.tsx               # Application entry point
│   ├── index.scss              # Global styles
│   ├── global.css              # Global CSS
│   └── reportWebVitals.ts      # Web vitals monitoring
│
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Features

### Routes
- **Now Playing** (`/`) - Display currently playing movies
- **Top Rated** (`/topRated`) - Display top rated movies
- **Search Results** (`/search`) - Display search results
- **Movie Details** (`/movie/:id`) - Display movie details

### Core Features
- 🌍 **Multi-language Support** - English and Traditional Chinese
- 🎨 **Theme Switching** - Light and dark theme support
- 🔍 **Search Functionality** - Movie search with debounce optimization
- ♾️ **Infinite Scroll** - Infinite scroll loading for list pages
- 💬 **Message Notifications** - Global message notification system
- 🖼️ **Lazy Image Loading** - Optimized image loading performance
- ⚡ **Skeleton Screens** - Enhanced loading experience

## Work Completed

### Core Features Implementation
- ✅ **Now Playing Movies List** - Implemented the list of movies currently playing in theaters
- ✅ **Top Rated Movies List** - Implemented the list of highest-rated movies
- ✅ **Search Bar** - Added search functionality with search bar component
- ✅ **Movie Details Page** - Completed movie detail page with comprehensive information
- ✅ **Loading States & Skeleton Screens** - Implemented loading indicators and skeleton screen components
- ✅ **Grid and List View Toggle** - Added ability to switch between grid and list view layouts
- ✅ **Lazy Image Loading with Fade-in Effect** - Implemented lazy loading for images with smooth fade-in animation

### Additional Features
- ✅ **Theme Switching** - Added light/dark theme toggle functionality
- ✅ **Language Switching** - Implemented multi-language support with language switcher
- ✅ **Mobile Display** - Optimized layout and components for mobile devices
- ✅ **Responsive Design** - Added responsive adaptations for different screen sizes
- ✅ **API Data Caching** - Implemented caching mechanism for API responses
- ✅ **Infinite Scroll** - Added infinite scroll functionality for seamless data loading

## Getting Started

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Start Development Server

```bash
npm start
# or
yarn start
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
# or
yarn build
```

### Run Tests

```bash
npm test
# or
yarn test
```

## Directory Structure

### `/src/api`
API layer that encapsulates all backend interaction interfaces.

### `/src/components`
Reusable UI components, each with its own style file (using CSS Modules).

### `/src/pages`
Page-level components corresponding to different routes.

### `/src/hooks`
Custom React Hooks that encapsulate reusable logic.

### `/src/contexts`
React Context definitions for global state management.

### `/src/types`
TypeScript type definition files.

### `/src/utils`
Utility function library.

### `/src/config`
Project configuration files, such as route configuration.

### `/src/i18n` and `/src/locales`
Internationalization configuration and language packs.

## Development Guidelines

- Components are written in TypeScript
- Styles use Sass + CSS Modules
- Components use functional components + Hooks
- Follow React best practices

## License

MIT
