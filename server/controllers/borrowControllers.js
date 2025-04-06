import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from "../middlewares/errorMiddlewares.js"
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {email} = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
    // return res.status(404).json({
    //   success: false,
    //   message: "Book not found",
    // });
  }

  // const user = await User.findOne({ email });
  const user = await User.findOne({ email, role: "User", accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
    // return res.status(404).json({
    //   success: false,
    //   message: "User not found",
    // });
  }

  if(book.quantity === 0) {
    return next(new ErrorHandler("Book not available", 400));
    // return res.status(400).json({
    //   success: false,
    //   message: "Book not available",
    // });
  }

  // console.log("book.quantity", book.quantity);
  
  const isAlreadyBorrowed = await user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
    // return res.status(400).json({
    //   success: false,
    //   message: "Book already borrowed",
    // });
  }
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();
  user.borrowedBooks.push({
    bookId: id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();
  
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });
  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully",
    // message: "Book borrowed successfully",
  });
});

export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;
  console.log("book", bookId);
  if (!bookId) {
    return res.status(400).json({
      success: false,
      message: "Book ID is required",
    });
  }

  // const book = await Book.findById(bookId);
  try {
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    
    // Proceed with the rest of the logic if the book exists
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }

  const book = await Book.findById(bookId);

  const user = await User.findOne({ email, role: "User", accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
    // return res.status(404).json({
    //   success: false,
    //   message: "User not found",
    // });
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
    // return res.status(400).json({
    //   success: false,
    //   message: "You have not borrowed this book.",
    // });
  }

  borrowedBook.returned = true;  
  await user.save();

  book.quantity += 1;  
  book.availability = book.quantity > 0;    await book.save();

  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });

  if(!borrow) {
    return next(new ErrorHandler("You have not borrowed this book", 404));
    // return res.status(404).json({
    //   success: false,
    //   message: "Borrow record not found",
    // });
  }

  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();
  res.status(200).json({
    success: true,
    message: fine !== 0 
    ? `The book has been returned successfully. The total charges are ₹${book.price + fine}` 
    : `The book has been returned successfully. The total charges are ₹${book.price}`,
    fine,
  });
});

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;
  
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

export const getBorrowedBookForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find();
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});
 