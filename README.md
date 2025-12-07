# 📚  BookNest - E-Library Management System

BookNest is an E-Library Management System developed by Suprit Raj. It provides a robust platform for managing books, borrowing/returning books, handling Previous Year Questions (PYQs), and sending email notifications. The system is designed for both users and administrators, offering distinct functionalities for each role.

---


## 🚀 Project Description

BookHive Manager is a full-stack web application that simplifies library management. It includes:
- **User Features**: Borrow/return books, view/download PYQs, and track borrowing history.
- **Admin Features**: Manage books, users, and PYQs, and track overdue books with fines.
- **Automation**: Automated notifications for overdue books and account verification cleanup.

This project follows the **MVC architecture** for scalability and modularity.

---

## 🔥 Features

### User Features
- **Authentication**: Secure login and registration using JWT.
- **Borrowing/Returning Books**: Track borrowed and returned books.
- **PYQ Management**: View and download Previous Year Questions.
- **Chatbot**: Integrated chatbot for user assistance.

### Admin Features
- **Book Management**: Add, update, and delete books.
- **User Management**: Manage registered users and admins.
- **PYQ Upload**: Upload and manage PYQs.
- **Overdue Management**: Track overdue books and calculate fines.

### General Features
- **Email Notifications**: Notify users about overdue books or account-related updates.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Real-time Updates**: Dynamic updates using React state management.

---

## 📌 Tech Stack

### Frontend
- **React.js**: For building the user interface.
- **Tailwind CSS**: For styling.
- **Redux Toolkit**: For state management.

### Backend
- **Node.js**: Server-side runtime.
- **Express.js**: Web framework for building APIs.

### Database
- **MongoDB**: NoSQL database for storing user, book, and borrowing data.

### Authentication
- **JWT (JSON Web Tokens)**: For secure user authentication.

### Additional Tools
- **Cloudinary**: For file uploads (e.g., user avatars, PYQs).
- **Nodemailer**: For sending email notifications.
- **Node-Cron**: For scheduled tasks like overdue notifications.

---

## 📥 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/supritR21/BookNest.git
   cd booknest
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Create a `.env` file** in the `config` directory with the following variables:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:5173
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET_KEY=<your-jwt-secret>
   CLOUDINARY_CLIENT_NAME=<your-cloudinary-name>
   CLOUDINARY_CLIENT_API=<your-cloudinary-api-key>
   CLOUDINARY_CLIENT_SECRET=<your-cloudinary-secret>
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Frontend Setup**
   ```bash
   cd ../booknest
   npm install
   npm run dev
   ```

6. **Open** [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Folder Structure

```
BookHive/
├── src/
│   ├── components/       # React components (e.g., UserDashboard, AdminDashboard)
│   ├── layout/           # Layout components (e.g., Header, SideBar)
│   ├── pages/            # Page components (e.g., Home, Login, Register)
│   ├── popups/           # Popup components (e.g., AddBookPopup, UploadPDFPopup)
│   ├── store/            # Redux slices and store configuration
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Entry point for React
│   └── index.css         # Global styles
├── public/               # Static assets
├── vite.config.js        # Vite configuration
└── README.md             # Project documentation

server/
├── controllers/          # API controllers (e.g., authController, bookController)
├── models/               # Mongoose models (e.g., User, Book, Borrow)
├── routes/               # API routes (e.g., authRouter, bookRouter)
├── middlewares/          # Custom middlewares (e.g., error handling)
├── utils/                # Utility functions (e.g., fineCalculator)
├── config/               # Configuration files (e.g., config.env)
├── app.js                # Express application setup
└── server.js             # Server entry point
```

---

## 📑 API Routes

### Authentication
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Login a user.
- `POST /api/v1/auth/logout`: Logout a user.

### Books
- `GET /api/v1/book/all`: Fetch all books.
- `POST /api/v1/book/admin/add`: Add a new book (Admin only).

### Borrowing
- `POST /api/v1/borrow/record-borrow-book/:id`: Record a borrowed book (Admin only).
- `PUT /api/v1/borrow/return-borrowed-book/:bookId`: Return a borrowed book (Admin only).

### PYQs
- `GET /api/v1/pyq/all`: Fetch all PYQs.
- `POST /api/v1/pyq/add`: Add a new PYQ (Admin only).

---

## 🎯 Usage Examples

### Borrowing a Book (Admin)
- Navigate to the **Book Management** section.
- Select a book and click **Record Borrow**.
- Enter the user’s email and confirm.

### Viewing Borrowed Books (User)
- Navigate to **My Borrowed Books**.
- View the list of borrowed books and their due dates.

### Adding a PYQ (Admin)
- Navigate to **PYQ Management**.
- Click **Add New PYQ** and upload the file.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.

2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```

4. Push to your branch:
   ```bash
   git push origin feature-name
   ```

5. Open a pull request.

---


---
