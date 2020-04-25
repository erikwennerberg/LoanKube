import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { SubmitLoanService } from '../services/submitloanservice';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        textAlign: 'center',
        height: '100%'
    },
    userinput: {
        border: '2px solid white',
        margin: '10px',
        padding: '10px',
        height: '100%',
        background: 'white',
        color: 'black'
    },
   
    margin: {
        marginTop:'20px',
        marginBottom:'20px',
    },


}));

export default function Submitter() {
    const classes = useStyles();
    const [app, setapp] = React.useState({
        loanAmount: '',
        creditScore: '',
        id: 100,
        loanId: 'u100'
    });

    React.useEffect(() => {

    }, []);


    const setNextUser = () => {
        var i = app.id + 1;
        var appid = "u" + i;
        setapp({ ...app, loanId: appid, id:i, creditScore:'',loanAmount:'' });
    }

    const clear = () => {
        setNextUser();
    }
    const submit = async () => {
        const result = await SubmitLoanService(app);
        //todo:flash result in snackbar tray
        clear();
        return result;
    }
    const handleChange = (prop) => (event) => {
        setapp({ ...app, [prop]: event.target.value });
    };


    return (
        <div className={classes.root} >
            <div className={classes.userinput}>
                Submit a Loan Application
                <FormControl fullWidth className={classes.margin}  variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-id">Loan Application ID</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-id"
                        value={app.loanId}
                        labelWidth={150}
                        disabled
                    />
                </FormControl>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-credit">Credit Score</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-credit"
                        value={app.creditScore}
                        onChange={handleChange('creditScore')}
                        labelWidth={100}
                    />
                </FormControl>
                <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        value={app.loanAmount}
                        onChange={handleChange('loanAmount')}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        labelWidth={60}
                    />
                </FormControl>
                <Grid container>
                    <Grid item xs={6}><Button variant="contained" color="secondary" onClick={() => clear()}>Clear</Button></Grid>
                    <Grid item xs={6}><Button variant="contained" color="primary" onClick={() => submit()}>Submit Loan Application</Button></Grid>
                </Grid>
            </div>

        </div >
    )
}