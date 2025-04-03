class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.code === 11000) {
        const statusCode = 400;
        const message = `Duplicate field value entered`;
        err = new ErrorHandler(statusCode, message);
    }

    if(err.name === "JsonWebTokenError") {
        const statusCode = 400;
        const message = `Json Web Token is invalid. Try again`;
        err = new ErrorHandler(statusCode, message);
    }
    if(err.name === "TokenExpiredError") {
        const statusCode = 400;
        const message = `Json Web Token is expired. Try again`;
        err = new ErrorHandler(statusCode, message);
    }
    if(err.name === "CastError") {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(statusCode, message);
    }

    const errorMessage = err.errors
        ? Object.values(err.errors).map((error) => error.message)
        : err.message;
};

export default ErrorHandler;