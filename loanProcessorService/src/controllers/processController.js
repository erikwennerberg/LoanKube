const axios = require('axios')
const ru = require('../utility/request');


processLoanApplication = async (req, resp) => {
    try {

        //loan application from body
        var loan = req.body;
        if (loan == null || loan.loanId == null || loan.loanId === "")
            return ru.error(resp, null, "loan does not contain valid loanId");
        console.log(`loan being processed - ${loan.loanId}`);

        //save loan application to data source
        console.log("persist loan process");
        loan.start = Date.now();
        let response1 = await axios.post(`http://${process.env.LOANDATA_SERVICE}`, JSON.stringify(loan), { headers: { "Content-Type": "application/json" } });
        if (response1.status !== 200)
            return ru.error(resp, response1);
        console.log(`loan application persisted - ${loan.loanId}`);

        //verify loan application
        console.log("verify loan process");
        let response2 = await axios.post(`http://${process.env.LOANVERIFICATION_SERVICE}/?loanId=${loan.loanId}`)
        if (response2.status !== 200)
            return ru.error(resp, response2);
        if (!response2.data.result)
            return ru.complete(resp, null, response2.data);
        console.log(`loan application verified - ${loan.loanId}`);

        //approve loan if verification passed
        console.log("approve loan process");
        let response3 = await axios.post(`http://${process.env.LOANAPPROVAL_SERVICE}/?loanId=${loan.loanId}`)
        if (response3.status !== 200)
            return ru.error(resp, response3);

        if (!response3.data.result)
            return ru.complete(resp, null, JSON.stringify(response3.data));
        else
            return ru.complete(resp, null, "loan application approved");

    } catch (error) {
        console.log(error);
        resp.status(500).send("unexpected error");
    }
};



module.exports = {
    processLoanApplication
}