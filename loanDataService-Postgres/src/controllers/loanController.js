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
        const sqlu = `update applications set loan_data='${JSON.stringify(loan)}', application_status=${success}, modified=now(), start=to_timestamp(${loan.start} / 1000.0) where application_id='${loan.loanId}'`
        console.log(sqlu)
        const res1 = await pool.query(sqlu);
        
        console.log(res1.rowCount);
        if (res1 == null || res1.rowCount == 0) {
            const sql = `insert into applications (application_id, loan_data, modified, start) values ('${loan.loanId}','${JSON.stringify(loan)}',now(), to_timestamp(${loan.start} / 1000.0))`;
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
        //console.log(`request for loan metrics`);

        const { Pool } = require('pg');
        const pool = new Pool();

        const query = `SELECT a.approved, r.rejected, t.total, (t.total-(a.approved+r.rejected)) as notprocessed,td.total_duration 
 FROM (SELECT count(*) as approved FROM applications where application_status='true') as a,
 (SELECT count(*) as rejected FROM applications where application_status='false') as r,
 (SELECT count(*) as total FROM applications) as t,
 (SELECT avg(extract(epoch from (x.modified-x.start))*1000) as total_duration FROM (select modified, start from applications order by modified desc limit 10) as x) as td`

// (SELECT avg(extract(epoch from (modified-start))*1000) as approve_duration FROM applications where application_status='true' limit 10) as ad,
// (SELECT avg(extract(epoch from (modified-start))*1000) as reject_duration FROM applications where application_status='false' limit 10) as rd,


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
            //metrics.approvedDuration = res.rows[0].approve_duration;
            //metrics.rejectedDuration = res.rows[0].reject_duration;
            metrics.totalDuration = res.rows[0].total_duration;
            resp.json(metrics);
        }

        await pool.end();

    } catch (error) {
        console.log(error);
        resp.status(500).send("failed to retrieve metrics from data store");
    }
};

getLoanData = async (req, resp) => {
    try {
        //console.log(`request for last 5 u-loan applications`);

        const { Pool } = require('pg');
        const pool = new Pool();

        //where lower(substring('loan_data' from 1 for 1))='{"loanid":"u'
        const query = `select application_id, loan_data, application_status, 
                        modified, start, extract(epoch from (modified-start))*1000 as duration
                        from applications
                        where lower(substring(application_id from 1 for 1))='u'
                        order by modified desc
                        limit 5`

        const res = await pool.query(query);
        if (res == null) {
            resp.status(404).send("metrics returned empty from data store");
        }
        else {
            const data = [];
            res.rows.forEach(row => {
                var reasons = "";
                var details = JSON.parse(row.loan_data);
                if (details.applicationResult.verificationProcess && !details.applicationResult.verificationProcess.result)
                    reasons += `verification - ${details.applicationResult.verificationProcess.reason}\n`;
                if (details.applicationResult.approvalProcess && !details.applicationResult.approvalProcess.result)
                    reasons += `approval - ${details.applicationResult.approvalProcess.reason}`;
                data.push({id:row.application_id,loandata : row.loan_data,
                    status : row.application_status, 
                    modified : row.modified, 
                    reasons:reasons, start: row.start,
                    duration: row.duration });
            });
            resp.json(data);
        }

        await pool.end();

    } catch (error) {
        console.log(error);
        resp.status(500).send("failed to retrieve last 5 u-loan applications");
    }
};



module.exports = {
    getLoanApplication,
    saveLoanApplication,
    getLoanMetrics,
    getLoanData
}