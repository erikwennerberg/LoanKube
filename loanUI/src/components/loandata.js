import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UserLoanDataService } from '../services/statsservice';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        textAlign: 'center'
    },
    data: {
        border: '2px solid white',
        margin: '10px',
        padding: '10px'
    },
    datadetail: {
        width: '200px'
    },
    reasons: {
        textAlign: 'left'
    },
    approved: {
        color: 'green',
       
    },
    rejected: {
        color: 'red',
       
    },
}));

export default function LoanData() {
    const classes = useStyles();
    const [data, setdata] = React.useState(false);

    React.useEffect(() => {

        async function fetchLoanData() {
            const results = await UserLoanDataService();
            setdata(results.data);
        }
        const dataloop = setInterval(() => {
            fetchLoanData();
        }, 5000);

        //do initial pull of immediately
        fetchLoanData()

        return () => {
            clearInterval(dataloop);
        }

    }, []);

    const approveOrReject = (status) => {
       if (status === 'true')
            return <span className={classes.approved}>approved</span>;
        else
            return <span className={classes.rejected}>rejected</span>;
    };

    const last5apps = () => {

        //console.log(data);

        return data.map((d, key, options) =>
            <Grid container key={d.id}>
                <Grid item xs={3}>{d.modified}</Grid>
                <Grid item xs={1}>{d.id}</Grid>
                <Grid item xs={2}>{approveOrReject(d.status)}</Grid>
                <Grid item className={classes.reasons} xs={5}>{d.reasons}</Grid>
                <Grid item xs={1}>{d.duration.toFixed(2)} ms</Grid>
          </Grid>
        );
        //return "test";
    };

    return (
        <div className={classes.root} >
            <div className={classes.data} >
                {data && last5apps()}
            </div>
        </div >
    )
}