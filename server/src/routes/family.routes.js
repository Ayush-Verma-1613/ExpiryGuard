const express = require("express");
const router = express.Router();
const { getMembers, createMember, updateMember, deleteMember } = require("../controllers/family.controller");
const protect = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { familyMemberSchema } = require("../validations/family.validation");

router.use(protect);

router.route("/")
  .get(getMembers)
  .post(validate(familyMemberSchema), createMember);

router.route("/:id")
  .patch(validate(familyMemberSchema), updateMember)
  .delete(deleteMember);

module.exports = router;
