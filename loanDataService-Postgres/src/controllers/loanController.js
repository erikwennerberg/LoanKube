/* loans = `[
     {loanId:"001", creditScore:"700", loanAmount:"120000"},
     {
         loanId:"002", 
         creditScore:"0", 
         loanAmount:"100000", 
         applicationResult:{
             verificationProcess:{result:"false", reason:"rule - missing credit score"}
         }
     },
     {
         loanId:"003", 
         creditScore:"550", 
         loanAmount:"250000", 
         applicationResult:{
             verificationProcess:{result:"true"},
             approvalProcess:{result:"false", reason:"rule - credit score too low"}
         }
     },
     {
         loanId:"004", 
         creditScore:"800", 
         loanAmount:"200000", 
         applicationResult:{
             verificationProcess:{result:"true"},
             approvalProcess:{result:"true"}
         }
     }
 ]`;
*/

getLoanApplication = async (req, resp) => {
    try {
        const loanId = req.query.loanId;
        console.log(`request for loan - ${loanId}`);

        const { Pool } = require('pg');
        const pool = new Pool();

        const res = await pool.query(`select * from applications where application_id='${loanId}'`);
        await pool.end();

        if (res == null || res.rows == null || res.rowCount === 0)
            resp.status(404).send("loan application not found");
        else{
            console.log(res.rows[0]);
            const loan = JSON.parse(res.rows[0].loan_data);
            resp.json(loan);
        }

     

    } catch (error) {
        console.log(error);
        resp.status(500).send("unexpected error retrieving data from Postgres instance");
    }
};
saveLoanApplication = async (req, resp) => {
    try {

        const loan = req.body;
        console.log(`request to save loan - ${loan.loanId}`);

        const { Pool } = require('pg');
        const pool = new Pool();

        let success = null;
        if (loan.applicationResult != null && loan.applicationResult.approvalProcess != null) {
            if (loan.applicationResult.approvalProcess.result)
                success = true;
            else
                success = false;
        }
        const sqlu = `update applications set loan_data='${JSON.stringify(loan)}', application_status=${success} where application_id='${loan.loanId}'`
        console.log(sqlu)
        const res1 = await pool.query(sqlu);
        
        console.log(res1.rowCount);
        if (res1 == null || res1.rowCount == 0) {
            const sql = `insert into applications (application_id, loan_data) values ('${loan.loanId}','${JSON.stringify(loan)}')`;
            console.log(sql);
            const res2 = await pool.query(sql);
        }

        await pool.end();

        console.log("success saving");
        resp.sendStatus(200);
    } catch (error) {
        console.log(error);
    }
};
getLoanMetrics = async (req, resp) => {
    try {
        console.log(`request for loan metrics`);

        const { Pool } = require('pg');
        const pool = new Pool();

        const query = `SELECT a.approved, r.rejected, t.total, (t.total-(a.approved+r.rejected)) as notprocessed 
 FROM (SELECT count(*) as approved FROM applications where application_status='true') as a,
 (SELECT count(*) as rejected FROM applications where application_status='false') as r,
 (SELECT count(*) as total FROM applications) as t`

        const res = await pool.query(query);
        if (res == null) {
            resp.status(404).send("metrics returned empty from data store");
        }
        else {
            const metrics = {};
            metrics.approvedTotal = res.rows[0].approved;
            metrics.rejectedTotal = res.rows[0].rejected;
            metrics.notprocessed = res.rows[0].notprocessed;
            metrics.total = res.rows[0].total;
            resp.json(metrics);
        }

        await pool.end();

    } catch (error) {
        console.log(error);
        resp.status(500).send("failed to retrieve metrics from data store");
    }
};


module.exports = {
    getLoanApplication,
    saveLoanApplication,
    getLoanMetrics
}