# Concepto Frontend

React-based frontend application for the Concepto task management system. Built with Vite, TypeScript, Tailwind CSS, and React Query.

## Architecture

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack React Query (formerly React Query)
- **HTTP Client**: Axios
- **Hosting**: AWS S3 + CloudFront
- **Infrastructure**: AWS CDK
- **CI/CD**: GitHub Actions with OIDC authentication

## Features

- Create, read, update, and delete tasks
- Filter tasks by status (To Do, In Progress, Done)
- Real-time status updates
- Responsive design with Tailwind CSS
- Optimistic UI updates with React Query
- Comprehensive error handling
- Loading states and empty states

## Local Development

### Prerequisites

- Node.js 20+
- npm or yarn
- BFF API running or deployed

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your BFF API URL:
```bash
VITE_API_URL=https://your-bff-api-url.amazonaws.com/prod/api
# or for local development:
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in UI mode
npm run test:ui

# Lint code
npm run lint
npm run lint:fix
```

## Project Structure

```
concepto-fe/
├── src/
│   ├── api/                # API client layer
│   │   └── tasks.api.ts
│   ├── components/         # React components
│   │   └── tasks/
│   │       ├── TaskForm.tsx
│   │       ├── TaskItem.tsx
│   │       ├── TaskList.tsx
│   │       └── TaskFilters.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── useTasks.ts
│   ├── pages/              # Page components
│   │   └── TasksPage.tsx
│   ├── types/              # TypeScript types
│   │   └── task.ts
│   ├── test/               # Test utilities
│   │   └── setup.ts
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── infrastructure/         # AWS CDK code
│   ├── bin/
│   │   └── app.ts
│   └── lib/
│       └── frontend-stack.ts
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Deployment

### Prerequisites

1. AWS OIDC setup completed (see main project README)
2. BFF service deployed (frontend depends on BFF API URL)
3. GitHub repository secrets configured:
   - `AWS_ROLE_ARN`
   - `AWS_REGION`
   - `AWS_ACCOUNT_ID`

### Manual Deployment

```bash
# Set BFF API URL
export VITE_API_URL=https://your-bff-api-url.amazonaws.com/prod/api

# Build the project
npm run build

# Install AWS CDK
npm install -g aws-cdk

# Bootstrap CDK (first time only)
cdk bootstrap

# Deploy (requires BFF deployed first)
cdk deploy

# View outputs
aws cloudformation describe-stacks \
  --stack-name ConceptoFrontendStack \
  --query 'Stacks[0].Outputs'
```

### CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

- **CI Pipeline** (`.github/workflows/ci.yml`): Runs on PRs and pushes to main
  - Linting
  - Type checking
  - Tests
  - Build verification

- **CD Pipeline** (`.github/workflows/cd.yml`): Runs on pushes to main
  - Retrieves BFF API URL from AWS
  - Builds the application with production API URL
  - Deploys to S3 and invalidates CloudFront cache
  - Outputs website URL

## Environment Variables

- `VITE_API_URL`: BFF API base URL (required)

Example: `https://abc123.execute-api.us-west-2.amazonaws.com/prod/api`

## Testing

The project uses Vitest with React Testing Library:

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm test -- --coverage
```

## Component Overview

### TasksPage
Main page component that orchestrates all task operations and manages state.

### TaskForm
Form component for creating new tasks with title, description, and status.

### TaskList
Displays a list of tasks with loading and empty states.

### TaskItem
Individual task card with status dropdown and delete button.

### TaskFilters
Status filter buttons with task counts.

## Hooks

### useTasks
React Query hooks for task operations:
- `useTasks(status?)` - List tasks with optional status filter
- `useTask(id)` - Get single task by ID
- `useCreateTask()` - Create new task mutation
- `useUpdateTask()` - Update task mutation
- `useDeleteTask()` - Delete task mutation

## Styling

The project uses Tailwind CSS for styling with a utility-first approach. Custom styles are minimal and focused on component-specific needs.

## Related Repositories

- [concepto-be-tasks](https://github.com/tristanl-slalom/concepto-be-tasks) - Tasks Microservice
- [concepto-bff](https://github.com/tristanl-slalom/concepto-bff) - Backend for Frontend
- [concepto-meta](https://github.com/tristanl-slalom/concepto-meta) - Meta repository with documentation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support required

## License

MIT
