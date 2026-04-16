const express = require("express");
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { categorySchema } = require("../validations/category.validation");

router.use(protect);

router.route("/")
  .get(getCategories)
  .post(validate(categorySchema), createCategory);

router.route("/:id")
  .patch(validate(categorySchema), updateCategory)
  .delete(deleteCategory);

module.exports = router;
