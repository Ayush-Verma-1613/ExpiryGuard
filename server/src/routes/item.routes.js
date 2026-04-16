const express = require("express");
const router = express.Router();
const { getItems, getItem, createItem, updateItem, deleteItem } = require("../controllers/item.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { itemSchema, itemUpdateSchema } = require("../validations/item.validation");

router.use(protect);

router.route("/")
  .get(getItems)
  .post(validate(itemSchema), createItem);

router.route("/:id")
  .get(getItem)
  .patch(validate(itemUpdateSchema), updateItem)
  .delete(deleteItem);

module.exports = router;
