const express = require('express');
const router = express.Router();
const { isAuth } = require("../config/auth");
const {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getShowingCoupons,
  getCouponById,
  updateCoupon,
  updateStatus,
  deleteCoupon,
  updateManyCoupons,
  deleteManyCoupons,
} = require('../controller/couponController');

//add a coupon
router.post('/add', isAuth, addCoupon);

//add multiple coupon
router.post('/add/all', isAuth, addAllCoupon);

//get all coupon
router.get('/', getAllCoupons);

//get only enable coupon
router.get('/show', getShowingCoupons);

//get a coupon
router.get('/:id', getCouponById);

//update a coupon
router.put('/:id', isAuth, updateCoupon);

//update many coupon
router.patch('/update/many', isAuth, updateManyCoupons);

//show/hide a coupon
router.put('/status/:id', isAuth, updateStatus);

//delete a coupon
router.delete('/:id', isAuth, deleteCoupon);

//delete many coupon
router.patch('/delete/many', isAuth, deleteManyCoupons);

module.exports = router;
