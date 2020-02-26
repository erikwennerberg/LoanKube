

SELECT a.approved, r.rejected, t.total, (t.total-(a.approved+r.rejected)) as notprocessed
FROM (SELECT count(*) as approved
    FROM applications
    where application_status = 'true') as a,
    (SELECT count(*) as rejected
    FROM applications
    where application_status = 'false') as r,
    (SELECT count(*) as total
    FROM applications) as t

\connect loankube
CREATE TABLE applications (application_id varchar(50) PRIMARY KEY, loan_data VARCHAR (512) UNIQUE NOT NULL, application_status varchar(10), modified TIMESTAMP NULL);
GRANT ALL PRIVILEGES ON TABLE applications TO loankube;
