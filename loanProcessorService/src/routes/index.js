const router = require("express").Router();
const api = require('../controllers/processController');

router.route('/')
.post(api.processLoanApplication);


module.exports = router;
