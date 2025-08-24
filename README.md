# 💰 Expense Tracker - Full Stack Web Application

A modern, full-stack expense tracking web application built with React, Node.js, and MongoDB Atlas. Features a beautiful dark theme interface with comprehensive expense management capabilities.

## ✨ Features

- **📊 Dashboard**: Monthly expense overview with category breakdowns
- **📤 File Upload**: Support for PDF and image payslips
- **🏷️ Categories**: IT, Building, Stationery & Food, and Other expenses
- **📅 Filtering**: Date range and monthly filtering capabilities
- **📱 Responsive**: Mobile-first design with modern UI/UX
- **♿ Accessible**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication
- **Moment.js** - Date handling and formatting
- **Custom CSS** - Modern dark theme with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   - Copy `server/config.env.example` to `server/config.env`
   - Update MongoDB URI and other environment variables

4. **Start the application**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 📁 Project Structure

```
expense-tracker/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.css      # Global styles
│   └── package.json       # Frontend dependencies
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # File uploads
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── package.json            # Root package.json
└── README.md              # This file
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run install-all` - Install all dependencies
- `npm run build` - Build frontend for production

### Frontend (client/)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend (server/)
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## 🌐 API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/dashboard` - Get dashboard summary
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### File Uploads
- Supports PDF, JPG, PNG files
- Maximum file size: 10MB
- Files stored in `server/uploads/`

## 🎨 UI/UX Features

- **Dark Theme**: Modern, eye-friendly interface
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Hover effects and transitions
- **Accessibility**: ARIA labels, keyboard navigation
- **Loading States**: Skeleton screens and spinners

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔒 Security Features

- CORS enabled for cross-origin requests
- File type validation for uploads
- Environment variable protection
- Input sanitization and validation

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Deploy!

### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set environment variables
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the cloud database
- Vercel for seamless deployment
- All contributors and supporters

---

**Built with ❤️ using modern web technologies**
