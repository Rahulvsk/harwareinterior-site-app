const express = require('express');
const router = express.Router();
const { isAuth } = require("../config/auth");

const {
  addLanguage,
  addAllLanguage,
  getAllLanguages,
  getShowingLanguage,
  getLanguageById,
  updateLanguage,
  updateStatus,
  deleteLanguage,
  updateManyLanguage,
  deleteManyLanguage,
} = require('../controller/languageController');

// add a language
router.post('/add', isAuth, addLanguage);

// add all language
router.post('/add/all', isAuth, addAllLanguage);

// get only showing language
router.get('/show', getShowingLanguage);

// get all language
router.get('/all', getAllLanguages);

// get a language
router.get('/:id', getLanguageById);

// update a language
router.put('/:id', isAuth, updateLanguage);

// update many language
router.patch('/update/many', isAuth, updateManyLanguage);

// show/hide a language
router.put('/status/:id', isAuth, updateStatus);

// delete a language
router.patch('/:id', isAuth, deleteLanguage);

//delete many language
router.patch('/delete/many', isAuth, deleteManyLanguage);

module.exports = router;
