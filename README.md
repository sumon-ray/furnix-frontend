# 🛋️ Furniture E-commerce Platform

A comprehensive full-stack furniture e-commerce platform supporting both B2C retail and B2B corporate purchasing with advanced features like custom furniture orders, multi-role dashboards, and real-time notifications.

**🌐 Live Demo:** [https://furniture-ecommerce-02.vercel.app/](https://furniture-ecommerce-02.vercel.app/)

## ✨ Key Features

### 🛍️ **Dual Commerce Experience**
- **B2C Retail**: Individual customers with standard pricing
- **B2B Corporate**: Bulk orders with discounted pricing tiers
- **Custom Furniture Orders**: Upload designs, measurements, and reference images

### 🔐 **Multi-Role Authentication System**
- **Super Admin**: Full platform control
- **Admin**: Product and order management
- **Distributor**: Assigned order processing
- **Customer**: Shopping and order tracking

### 📱 **Advanced Shopping Features**
- Real-time fuzzy search with instant results
- Multi-variant products (size, color, material)
- 360° product viewer with zoom functionality
- "Frequently Bought Together" recommendations
- Live stock validation and quantity management

### ⚡ **Real-Time Capabilities**
- Socket.io integration for live updates
- Order status notifications
- Low stock alerts
- Instant cart synchronization

## 🛠️ Technology Stack

### **Frontend Architecture**
- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Shadcn/UI
- **Forms**: React Hook Form with validation
- **Notifications**: React Toastify
- **Real-time**: Socket.io client

### **Backend Integration**
- **API**: RESTful APIs with TypeScript
- **Authentication**: JWT with access/refresh tokens
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: SSL Commerce + Cash on Delivery
- **Notifications**: Nodemailer + Twilio SMS

## 🏗️ Project Structure

```
frontend/
├── .vercel/                      # Vercel deployment configuration
├── app/                          # Next.js App Router
│   ├── (site)/                   # Public site pages
│   ├── account/                  # User account management
│   ├── api/                      # API route handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── refresh/
│   │   │   └── register/
│   │   ├── categories/           # Category management
│   │   ├── custom-orders/        # Custom order handling
│   │   ├── orders/               # Order management
│   │   │   └── [id]/            # Individual order details
│   │   ├── products/            # Product operations
│   │   │   └── [id]/            # Product details
│   │   ├── search/              # Search functionality
│   │   └── users/               # User management
│   ├── cart/                    # Shopping cart page
│   ├── checkout/                # Multi-step checkout
│   ├── custom-order/            # Custom furniture orders
│   ├── dashboard/               # Admin/User dashboards
│   │   ├── custom-orders/       # Custom order management
│   │   ├── distributor/         # Distributor dashboard
│   │   ├── my-order/           # User order history
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product management
│   │   ├── settings/           # User/Admin settings
│   │   └── users/              # User management
│   ├── login/                  # Authentication page
│   ├── products/               # Product catalog
│   │   └── [slug]/            # Dynamic product pages
│   └── register/              # User registration
├── components/                 # Reusable UI components
│   ├── Admin/                 # Admin-specific components
│   ├── dashboard/             # Dashboard components
│   └── ui/                    # Shadcn UI components
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions and configs
├── pages/                     # Legacy pages (if any)
├── providers/                 # Context providers
├── public/                    # Static assets
├── store/                     # Redux store configuration
│   ├── services/             # RTK Query API services
│   └── slices/              # Redux state slices
├── styles/                   # Global styles
└── types/                    # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.17.0 or later
- **npm** or **yarn**
- **PostgreSQL** database (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/furniture-ecommerce-frontend.git
   cd furniture-ecommerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

   Configure your environment variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   
   # Authentication
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Payment Gateway
   NEXT_PUBLIC_SSL_COMMERCE_STORE_ID=your-store-id
   NEXT_PUBLIC_SSL_COMMERCE_STORE_PASSWORD=your-store-password
   
   # File Upload
   NEXT_PUBLIC_UPLOAD_URL=http://localhost:5000/uploads
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Features Overview

### **🛍️ Shopping Experience**
- **Product Catalog**: Browse furniture by categories with advanced filtering
- **Search**: Real-time fuzzy search with auto-suggestions
- **Product Details**: 360° viewer, multiple images, detailed specifications
- **Variants**: Size, color, and material options with dynamic pricing
- **Cart Management**: Persistent cart with real-time stock validation

### **🎨 Custom Furniture Orders**
- **Design Upload**: Support for images, PDFs, and design sketches
- **Room Measurements**: Detailed measurement forms
- **Admin Review**: Approval workflow before payment processing
- **Status Tracking**: Real-time updates on custom order progress

### **👥 User Roles & Dashboards**

#### **Customer Dashboard**
- Order history and tracking
- Profile management
- Saved addresses
- Custom order status

#### **Admin Dashboard**
- Product and category management
- Order processing and fulfillment
- User management
- Sales analytics and reports
- Inventory management

#### **Distributor Dashboard**
- Assigned order management
- Delivery scheduling
- Order status updates
- Performance metrics

### **💳 Payment & Checkout**
- **Multi-step Checkout**: Shipping → Payment → Review
- **Payment Options**: SSL Commerce integration + Cash on Delivery
- **Address Management**: Multiple saved shipping addresses
- **Tax Calculation**: Real-time tax and delivery cost calculation

## 🔧 Development Features

### **State Management**
- **Redux Toolkit**: Centralized state management
- **RTK Query**: Efficient API data fetching and caching
- **Redux Persist**: Cart and user session persistence

### **Performance Optimizations**
- **Server-Side Rendering (SSR)**: Fast initial page loads
- **Static Site Generation (SSG)**: Optimized product pages
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Dynamic imports for better performance

### **Type Safety**
- **100% TypeScript**: Complete type coverage
- **API Types**: Generated types from backend schema
- **Component Props**: Strict component interfaces
- **Redux Types**: Typed actions and selectors

## 📊 API Integration

### **Authentication Endpoints**
```typescript
POST /api/auth/login          // User login
POST /api/auth/register       // User registration
POST /api/auth/refresh        // Token refresh
```

### **Product Management**
```typescript
GET    /api/products          // Get all products
GET    /api/products/[id]     // Get product details
POST   /api/products          // Create product (Admin)
PUT    /api/products/[id]     // Update product (Admin)
DELETE /api/products/[id]     // Delete product (Admin)
```

### **Order Management**
```typescript
GET    /api/orders           // Get user orders
POST   /api/orders           // Create new order
GET    /api/orders/[id]      // Get order details
PUT    /api/orders/[id]      // Update order status
```

### **Custom Orders**
```typescript
POST   /api/custom-orders    // Submit custom order
GET    /api/custom-orders    // Get custom orders
PUT    /api/custom-orders/[id] // Update custom order status
```

## 🎨 UI Components

### **Design System**
- **Shadcn/UI**: Modern, accessible component library
- **Tailwind CSS**: Utility-first styling approach
- **Responsive Design**: Mobile-first responsive layout
- **Dark Mode**: Theme switching capability

### **Key Components**
- **ProductCard**: Reusable product display component
- **FilterSidebar**: Advanced product filtering
- **CartDrawer**: Slide-out shopping cart
- **OrderSummary**: Comprehensive order details
- **DashboardLayout**: Consistent admin interface

## 🔄 Real-Time Features

### **Socket.io Integration**
```typescript
// Order status updates
socket.on('orderStatusUpdate', (data) => {
  // Update order status in real-time
});

// Stock level alerts
socket.on('stockAlert', (data) => {
  // Show low stock notifications
});

// New order notifications (Admin/Distributor)
socket.on('newOrder', (data) => {
  // Display new order alerts
});
```

## 📧 Notification System

### **Email Notifications**
- Order confirmation and updates
- Account verification
- Password reset
- Custom order status changes

### **SMS Alerts**
- Order confirmation
- Delivery updates
- Custom order approvals

### **In-App Notifications**
- Real-time toast notifications
- Dashboard alert system
- Order status updates

## 🚀 Deployment

### **Vercel Deployment**
The application is optimized for Vercel deployment with:

```bash
# Build command
npm run build

# Environment variables configured in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
# ... other production variables
```

### **Performance Optimizations**
- **Image Optimization**: Next.js automatic optimization
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Caching Strategy**: Aggressive caching for static assets
- **CDN Integration**: Vercel Edge Network utilization

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Mobile-First Approach**
- Touch-friendly interface
- Swipe gestures for product images
- Optimized checkout flow
- Responsive navigation menu

## 🧪 Testing & Quality

### **Code Quality**
- **ESLint**: Code linting with custom rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **TypeScript**: Strict type checking

### **Testing Strategy**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🔒 Security Features

### **Authentication Security**
- JWT token rotation
- Secure cookie handling
- CSRF protection
- Rate limiting

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure file upload handling

## 📈 Performance Metrics

### **Core Web Vitals**
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### **Lighthouse Scores**
- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript strict mode
- Maintain 100% type coverage
- Use conventional commit messages
- Add unit tests for new features
- Update documentation as needed

## 📄 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Analysis
npm run analyze         # Bundle analyzer
npm run lighthouse      # Performance audit
```

## 🌟 Key Achievements

- ✅ **Full TypeScript Implementation**: 100% type coverage
- ✅ **Multi-Role Architecture**: Secure role-based access control
- ✅ **Real-Time Features**: Socket.io integration for live updates
- ✅ **Advanced E-commerce**: B2B/B2C hybrid platform
- ✅ **Custom Order System**: Complete custom furniture workflow
- ✅ **Payment Integration**: SSL Commerce + COD support
- ✅ **Performance Optimized**: 95+ Lighthouse score
- ✅ **Mobile Responsive**: Perfect mobile experience
- ✅ **SEO Optimized**: Dynamic meta tags and SSR/SSG

## 📞 Support

For technical support or questions:
- **Email**: sumonray146371@gmail.com
- **Issues**: [GitHub Issues](https://github.com/sumon-ray/furniture-ecommerce-frontend/issues)

## 📄 License

This project is proprietary software developed for AetherZen.

---

<div align="center">
  
**Built with Sumon Ray**

⭐ **Star this repository if it inspired you!**

</div>
