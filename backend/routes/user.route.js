import { Router } from "express";
import { deleteUser, getAllUsers, getSingleUser, getUserDetail, loginUser, logoutUser, registerUser, updatePassword, updateProfile, updateUserRole } from "../controllers/user.controller.js";
import {isAuthenticatedUser,authorizeRoles} from '../middleware/auth.middleware.js'

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logoutUser)
router.route("/me").get(isAuthenticatedUser,getUserDetail)
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


export default router