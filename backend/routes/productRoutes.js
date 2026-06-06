const express = require("express");
const router = express.Router();
const { isAuth } = require("../config/auth");
const {
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} = require("../controller/productController");

//add a product
router.post("/add", isAuth, addProduct);

//add multiple products
router.post("/all", isAuth, addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", isAuth, updateProduct);

//update many products
router.patch("/update/many", isAuth, updateManyProducts);

//update a product status
router.put("/status/:id", isAuth, updateStatus);

//delete a product
router.delete("/:id", isAuth, deleteProduct);

//delete many product
router.patch("/delete/many", isAuth, deleteManyProducts);

module.exports = router;
