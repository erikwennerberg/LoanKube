const axios = require('axios')
const ru = require('../utility/request');
const { sleep } = require('../utility/sleep');
const random = require('../utility/random');


validateLoan = (loan) => {
    if (loan == null)
        return { result: false, reason: "missing loan object" };

    if (loan.creditScore == null || isNaN(loan.creditScore))
        return { result: false, reason: "rule - missing credit score" };

    if (Number(loan.creditScore) < 450 || Number(loan.creditScore) > 850)
        return { result: false, reason: "rule - credit score is out of range (450-850)" };

    if (loan.loanAmount == null || isNaN(loan.loanAmount))
        return { result: false, reason: "rule - missing loan amount" };

    if (Number(loan.loanAmount) < 1000 || Number(loan.loanAmount) > 10000000)
        return { result: false, reason: "rule - loan amount is out of range (1K-10M)" };


    console.log(`loan verification passed - ${loan.loanId}`);
    return { result: true };
};

verifyLoanApplication = async (req, resp) => {
    try {

        //loan Id from params
        var loanId = req.query.loanId;
       
        //get loan application from data store
        let response1 = await axios.get(`http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}/?loanId=${loanId}`)
        if (response1.status !== 200)
            return ru.error(resp, response1);

        //verify loan
        var loan = response1.data;
        var validation = validateLoan(loan);

        //include results in loan application
        if (loan.applicationResult == null)
            loan.applicationResult = {};
        loan.applicationResult.verificationProcess = validation;

        //save updated loan application into data store
        let response2 = await axios.post(`http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}`, JSON.stringify(loan), { headers: { "Content-Type": "application/json" } });
        if (response2.status !== 200)
            return ru.error(resp, response2);


        //fake time delay to allow real world differences
        //await sleep(random.weightedRandom(2000, 2));

        //send just validation result
        resp.status(200).send(JSON.stringify(validation));

    } catch (error) {
        console.log(error);
        resp.status(500).send("unexpected error");
    }
};





module.exports = {
    verifyLoanApplication
}