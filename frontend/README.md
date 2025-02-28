# ABARE Platform Frontend

This is the frontend application for the ABARE Platform, built with Next.js, TypeScript, and Mantine UI.

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
4. Copy the environment variables file:
   ```bash
   cp .env.local.example .env.local
   ```
5. Edit `.env.local` to set your environment variables

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

```
frontend/
├── public/            # Static files
├── src/
│   ├── components/    # Reusable components
│   ├── pages/         # Next.js pages
│   ├── services/      # API services
│   ├── styles/        # Global styles
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── .env.local.example # Example environment variables
├── next.config.js     # Next.js configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Mantine](https://mantine.dev/) - UI component library
- [React Query](https://tanstack.com/query/latest) - Data fetching library
- [Axios](https://axios-http.com/) - HTTP client 