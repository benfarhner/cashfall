import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import currency from 'currency.js';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
import BudgetAmount from './budget-amount';
import BudgetHeading from './budget-heading';
import BudgetBalance from './budget-balance';
import BudgetItem from './item';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const STATE_KEY = 'cashfall';

const getState = () => {
  const state = localStorage.getItem(STATE_KEY);

  if (state == null) {
    return {
      budget: 0,
      items: [],
      balance: 0,
      planned: 0,
    };
  }

  return JSON.parse(state);
}

const saveState = state => {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

const getItemStyle = (isDragging, draggableStyle) => ({
  boxShadow: isDragging ?
    'rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px' :
    'none',

  // styles we need to apply on draggables
  ...draggableStyle
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const calculateTotals = (items, amount) => {
  let balance = amount;
  let planned = 0;

  // Recalculate balance
  items.forEach(item => {
    balance -= item.amount;
    item.balance = balance;

    planned += item.amount;
    item.planned = planned;
  });

  return {
    balance,
    planned
  };
};

export default function Budget() {
  const state = getState();
  const classes = useStyles();
  const [budget, setBudget] = useState(state.budget);
  const [items, setItems] = useState(state.items);
  const [balance, setBalance] = useState(state.balance);
  const [planned, setPlanned] = useState(state.planned);

  useEffect(() => {
    saveState({ budget, items, balance, planned} );
  }, [budget, items, balance, planned]);

  const handleBudgetChange = newBudget => {
    const newItems = Array.from(items);
    const totals = calculateTotals(newItems, newBudget);

    setBudget(newBudget);
    setItems(newItems);
    setBalance(totals.balance);
    setPlanned(totals.planned);
  };

  const handleChangeItem = (item, index) => {
    const newItems = Array.from(items);
    newItems[index] = item;

    const totals = calculateTotals(newItems, budget);
    
    setItems(newItems);
    setBalance(totals.balance);
    setPlanned(totals.planned);
  }

  const handleDeleteItem = (item, index) => {
    const newItems = Array.from(items);
    newItems.splice(index, 1);
    
    const totals = calculateTotals(newItems, budget);
    
    setItems(newItems);
    setBalance(totals.balance);
    setPlanned(totals.planned);
  }

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      label: 'New item',
      amount: 0,
      balance: 0,
      done: false,
    };

    const newItems = Array.from(items);
    newItems.push(newItem);
    
    const totals = calculateTotals(newItems, budget);
    
    setItems(newItems);
    setBalance(totals.balance);
    setPlanned(totals.planned);
  };

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    
    const totals = calculateTotals(newItems, budget);
    
    setItems(newItems);
    setBalance(totals.balance);
    setPlanned(totals.planned);
  }

  console.log(state);

  return (
    <Container maxWidth="md">
      <List dense>
        <BudgetHeading />
        <BudgetAmount
          amount={budget}
          onChange={handleBudgetChange}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <BudgetItem
                          dragHandleProps={provided.dragHandleProps}
                          item={item}
                          onChange={(item) => handleChangeItem(item, index)}
                          onDelete={(item) => handleDeleteItem(item, index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <BudgetHeading />
      </List>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={handleAddItem}
      >
        <AddIcon />
      </Fab>
    </Container>
  )
}