# Loan Kube
Forked the Loan Kube Test application for use with docker-compose. 
The app has been instrumented with OTEL to show dsitributed tracing and business observability use cases.
See the individual Deployment sections for more details.
This application simulates a rudimentary workflow a bank loan application, through user submission, verification of the loan application, and approval process.  Data is persisted in a ephemeral Postgres database.

Instead of a single monolithic application, this demo showcases a basic microservice approach - intent on how multiple services could be developed, executed, and integrated independent from each other.

This solution should not be used in a production environment.  It should be used to highlight microservices, containers, and container orchestration capabilities.


## Stucture
The Loan Kube demo application is broken into 6 components.

### Postgres Database
The supported backend data store for the application.  By default, the demo does not persist data to disk beyond what is stored in the container.  **Once the container is restarted/recreated, the previous sessions loan applications would be unavailable.**

The Postgres database should not be considered a secure data store.  It uses *POSTGRES_HOST_AUTH_METHOD=trust* so it is completely accessible without user authentication.

### LoanData Service
LoanData is a NodeJs API service that provides a single entrypoint into the Postgre backend.  It is the onlly component that interacts directly with the backend data store.

For testing purposes, by default, port *3000* is exposed outside of the application (internal port 80 for the container).  However, the port does not NEED to be exposed as the only interaction should be from the LoanUI web application.  That communication is proxied within the container sub-network.

### LoanVerification Service
LoanVerification is a NodeJs API service that evaluates incoming loan applications and test for completeness and accuracy in the application.

Currently, there is only 3 fields in the demo loan application - *loanId*, *creditScore*, and *loanAmount*.  
* *loanId* is checked that it exists
* *creditScore* is checked that is exists, is a number, and within an acceptable range (450-850)
* *loanAmount* is checked that is exists, is a number, and within an accetable range (1000, 10000000)

### LoanApproval Service
LoanApproval is a NodeJs API service that provides the calculation as to if the loan will be rejected or approved.  The loan should have passed through the LoanVerification process **first**.

The calculation applies a elementary sliding scale based on credit score worthiness (higher being better) against some loan amount (higher is more difficult to obtain).  The calculation is for **demo purposes only**!

If rejected, it will return an indicator that look something like 92.8763221 or 103.23094.  If the indicator is above 100, the loan is approved, otherwise, it is rejected.

### LoanProcessor
LoanProcessor is a NodeJs API service that is the entrypoint for the loan application process.  It will initially persist the application (via the LoanData service), and then forward along to the LoanVerification and LoanApproval processes appropriately.

The LoanProcessor also initiates the starting time for a loan application to evaluate processing time.  Successive processes support the ending time.

For testing purposes, by default, port *3006* is exposed outside of the application (internal port 80 for the container).  However, the port does not NEED to be exposed as the only interaction should be from the LoanUI web application.  That communication is proxied within the container sub-network.

### Observability / OTEL
This application is pre-instrumented with OTEL for Node.js. Each micro-service has an instrumentation.js file containing all the needed instrumentation. There are also cusotm span attributes with business metrics being added throughout. 
To collect the OTEL telemtry, this app has been setup with Grafana Alloy which will be spun up automatically as an OTEL collector with docker compose. config.alloy has the collector specific configuration and will need to be setup with a remote write endpoint for the telemetry. 

### Load Testing
I created k6-create-loans.js for simulating load. It can be run with k6 OSS or k6 cloud. 


## Deployment

## Docker-Compose

## Pre-requisites
Docker and docker-compose should be installed and correctly configured.

## Deploy Application
The docker compose installation is meant to be completely self-contained without any need for additional configuration to deploy.

After cloning this project, navigate to the root application folder and execute:
```
docker-compose up -d --build
```

The *--build* command will build the container images prior to deploying to local Docker instance.

This will build and install the 6 container images (described above) into Docker.

To cleanup the project, from the same folder execute:
```
docker-compose down
```


