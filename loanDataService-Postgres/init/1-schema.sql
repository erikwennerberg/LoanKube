CREATE TABLE applications (application_id varchar(50) PRIMARY KEY, loan_data VARCHAR (512) UNIQUE NOT NULL, application_status varchar(10), modified TIMESTAMP NULL,start TIMESTAMP NULL);
