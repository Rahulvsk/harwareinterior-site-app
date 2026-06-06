const express = require('express');
const router = express.Router();
const { isAuth } = require("../config/auth");
const {
  addCategory,
  addAllCategory,
  getAllCategory,
  getAllCategories,
  getShowingCategory,
  getCategoryById,
  updateCategory,
  updateStatus,
  deleteCategory,
  deleteManyCategory,
  updateManyCategory

} = require('../controller/categoryController');

//add a category
router.post('/add', isAuth, addCategory);

//add all category
router.post('/add/all', isAuth, addAllCategory);

//get only showing category
router.get('/show', getShowingCategory);

//get all category
router.get('/', getAllCategory);
//get all category
router.get('/all', getAllCategories);

//get a category
router.get('/:id', getCategoryById);

//update a category
router.put('/:id', isAuth, updateCategory);

//show/hide a category
router.put('/status/:id', isAuth, updateStatus);

//delete a category
router.delete('/:id', isAuth, deleteCategory);

// delete many category
router.patch('/delete/many', isAuth, deleteManyCategory);

// update many category
router.patch('/update/many', isAuth, updateManyCategory);

module.exports = router;
