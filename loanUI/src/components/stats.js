import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import  StatsService  from '../services/statsservice';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        marginTop: '5px'
    },
    label: {
        marginLeft: '5px',
        textAlign: 'left'
    },
    total: {
        textAlign: 'center'
    },
    approved: {
        color: 'white',
        textAlign: 'right'
    },
    rejected: {
        color: 'red',
        fontSize: '12px'
    },
    invalid: {
        color: 'gray',
        fontSize: '12px'
    },
    statistics: {
        fontSize: '8px'
    }
}));

export default function Stats() {
    const classes = useStyles();
    const [stats, setstats] = React.useState(false);

    React.useEffect(() => {

        async function fetchStatistics() {
            const results = await StatsService();
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

        /* metrics.approvedTotal = res.rows[0].approved;
            metrics.rejectedTotal = res.rows[0].rejected;
            metrics.notprocessed = res.rows[0].notprocessed;
            metrics.total = res.rows[0].total;*/
        return <div className={classes.statistics}>
            <div>
                <div className={classes.label}>Total Applications Received:</div>
                <div className={classes.total}>{stats.total}</div>
            </div>
            <div>
                <div className={classes.label}>Loan Applications Approved:</div>
                <div className={classes.approved}>{stats.approvedTotal}</div>
                <div className={classes.approved}>{stats.approvedTotal * 100.00 / stats.total + .001}%</div>
            </div>
            <div>
                <div className={classes.label}>Loan Applications Rejected:</div>
                <div className={classes.rejected}>{stats.rejectedTotal}</div>
                <div className={classes.rejected}>{stats.rejectedTotal * 100.00 / stats.total + .001}%</div>
            </div>
            <div>
                <div className={classes.label}>Invalid Applications:</div>
                <div className={classes.invalid}>{stats.notprocessed}</div>
                <div className={classes.rejected}>{stats.notprocessed * 100.00 / stats.total + .01}%</div>
            </div>
        </div>;
    }

    return (
        <div className={classes.root} >
            {stats && statsbuilder()}
        </div >
    )
}