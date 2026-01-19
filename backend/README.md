# Tezex Backend API

Complete NestJS backend for Tezex Parcel Delivery Dashboard with Swagger documentation.

## Features

- 🔐 JWT Authentication with bcrypt password hashing
- 👥 Client Management (CRUD operations)
- 📦 Parcel Management with automatic tracking number generation (TZX-YYYYMMDD-XXX)
- 💰 Pricing System (234 countries, 0.5-70kg + per-kg formula for >70kg)
- 📊 Statistics Dashboard
- 📝 Audit Logging for all operations
- 📄 CSV/Excel import for pricing data
- 📚 Complete Swagger API Documentation at /api/docs

## Technology Stack

- NestJS 10.3.0
- PostgreSQL 16
- TypeORM 0.3.19
- JWT Authentication
- Swagger/OpenAPI
- TypeScript 5.3.3

## Prerequisites

- Node.js 18+ and npm
- Docker (for PostgreSQL) OR local PostgreSQL installation

## Installation

```bash
# Install dependencies
npm install
```

## Database Setup

### Option 1: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker compose up -d

# Check if database is running
docker ps
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL 16
2. Create database: `tezex_db`
3. Update `.env` file with your credentials

## Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Key environment variables:
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USERNAME=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=tezex_db`
- `JWT_SECRET=your-secret-key-change-in-production`
- `PORT=3001`

## Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at: **http://localhost:3001/api**

Swagger documentation: **http://localhost:3001/api/docs**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Clients (Protected)
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Parcels (Protected)
- `GET /api/parcels` - Get all parcels
- `POST /api/parcels` - Create parcel (auto-generates tracking number)
- `GET /api/parcels/:id` - Get parcel by ID
- `GET /api/parcels/tracking/:trackingNumber` - Track parcel
- `PATCH /api/parcels/:id` - Update parcel
- `PATCH /api/parcels/:id/status` - Update parcel status
- `DELETE /api/parcels/:id` - Delete parcel

### Pricing (Protected)
- `GET /api/pricing` - Get all country pricing
- `POST /api/pricing` - Create pricing
- `POST /api/pricing/calculate` - Calculate price for weight/country
- `POST /api/pricing/import/csv` - Import pricing from CSV
- `POST /api/pricing/import/excel` - Import pricing from Excel
- `GET /api/pricing/:id` - Get pricing by ID
- `PATCH /api/pricing/:id` - Update pricing
- `DELETE /api/pricing/:id` - Delete pricing

### Statistics (Protected)
- `GET /api/stats/dashboard` - Get dashboard statistics

### Audit (Protected)
- `GET /api/audit` - Get all audit logs
- `GET /api/audit/:entity/:entityId` - Get audit logs for entity

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT authentication.

1. Register or login to get JWT token
2. Add header to requests: `Authorization: Bearer <your-token>`

## Swagger Documentation

Access the interactive API documentation at:
**http://localhost:3001/api/docs**

Features:
- Try out all API endpoints
- View request/response schemas
- Test authentication with Bearer token
- See all available operations with descriptions

## Database Schema

### Entities
1. **User** - Admin users with JWT authentication
2. **Client** - Customer information
3. **Parcel** - Parcel tracking and delivery info
4. **CountryPricing** - Pricing for 234 countries (0.5-70kg + per-kg above)
5. **TrackingCounter** - Atomic tracking number generation
6. **AuditLog** - Audit trail for all operations

## Tracking Number Generation

Format: `TZX-YYYYMMDD-XXX`
- TZX: Company prefix
- YYYYMMDD: Current date
- XXX: Auto-incrementing counter (001-999)

Uses database-level locking for atomic increments.

## Price Calculation

- Fixed prices for: 0.5kg, 1kg, 2kg...70kg
- For >70kg: `price70kg + ((weight - 70) * pricePerKgAbove70)`

## Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── clients/        # Client management
│   ├── parcels/        # Parcel tracking
│   ├── pricing/        # Pricing system
│   ├── tracking/       # Tracking counter
│   ├── stats/          # Statistics
│   ├── audit/          # Audit logging
│   ├── app.module.ts   # Root module
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── docker-compose.yml  # PostgreSQL container
└── package.json        # Dependencies
```

## Development

```bash
# Watch mode
npm run start:dev

# Debug mode
npm run start:debug
```

## Testing the API

1. Start the server: `npm run start:dev`
2. Open Swagger UI: http://localhost:3001/api/docs
3. Register a user via `/auth/register`
4. Login via `/auth/login` to get JWT token
5. Click "Authorize" button in Swagger UI
6. Enter: `Bearer <your-token>`
7. Now you can test all protected endpoints

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running: `docker ps`
- Check `.env` credentials match your database
- Verify port 5432 is not in use

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port 3001: `lsof -ti:3001 | xargs kill`

### Module Not Found Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Support

For issues or questions, check the Swagger documentation at `/api/docs` or review the source code.
