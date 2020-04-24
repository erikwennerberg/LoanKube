import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MetricsService } from '../services/statsservice';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        textAlign: 'center'
    },
    metric: {
        border: '2px solid white',
        margin: '10px',
        padding: '10px'
    },
    number: {
       
    },
    label: {
        textAlign: 'center'
    },
    total: {
        fontSize:'36px'
    },
    approved: {
        color: 'green',
        fontSize:'36px'
    },
    rejected: {
        color: 'red',
        fontSize:'36px'
    },
    invalid: {
        color: 'gray',
        fontSize:'36px'
    },
    statistics: {
    }
}));

export default function Stats() {
    const classes = useStyles();
    const [stats, setstats] = React.useState(false);

    React.useEffect(() => {

        async function fetchStatistics() {
            const results = await MetricsService();
            setstats(results.data);
        }
        const statsloop = setInterval(() => {
            fetchStatistics();
        }, 5000);

        //do initial pull of immediately
        fetchStatistics()

        return () => {
            clearInterval(statsloop);
        }

    }, []);


    const statsbuilder = () => {

        return <div className={classes.statistics}>
            <div className={classes.metric}>
                <div className={classes.label}>Total Applications Received:</div>
                <div className={classes.total}>{stats.total}</div>
            </div>
            <div className={classes.metric}>
                <div className={classes.label}>Loan Applications Approved:</div>
                <div className={classes.approved}>{`${stats.approvedTotal}  -  ${(stats.approvedTotal * 100.00 / (stats.total)).toFixed(2)}%`}</div>
            </div>
            <div className={classes.metric}>
                <div className={classes.label}>Loan Applications Rejected:</div>
                <div className={classes.rejected}>{`${stats.rejectedTotal}  -  ${(stats.rejectedTotal * 100.00 / (stats.total)).toFixed(2)}%`}</div>
            </div>
            <div className={classes.metric}>
                <div className={classes.label}>Invalid Applications:</div>
                <div className={classes.invalid}>{`${stats.notprocessed}  -  ${(stats.notprocessed * 100.00 / (stats.total)).toFixed(2)}%`}</div>
            </div>
        </div>;
    }

    return (
        <div className={classes.root} >
            {stats && statsbuilder()}
        </div >
    )
}