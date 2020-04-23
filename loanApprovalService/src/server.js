// ./src/server.js
require('dotenv').config();  

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//define express app
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(require("./routes"));

//start the server listening on a port
const port = process.env.LOANAPPROVAL_SERVICE_PORT || 3004;
app.listen(port, () => {
    console.log(`LoanApprovalService is listening on port ${port}`);
});