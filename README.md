# Chairlift Frontend

React frontend for the Slalom Chairlift flight booking application.

## Overview

This is a modern React application built with TypeScript, Vite, and Tailwind CSS. It provides a user-friendly interface for searching flights, booking tickets, and managing customer travel information.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query (@tanstack/react-query)** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **AWS CDK** - Infrastructure as code

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- AWS CLI configured (for deployment)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the API URL:

```env
VITE_API_URL=https://your-bff-api-url/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Available Routes

### Public Routes

- **/** - Flight Search
  - Search for available flights by origin, destination, date, and price range
  - View flight results and select flights to book

- **/booking** - Booking Flow
  - Multi-step booking wizard
  - Enter passenger information
  - Confirm booking details

- **/customers/:id/dashboard** - Customer Dashboard
  - View customer profile and loyalty status
  - See upcoming and past trips
  - Quick access to book new flights

- **/bookings/:id** - Booking Details
  - View complete booking information
  - See flight details and passenger info
  - Check booking status

## Available Scripts

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test -- --coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Infrastructure

```bash
# Deploy to AWS
npm run cdk:deploy

# Preview CloudFormation template
npm run cdk:synth

# Destroy infrastructure
npm run cdk:destroy
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | BFF API base URL | Yes | `http://localhost:3000/api` |

## Project Structure

```
src/
├── api/                    # API client and HTTP requests
│   └── chairlift-api.ts   # Flights, customers, and bookings API
├── components/            # Reusable UI components
│   ├── FlightCard.tsx    # Display flight information
│   ├── BookingCard.tsx   # Display booking summary
│   └── LoyaltyBadge.tsx  # Display customer loyalty tier
├── hooks/                 # React Query hooks
│   ├── useFlights.ts     # Flight search and details hooks
│   ├── useCustomers.ts   # Customer and dashboard hooks
│   └── useBookings.ts    # Booking management hooks
├── pages/                 # Page components
│   ├── FlightSearch.tsx       # Search flights page
│   ├── BookingFlow.tsx        # Multi-step booking wizard
│   ├── CustomerDashboard.tsx  # Customer profile and trips
│   └── BookingDetails.tsx     # View booking information
├── types/                 # TypeScript type definitions
│   ├── flight.types.ts        # Flight and search types
│   ├── customer.types.ts      # Customer and loyalty types
│   ├── booking.types.ts       # Booking types
│   └── aggregated.types.ts    # BFF aggregated response types
├── App.tsx               # Main app component with routing
└── main.tsx              # Application entry point

infrastructure/
├── bin/
│   └── app.ts           # CDK app entry point
└── lib/
    └── frontend-stack.ts # Frontend infrastructure stack
```

## Key Features

### Flight Search

- Search by origin, destination, departure date
- Filter by price range
- View available seats and pricing
- Select flights for booking

### Booking Management

- Multi-step booking wizard
- Real-time validation
- Seat selection
- Booking confirmation

### Customer Dashboard

- View profile information
- Display loyalty tier and points
- List upcoming trips
- View past bookings
- Quick flight search access

### Booking Details

- Complete flight information
- Passenger details
- Booking status tracking
- Loyalty program integration

## Data Fetching

This application uses React Query for efficient data fetching and caching:

### Queries

- `useFlightSearch(params)` - Search for flights
- `useFlightDetails(id)` - Get flight details
- `useCustomerDashboard(id)` - Get customer dashboard with aggregated data
- `useBookingDetails(id)` - Get booking details with flight and customer info
- `useCustomerBookings(customerId)` - List customer bookings

### Mutations

- `useCreateBooking()` - Create a new booking
- `useUpdateCustomer()` - Update customer information

All queries are automatically cached and invalidated when related mutations succeed.

## Infrastructure

The application is deployed to AWS using CDK:

- **S3** - Static website hosting
- **CloudFront** - CDN distribution
- **Origin Access Identity** - Secure S3 access

### Deployment

```bash
# Build the application
npm run build

# Deploy to AWS
npm run cdk:deploy
```

The CloudFront URL will be displayed in the CDK output.

## Testing

### Test Structure

- **Unit tests** - Component logic and API clients
- **Integration tests** - Component interactions
- **Mock data** - Realistic test fixtures

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# UI mode
npm run test:ui

# Coverage report
npm run test -- --coverage
```

## Styling

This application uses Tailwind CSS for styling with utility-first CSS framework.

## API Integration

The frontend communicates with the Chairlift BFF (Backend for Frontend) API.

### Endpoints Used

#### Flights
- `GET /api/flights` - Search flights
- `GET /api/flights/:id` - Get flight details

#### Customers
- `GET /api/customers/:id` - Get customer
- `GET /api/customers/:id/dashboard` - Get aggregated dashboard
- `PUT /api/customers/:id` - Update customer

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id/details` - Get booking with flight and customer
- `GET /api/customers/:id/bookings` - List customer bookings

## License

MIT
