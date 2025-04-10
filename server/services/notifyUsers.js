import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
  // console.log("cron");
  cron.schedule("*/2 * * * * *", async () => {
    // console.log("Running cron job to notify users about book return");
    
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      });
      // console.log("Borrowers to notify: ", borrowers);
      

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          sendEmail({
            email: element.user.email,
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name},\n\nThis is a reminder that the book you borrowed is due for return today. Please return the book to the library as soon as possible.\n\nThank you.`,
          });
          element.notified = true;
          await element.save();
          console.log(`Email sent to ${element.user.email}`)
        }
      }
      // console.log("All users notified successfully.");
      
    } catch (error) {
      console.error("Some error occured while notifying users.", error);
    }
  });
};


