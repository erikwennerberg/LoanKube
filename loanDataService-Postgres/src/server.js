// ./src/server.js
require('dotenv').config()  
require('./instrumentation.js');

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//define express app
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(require("./routes"));

//start the server listening on a port
const port = process.env.LOANDATA_SERVICE_PORT || 80;
app.listen(port, () => {
    console.log(`LoanDataService for Postgres is listening on port ${port}`);
});