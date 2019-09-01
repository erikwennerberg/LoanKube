const router = require("express").Router();
const api = require('../controllers/loanController');

router.route('/')
    .get(api.getLoanApplication)
    .post(api.saveLoanApplication);

router.route('/metrics')
    .get(api.getLoanMetrics);


module.exports = router;
