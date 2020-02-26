# LoanKube
Test application for use on Kubernetes or Openshift


# MiniShift
*Please note that I am using generic passwords in the documenation.  Obviously, change at will.*

## Install MiniShift
Local, single node, OpenShift development instance
[Minishift](https://www.okd.io/minishift/)

## Deploy Application

### Postgres Database (no backend storage defined...will use temporary storage while it is running and remove it when the pod is stopped)
```
oc new-app -e POSTGRESQL_USER=loankube -e POSTGRESQL_PASSWORD=loankube -e POSTGRESQL_DATABASE=loankube --name=postgresql postgresql
```

#### Initialize Database
We'll want to make this run as an Init container in the future
Get running Postgresql pod

```
oc get pods
```  
```
oc rsh postgresql-1-czdh4  # replace with your pod name
``` 

Once exe'd into the pod, run psql from the command prompt and init database with the following commands:  
``` 
psql
``` 
```
/connect loankube
CREATE TABLE applications (application_id varchar(50) PRIMARY KEY, loan_data VARCHAR (512) UNIQUE NOT NULL, application_status varchar(10), modified TIMESTAMP NULL);
GRANT ALL PRIVILEGES ON TABLE applications TO loankube;
/q

```
And lastly, exit out of the pod.

### LoanKube Application
#### Data Service
```
oc new-app https://github.com/Guarrdon/LoanKube.git --context-dir=loanDataService-Postgres --name=loan-data -e PGHOST=postgresql -e PGUSER=loankube -e PGDATABASE=loankube -e PGPASSWORD=loankube -e PGPORT=5432
```
#### Verification Service
```
oc new-app https://github.com/Guarrdon/LoanKube.git --context-dir=loanVerificationService --name=loan-verification -e LOANDATA_SERVICE_HOST=loan-data LOANDATA_SERVICE_PORT=8000
```
#### Data Service
```
oc new-app https://github.com/Guarrdon/LoanKube.git --context-dir=loanApprovalService --name=loan-approval -e LOANDATA_SERVICE_HOST=loan-data LOANDATA_SERVICE_PORT=8000
```
#### Processor Service
```
oc new-app https://github.com/Guarrdon/LoanKube.git --context-dir=loanProcessorService --name=loan-processor \
-e LOANDATA_SERVICE_HOST=loan-data LOANDATA_SERVICE_PORT=8000 \
-e LOANVERIFICATION_SERVICE_HOST=loan-verification LOANVERIFICATION_SERVICE_PORT=8000 \
-e LOANAPPROVAL_SERVICE_HOST=loan-approval LOANAPPROVAL_SERVICE_PORT=8000
```

### Finally, exose the processor service.
### If you would like to see the back-end data store, expose the data service as well.

