import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stats from './stats';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        color: 'white'
    },
    game: {
        border: '1px solid white',
        borderColor: 'gray',
        background: '#001a33'
    },
    highlightgame: {
        border: '1px solid white',
        borderColor: 'gray',
        background: 'black'
    },
    finishedgame: {
        border: '1px solid white',
        borderColor: 'gray',
        background: '#282c34'
    },
    highlight: {
        display: 'flex',
        position: 'absolute',
        zIndex: '100',
        background: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

export default function Main() {
    const classes = useStyles();

    return (
        <div className={classes.root} >
            <Stats />
        </div >
    )
}

