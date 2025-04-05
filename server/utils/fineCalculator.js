// export const calculateFine = (dueDate) => {
//   const currentDate = new Date();
//   const due = new Date(dueDate);
//   const timeDiff = currentDate.getTime() - due.getTime();
//   const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
//   if (daysDiff <= 0) {
//     return 0; // No fine if the book is returned on or before the due date
//   }
  
//   const finePerDay = 10; // Fine of ₹10 per day
//   return daysDiff * finePerDay;
// }


export const calculateFine = (dueDate) => {
  const finePerHour = 0.1; // Fine of ₹0.10 per hour
  const today = new Date();
  
  if (today > dueDate) {
    const lateHours = Math.ceil((today - dueDate) / (1000 * 60 * 60));
    const fine = lateHours * finePerHour;
    return fine;
  }
  return 0; // No fine if the book is returned on or before the due date
}