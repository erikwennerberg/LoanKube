#!/bin/bash

sed -i 's/${process.env.LOANDATA_SERVICE}/'$1'/' src/setupProxy.js
sed -i 's/${process.env.LOANPROCESSOR_SERVICE}/'$2'/' src/setupProxy.js
npm start