import express from 'express';
import {
  getAllUsers,
  registerNewadmin
} from "../controllers/userController.js";
import {
  isAuthenticated, 
  isAuthorized,
} from '../middlewares/authMiddlewares.js';

const router = express.Router();
// console.log("User router loaded");

router.get(
  "/all",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllUsers
);


router.post(
  "/add/new-admin",
  isAuthenticated,
  isAuthorized("Admin"),
  registerNewadmin
);

export default router;