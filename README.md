# Ecommerce Admin Panel

Full-stack e-commerce admin panel with React, Express, and MongoDB.

## Features

- Authentication with JWT
- Category Management
- Product Management with Variants
- Customer Management
- Order Management
- Payment Tracking
- Dashboard with Analytics

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `server` directory (already created with MongoDB credentials)

4. Start the backend server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory (already created)

4. Start the frontend:
```bash
npm run dev
```

The app will run on http://localhost:5173

## First Time Setup

1. Start both backend and frontend servers
2. Go to http://localhost:5173/login
3. Login with the default admin credentials:
   - **Email:** bishal@admin.com
   - **Password:** bishal@123456

The default admin user is already created in MongoDB. Just login and start using the panel!

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new admin
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current admin

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:id` - Get category by ID
- POST `/api/categories` - Create category
- PUT `/api/categories/:id` - Update category
- DELETE `/api/categories/:id` - Delete category
- POST `/api/categories/bulk-delete` - Bulk delete
- POST `/api/categories/bulk-update` - Bulk update status

### Products
- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get product by ID
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product
- POST `/api/products/bulk-delete` - Bulk delete
- POST `/api/products/bulk-update` - Bulk update status
- PATCH `/api/products/:id/stock` - Update stock

### Customers
- GET `/api/customers` - Get all customers
- GET `/api/customers/:id` - Get customer by ID
- POST `/api/customers` - Create customer
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer

### Orders
- GET `/api/orders` - Get all orders
- GET `/api/orders/:id` - Get order by ID
- POST `/api/orders` - Create order
- PUT `/api/orders/:id` - Update order
- PATCH `/api/orders/:id/status` - Update order status
- DELETE `/api/orders/:id` - Delete order

### Payments
- GET `/api/payments` - Get all payments
- GET `/api/payments/:id` - Get payment by ID
- POST `/api/payments` - Create payment
- PUT `/api/payments/:id` - Update payment

### Dashboard
- GET `/api/dashboard/stats` - Get dashboard statistics
- GET `/api/dashboard/recent-activity` - Get recent activity

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui
- Zustand (State Management)
- Axios (HTTP Client)
- React Router
- Recharts (Charts)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)

## Project Structure

```
ecommerce_admin/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts (Auth)
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── store/          # Zustand stores
│   └── lib/            # Utilities and axios config
├── server/
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── middleware/     # Authentication middleware
│   └── index.js        # Server entry point
└── public/             # Static assets
```

## Currency

The application uses BDT (Bangladeshi Taka) as the default currency.

## Development

- Backend runs on port 5000
- Frontend runs on port 5173
- MongoDB connection is configured in `server/.env`

## Notes

- Make sure MongoDB Atlas IP whitelist is configured (0.0.0.0/0 for development)
- The first registered user can be a super admin
- All API endpoints (except auth) require JWT token
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1c974717-d70b-466c-8cab-9ee98b38d974) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
