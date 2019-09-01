const router = require("express").Router();
const api = require('../controllers/approvalController');

router.route('/')
.post(api.approveLoanApplication);


module.exports = router;
