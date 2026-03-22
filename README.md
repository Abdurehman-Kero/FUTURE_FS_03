# 📱 Chala Mobile - E-commerce & Repair Management System

A full-stack MERN application for mobile phone and electronics e-commerce with integrated repair ticket management system.

## 🌐 Live Demo

**Live URL:** [https://chalamobile.abdurehman.com/](https://chalamobile.abdurehman.com/)

**Demo Credentials:**
- **Admin:** admin@chalamobile.com / admin123
- **Technician:** tech@chalamobile.com / tech123
- **Sales:** sales@chalamobile.com / sales123

## 🚀 Features

### 🛍️ E-commerce Features
- **Product Management**: Add, edit, delete products with multiple image uploads
- **Product Gallery**: Display products with main and additional images
- **Shopping Cart**: Add/remove items, update quantities
- **Secure Checkout**: Integrated with Chapa payment gateway
- **Order Management**: Track orders and purchase history

### 🔧 Repair Management
- **Repair Tickets**: Create and manage repair requests
- **Status Tracking**: Update repair status (Received → Diagnosing → In Progress → Completed → Delivered)
- **Customer Management**: Search and manage customer records
- **Repair History**: View all repairs for each customer

### 👥 Customer Management
- **Customer Database**: Store customer information (name, phone, email, address)
- **Search Functionality**: Quick customer lookup by name or phone
- **Customer Profile**: View repair and purchase history

### 📊 Dashboard
- **Sales Analytics**: View daily sales, total revenue, and transaction counts
- **Stock Alerts**: Monitor low stock items
- **Recent Activity**: Track recent sales and repairs
- **Statistics Cards**: Quick overview of key metrics

### 📄 Receipt Generation
- **Printable Receipts**: Generate professional PDF receipts
- **Editable Customer Info**: Update customer details on the fly
- **Warranty Information**: Display warranty period and expiry date

### 🔐 Authentication
- **Role-Based Access**: Admin, Technician, and Sales roles
- **Secure Login**: JWT-based authentication
- **Protected Routes**: Role-specific permissions

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Material-UI (MUI)** v5 - Modern UI components
- **React Router v6** - Navigation
- **Axios** - API calls
- **jsPDF** - PDF receipt generation

### Backend
- **Node.js** with Express
- **MySQL** Database
- **JWT** Authentication
- **Multer** - File uploads
- **Nodemailer** - Email notifications
- **Chapa API** - Payment integration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Step 1: Clone the Repository

### Step 2: Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Step 3: Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE chala_mobile;
```

2. Import the database schema:
```bash
mysql -u root -p chala_mobile < database/chala_mobile.sql
```

### Step 4: Environment Configuration

Create a `.env` file in the backend folder:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=chala_mobile
DB_PORT=3306

# JWT Secret
JWT_SECRET=your_secret_key_here

# Chapa Payment Gateway
CHAPA_SECRET_KEY=your_chapa_secret_key
CHAPA_PUBLIC_KEY=your_chapa_public_key

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Base URLs
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### Step 5: Run the Application

#### Backend
```bash
cd backend
npm run dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## 🏗️ Project Structure

```
chala-mobile/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── customerController.js
│   │   ├── productController.js
│   │   ├── repairController.js
│   │   └── saleController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   ├── Repair.js
│   │   └── Sale.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── customers.js
│   │   ├── products.js
│   │   ├── repairs.js
│   │   └── sales.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Admin/
│   │   │   └── Public/
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Customers.jsx
│   │   │   │   ├── Repairs.jsx
│   │   │   │   └── Sales.jsx
│   │   │   ├── Public/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   └── ProductDetail.jsx
│   │   │   └── Auth/
│   │   │       └── Login.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── index.html
└── database/
    └── chala_mobile.sql
```

## 🎯 Key Features Explained

### 1. Product Management
- Upload multiple images for products
- Set main image and gallery images
- Manage stock levels
- Track product specifications

### 2. Repair Ticket System
- Create repair tickets with customer details
- Track repair status through stages
- Add parts used during repair
- Generate repair receipts

### 3. Sales Processing
- Create sales with product selection
- Search existing customers or create new ones
- Multiple payment methods (Cash, M-Pesa, Telebirr)
- Automatic stock deduction
- Generate printable receipts

### 4. Customer Management
- Search customers by name or phone
- View customer history (repairs & purchases)
- Edit customer information
- Export customer data

## 👥 User Roles

### Admin
- Full access to all features
- Can delete products, customers, sales, repairs
- Manage staff accounts

### Technician
- Manage repairs
- Update repair status
- Add repair parts

### Sales
- Process sales
- Manage customers
- View products
- Generate receipts

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Role-Based Access Control**: Different permissions per role
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## 📱 Responsive Design

- Mobile-first approach
- Fully responsive on all devices
- Touch-friendly interface
- Adaptive layouts for different screen sizes

## 🚀 Deployment

### Live Demo
Visit: [https://chalamobile.abdurehman.com/](https://chalamobile.abdurehman.com/)

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm run build
vercel --prod
```

### Deploy to Render (Backend)
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

## 📝 API Documentation

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/repair-request` - Submit repair request

### Protected Endpoints
- `POST /api/products` - Create product (Admin/Sales)
- `PUT /api/products/:id` - Update product (Admin/Sales)
- `DELETE /api/products/:id` - Delete product (Admin)
- `GET /api/sales` - Get sales (Admin/Sales)
- `POST /api/sales` - Create sale (Admin/Sales)
- `GET /api/repairs` - Get repairs (Admin/Technician)
- `PUT /api/repairs/:id/status` - Update repair status (Admin/Technician)

## 📸 Screenshots
- Dashboard View
<img width="1866" height="962" alt="{A53D8995-7238-4C96-BEA0-3A56B0E5758E}" src="https://github.com/user-attachments/assets/cb5eb07b-3675-45d6-93e1-66b0d9fe7971" />
- Product Management
<img width="1913" height="974" alt="{0F80BE8E-A5EE-4D26-8909-304A7140F41A}" src="https://github.com/user-attachments/assets/024347c7-b348-42f6-8226-5fe763fdca95" />
- Sales Interface
<img width="1920" height="978" alt="{F508A1D1-FAA6-4882-A17C-3B04DE2735FA}" src="https://github.com/user-attachments/assets/39094d28-9928-42fa-a5a7-899db646338e" />
- Repair Tickets
- <img width="1821" height="973" alt="{5E11BD89-1E97-4728-8CA1-7AC099700A64}" src="https://github.com/user-attachments/assets/037c1b10-cf38-4b14-8aa0-c8a8bd7b3011" />
- Customer Management
<img width="1920" height="976" alt="{FE77BCC2-F61B-47F5-B8F5-D037B1E95B09}" src="https://github.com/user-attachments/assets/6369aecd-6d42-4277-8cb9-cf8594de1c2d" />
<img width="1920" height="975" alt="{13A45829-4B45-46E1-8218-27E5470335BC}" src="https://github.com/user-attachments/assets/ea454236-5e60-4290-bca5-239b3b84e96c" />
<img width="1920" height="980" alt="{46457828-8787-4B56-910C-67487738DC57}" src="https://github.com/user-attachments/assets/6045df53-f0ea-459c-b7de-1cbdf7ca14e1" />

- Receipt Generation
<img width="1920" height="967" alt="{04101D20-B9F7-4D63-A0BD-D3D63EB34195}" src="https://github.com/user-attachments/assets/12aaca9a-2020-447b-989d-7b8c7c02c012" />


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful components
- [Chapa](https://chapa.co/) for payment integration
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation

## 📧 Contact

- **Developer**: Abdurehman Kero
- **Email**: keroabdurehman@gmail.com
- **Phone**: +251 98 231 0974
- **Website**: [https://chalamobile.abdurehman.com/](https://chalamobile.abdurehman.com/)
- **GitHub**: [@keroabdurehman](https://github.com/keroabdurehman)

## 🐛 Known Issues

- None currently. Report issues on GitHub.

## 🔄 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-store support
- [ ] Barcode scanning
- [ ] Inventory management
- [ ] Customer loyalty program
- [ ] Email marketing integration

---

**Built with ❤️ by Abdurehman Kero**

**Live Demo:** [https://chalamobile.abdurehman.com/](https://chalamobile.abdurehman.com/)
