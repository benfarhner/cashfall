import React from 'react';
import classNames from 'classnames';
import currency from 'currency.js';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
  grow: {
    flexGrow: 1,
  },
  balance: {
    textAlign: 'right',
    width: '120px',
    marginRight: theme.spacing(2),
    flexGrow: 0,
  },
  overBudget: {
    color: '#900',
  },
}));

export default function BudgetBalance(props) {
  const classes = useStyles();
  const balance = props.balance != null ? props.balance : 0;
  const planned = props.planned != null ? props.planned : 0;

  return (
    <ListItem
      role={undefined}
      dense
      className={classes.root}
    >
      <div className={classes.grow} />
      <ListItemText
        className={classNames(classes.balance)}
        primary={
          <Typography variant="body1">
            <b>Balance</b>
          </Typography>
        }
      />
      <ListItemText
        className={classNames(
          [classes.balance],
          { [classes.overBudget]: balance < 0 }
        )}
        primary={
          <Typography variant="body1">
            {currency(balance).format()}
          </Typography>
        }
      />
      <ListItemText
        className={classes.balance}
        primary={
          <Typography variant="body1">
            {currency(planned).format()}
          </Typography>
        }
      />
      <ListItemSecondaryAction />
    </ListItem>
  );
}
