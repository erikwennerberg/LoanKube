const axios = require('axios')
const ru = require('../utility/request');
const { sleep } = require('../utility/sleep');
const random = require('../utility/random');


approveLoanApplication = async (req, resp) => {
    try {

        //loan Id from params
        var loandId = req.query.loanId;

        //get loan application from data store
        let response1 = await axios.get(`http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}/?loanId=${loandId}`)
        if (response1.status !== 200)
            return ru.error(resp, response1);

        //approve loan
        var loan = response1.data;
        var approval = approveLoan(loan);

        //include results in loan application
        if (loan.applicationResult == null)
            loan.applicationResult = {};
        loan.applicationResult.approvalProcess = approval;

        //save updated loan application into data store
        let response2 = await axios.post(`http://${process.env.LOANDATA_SERVICE_HOST}:${process.env.LOANDATA_SERVICE_PORT}`, JSON.stringify(loan), { headers: { "Content-Type": "application/json" } });
        if (response2.status !== 200)
            return ru.error(resp, response2);

        //fake time delay to allow real world differences
        //await sleep(random.weightedRandom(2000, 2));
        var val = 0;
        for (let i = 0; i < 30000; i++) 
            for (let x = 0; x < 10000; x++) 
                val = i-x
        console.log(val)

        //send just validation result
        resp.status(200).send(JSON.stringify(approval));

    } catch (error) {
        console.log(error);
        resp.status(500).send("unexpected error");
    }
};


approveLoan = (loan) => {
    if (loan == null)
        return { result: false, reason: "missing loan object" };

    if (loan.applicationResult == null || loan.applicationResult.verificationProcess == null)
        return { result: false, reason: "loan has not passed verification process yet" };

    const indicator = Math.random() * 10;
    let chance = 0;

    //amount factor
    if (Number(loan.loanAmount) > 5000000)
        chance = 10;
    else if (Number(loan.loanAmount) > 1000000)
        chance = 35;
    else if (Number(loan.loanAmount) > 500000)
        chance = 50;
    else if (Number(loan.loanAmount) > 250000)
        chance = 75;
    else if (Number(loan.loanAmount) > 50000)
        chance = 85;
    else
        chance = 95;

    //credit score factor
    if (Number(loan.creditScore) >= 800)
        chance += 95;
    else if (Number(loan.creditScore) >= 700)
        chance += 75;
    else if (Number(loan.creditScore) >= 600)
        chance += 45;
    else if (Number(loan.creditScore) >= 500)
        chance += 20;
    else
        chance += 8;

    const result = chance - indicator;
    console.log(`factor is ${result}; approved is ${result >= 100}; chance is ${chance}; indicator is ${indicator}`);

    if (result < 100)
        return { result: false, reason: `rule - approval formula was insufficent - ${result}` };

    return { result: true };
};

module.exports = {
    approveLoanApplication
}