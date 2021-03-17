import React, { useState } from 'react';
import classNames from 'classnames';
import currency from 'currency.js';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
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
    '& input': {
      textAlign: 'right',
    },
  },
}));

export default function BudgetAmount(props) {
  const { onChange } = props;
  const classes = useStyles();
  const [amount, setAmount] = useState(currency(props.amount).format());

  const handleChangeAmount = event => {
    setAmount(event.target.value);
  };

  const handleBlurAmount = () => {
    const parsedAmount = currency(amount);

    if (parsedAmount.format() != amount.toString()) {
      setAmount(parsedAmount.format());
    }

    onChange(parsedAmount.value);
  };

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
            <b>Income</b>
          </Typography>
        }
      />
      <ListItemText
        className={classNames(classes.balance)}
        primary={
          <TextField
            value={amount}
            onChange={handleChangeAmount}
            InputProps={{
              onBlur: handleBlurAmount
            }}
          />
        }
      />
      <ListItemText
        className={classNames(classes.balance)}
      />
      <ListItemSecondaryAction />
    </ListItem>
  );
}
