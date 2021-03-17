import React, { useState } from 'react';
import classNames from 'classnames';
import currency from 'currency.js';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    paddingTop: 0,
    paddingBottom: 0,
  },
  done: {
    color: '#999',
  },
  dragHandle: {
    minWidth: 'auto',
  },
  checkbox: {
    padding: '10px',
  },
  label: {
    width: 'calc(100% - ' + theme.spacing(2) + 'px)',
    marginRight: theme.spacing(2),
  },
  amountWrapper: {
    width: '120px',
    marginRight: theme.spacing(2),
    flexGrow: 0,
    '& input': {
      textAlign: 'right',
    },
  },
  textField: {
    '& input': {
      padding: '4px 0',
    },
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
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    '& > * + *': {
      paddingLeft: theme.spacing(2),
    },
    '&:last-child': {
      paddingBottom: theme.spacing(1)
    }
  },
}));

export default function Item(props) {
  const { item, onChange, onDelete } = props;
  const classes = useStyles();
  const [label, setLabel] = useState(item.label);
  const [amount, setAmount] = useState(currency(item.amount).format());
  const [done, setDone] = useState(item.done);

  const handleChangeLabel = event => {
    setLabel(event.target.value);
  };

  const handleBlurLabel = () => {
    item.label = label;
    onChange(item);
  };

  const handleChangeAmount = event => {
    setAmount(event.target.value);
  };

  const handleBlurAmount = () => {
    const parsedAmount = currency(amount);
    
    if (parsedAmount.format() != amount.toString()) {
      setAmount(parsedAmount.format());
    }

    item.amount = parsedAmount.value;
    onChange(item);
  };

  const handleChangeDone = event => {
    setDone(event.target.checked);
    item.done = event.target.checked;
    onChange(item);
  };

  const handleRemoveItem = () => {
    onDelete(item);
  };

  return (
    <ListItem
      role={undefined}
      dense
      className={classes.root}
    >
      <ListItemIcon className={classes.dragHandle}>
        <IconButton
          edge="start"
          aria-label="drag"
          disableRipple
          {...props.dragHandleProps}
        >
          <DragHandleIcon fontSize="small" />
        </IconButton>
      </ListItemIcon>
      <ListItemIcon>
        <Checkbox
          checked={done}
          onChange={handleChangeDone}
          tabIndex={-1}
          className={classes.checkbox}
        />
      </ListItemIcon>
      <ListItemText
        primary={<TextField
          size="small"
          value={label}
          onChange={handleChangeLabel}
          className={classNames([classes.label], [classes.textField])}
          InputProps={{
            onBlur: handleBlurLabel
          }}
        />}
      />
      <ListItemText
        className={classNames(classes.amountWrapper)}
        primary={
        <TextField
          size="small"
          value={amount}
          onChange={handleChangeAmount}
          className={classes.textField}
          InputProps={{
            onBlur: handleBlurAmount
          }}
        />}
      />
      <ListItemText
        className={classNames(classes.balance)}
        primary={
          <Typography
            variant="body1"
            className={classNames({
              [classes.overBudget]: item.balance < 0,
              [classes.done]: done
            })}
          >
            {currency(item.balance).format()}
          </Typography>
        }
      />
      <ListItemText
        className={classNames(classes.balance)}
        primary={
          <Typography
            variant="body1"
            className={classNames({ [classes.done]: done })}
          >
            {currency(item.planned).format()}
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={handleRemoveItem}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
