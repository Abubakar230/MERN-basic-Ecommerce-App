import { Router } from "express";
import { createProduct, createProductReview, deleteProduct, deleteReview, getAllProducts, getProductDetails, getProductReviews, updateProduct } from "../controllers/product.controller.js";
import { isAuthenticatedUser,authorizeRoles } from "../middleware/auth.middleware.js";  // when user is login then user see all data(products)
const router = Router()                     // when user is admin can also create, update and delete products

router.route("/products").get( getAllProducts)
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"), createProduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct)
router.route("/product/:id").get(getProductDetails)
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(getProductReviews)
router.route("/reviews").delete(isAuthenticatedUser,deleteReview)


export default router