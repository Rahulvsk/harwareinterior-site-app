const router = require("express").Router();
const { isAuth, isStoreApiKey } = require("../config/auth");
const {
  addGlobalSetting,
  getGlobalSetting,
  updateGlobalSetting,
  addStoreSetting,
  getStoreSetting,
  getStoreSecretKeys,
  updateStoreSetting,
  getStoreSeoSetting,
  addStoreCustomizationSetting,
  getStoreCustomizationSetting,
  updateStoreCustomizationSetting,
} = require("../controller/settingController");

/**
 * Global Settings
 */
router
  .route("/global")
  .post(isAuth, addGlobalSetting) // POST /global
  .get(getGlobalSetting) // GET /global
  .put(isAuth, updateGlobalSetting); // PUT /global

/**
 * Store Settings
 */
router
  .route("/store-setting")
  .post(isAuth, addStoreSetting) // POST /store-setting
  .get(getStoreSetting) // GET /store-setting
  .put(isAuth, updateStoreSetting); // PUT /store-setting

// Returns payment/OAuth SECRET keys. Guarded by an optional shared secret
// (STORE_API_SECRET) so it is not world-readable once configured.
router.get("/store-setting/keys", isStoreApiKey, getStoreSecretKeys); // GET /store-setting/keys
router.get("/store-setting/seo", getStoreSeoSetting); // GET /store-setting/seo

/**
 * Store Customization
 */
router
  .route("/store/customization")
  .post(isAuth, addStoreCustomizationSetting) // POST /store/customization
  .get(getStoreCustomizationSetting) // GET /store/customization
  .put(isAuth, updateStoreCustomizationSetting); // PUT /store/customization

module.exports = router;
