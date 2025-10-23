# ERP UI System

A modern Enterprise Resource Planning (ERP) system built with Next.js, featuring inventory management, user authentication, and comprehensive business tools.

## Features

- Inventory Management
- User Management
- Brand & Category Management
- Product Type Management
- Role-Based Access Control
- Shop Management
- Batch Operations
- Import/Export functionality

## Tech Stack

- **Framework**: Next.js 15.5.5 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Validation**: Zod

## Prerequisites

- Node.js 20.x or higher
- Docker & Docker Compose (for containerized deployment)

## Development Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. Build and start the container:
```bash
docker-compose up -d
```

2. View logs:
```bash
docker-compose logs -f erp-ui
```

3. Stop the container:
```bash
docker-compose down
```

### Using Docker Directly

1. Build the image:
```bash
docker build -t erp-ui .
```

2. Run the container:
```bash
docker run -p 3000:3000 erp-ui
```

## Project Structure

```
erp-ui/
├── app/                    # Next.js App Router
│   ├── (main)/            # Main application routes
│   │   ├── inventory/     # Inventory management
│   │   ├── brands/        # Brand management
│   │   ├── categories/    # Category management
│   │   ├── batches/       # Batch operations
│   │   ├── shops/         # Shop management
│   │   └── users/         # User management
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root page (redirects to inventory)
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── contexts/             # React contexts
├── services/             # API services
├── types/               # TypeScript type definitions
├── validation/          # Zod schemas
└── public/             # Static assets

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
# Add your API URL and other variables
```

## Routing

- `/` - Redirects to inventory page
- `/inventory` - Inventory management dashboard
- `/brands` - Brand management
- `/categories` - Category management
- `/product-types` - Product type management
- `/batches` - Batch operations
- `/shops` - Shop management
- `/users` - User management
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Docker Configuration

The project includes optimized Docker configuration:

- **Multi-stage build** for minimal image size
- **Standalone output** mode for Next.js
- **Non-root user** for security
- **Health checks** for container monitoring
- **Production-ready** environment

## Notes

- The application was migrated from Vite + React to Next.js 15
- All routes now use Next.js App Router conventions
- Root route (`/`) automatically redirects to the inventory page
- Authentication is handled via middleware

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)
