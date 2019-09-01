const router = require("express").Router();
const api = require('../controllers/verificationController');

router.route('/')
.post(api.verifyLoanApplication);


module.exports = router;
