import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stats from './stats';
import LoanData from './loandata'
import Submitter from './submitter'
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: 'white',
        fontSize: '16px',
        marginTop: '10px',
        marginLeft: '100px',
        marginRight: '100px'
    },
}));

export default function Main() {
    const classes = useStyles();

    return (
        <div className={classes.root} >
            <Grid container>
                {/* <Grid item xs={3}><Stats /></Grid> */}
                <Grid item xs={9}><Submitter /></Grid>
            </Grid>
            {/* <LoanData /> */}
        </div >
    )
}

