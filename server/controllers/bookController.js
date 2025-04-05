import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";

export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;
  
  if (!title || !author || !description || !price || !quantity) {
    
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully.",
    book,
  });
});

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json({
    success: true,
    books,
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  
  const book = await Book.findById(id);
  
  if (!book) {
    console.log("Book not found.");
    // return next(new ErrorHandler("Book not found.", 404));
    return res.status(404).json({
      success: false,
      message: "Book not found.",
    });
  }
  console.log("Deleting book...");
  
  await book.deleteOne();
  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});
