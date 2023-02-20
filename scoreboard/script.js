// define action types
const INCREMENT_SCORE = "INCREMENT_SCORE";
const DECREMENT_SCORE = "DECREMENT_SCORE";
const RESET_SCORES = "RESET_SCORES";
const ADD_MATCH = "ADD_MATCH";
const DELETE_MATCH = "DELETE_MATCH";
const UPDATE_SCORE = "UPDATE_SCORE";

// define action creators
const incrementScore = (index, value) => {
  return {
    type: INCREMENT_SCORE,
    payload: { index, value },
  };
};

const decrementScore = (index, value) => {
  return {
    type: DECREMENT_SCORE,
    payload: { index, value },
  };
};

const resetScores = () => {
  return {
    type: RESET_SCORES,
  };
};

const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};

const deleteMatch = (index) => {
  return {
    type: DELETE_MATCH,
    payload: { index },
  };
};

const updateScore = (index, score) => {
  store.dispatch({ type: "UPDATE_SCORE", payload: { index, score } });
};

// define initial state
const initialState = {
  matches: [{ score: 0 }],
};

// define reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match, index) => {
          if (index === action.payload.index) {
            return {
              ...match,
              score: match.score + action.payload.value,
            };
          } else {
            return match;
          }
        }),
      };
    case DECREMENT_SCORE:
      return {
        ...state,
        matches: state.matches.map((match, index) => {
          if (index === action.payload.index) {
            return {
              ...match,
              score: Math.max(match.score - action.payload.value, 0),
            };
          } else {
            return match;
          }
        }),
      };
    case RESET_SCORES:
      return {
        ...state,
        matches: state.matches.map((match) => {
          return {
            ...match,
            score: 0,
          };
        }),
      };
    case ADD_MATCH:
      return {
        ...state,
        matches: [...state.matches, { score: 0 }],
      };
    case DELETE_MATCH:
      return {
        ...state,
        matches: state.matches.filter((match, index) => {
          return index !== action.payload.index;
        }),
      };
    case UPDATE_SCORE:
      return {
        ...state,
        matches: state.matches.map((match) => {
          if (match.id === action.payload.id) {
            const newTotal = match.total + action.payload.delta;
            return {
              ...match,
              total: newTotal >= 0 ? newTotal : 0,
            };
          }
          return match;
        }),
      };
    default:
      return state;
  }
};

// create store
const store = Redux.createStore(reducer);

// handle form submit event
const handleFormSubmit = (event, index, isIncrement) => {
  event.preventDefault();
  const inputValue = parseInt(event.target.elements[0].value);
  if (isIncrement) {
    store.dispatch(incrementScore(index, inputValue));
  } else {
    store.dispatch(decrementScore(index, inputValue));
  }
};

const handleUpdateScore = (matchIndex, type, value) => {
  const match = store.getState().matches[matchIndex];
  let newScore = match.total;

  if (type === "increment") {
    newScore += value;
  } else if (type === "decrement") {
    newScore -= value;

    if (newScore < 0) {
      newScore = 0;
    }
  }
  store.dispatch(updateScore(matchIndex, newScore));
};

// handle delete button click event
const handleDeleteButtonClick = (index) => {
  store.dispatch(deleteMatch(index));
};

// handle reset button click event
const handleResetButtonClick = () => {
  store.dispatch(resetScores());
};

// handle add match button click event
const handleAddMatchButtonClick = () => {
  store.dispatch(addMatch());
};

// render function
const render = () => {
  const matchesContainer = document.querySelector(".all-matches");
  matchesContainer.innerHTML = "";

  store.getState().matches.forEach((match, index) => {
    const matchDiv = document.createElement("div");
    matchDiv.classList.add("match");

    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("wrapper");
    matchDiv.appendChild(wrapperDiv);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("lws-delete");
    deleteButton.innerHTML = '<img src="./image/delete.svg" alt="" />';
    deleteButton.addEventListener("click", () => {
      store.dispatch({ type: "DELETE_MATCH", payload: { index } });
    });
    wrapperDiv.appendChild(deleteButton);

    const matchName = document.createElement("h3");
    matchName.classList.add("lws-matchName");
    matchName.textContent = `Match ${index + 1}`;
    wrapperDiv.appendChild(matchName);

    const incDecDiv = document.createElement("div");
    incDecDiv.classList.add("inc-dec");
    matchDiv.appendChild(incDecDiv);

    const incForm = document.createElement("form");
    incForm.classList.add("incrementForm");
    incForm.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        const incrementValue = parseInt(event.target.value);
        if (isNaN(incrementValue) || incrementValue <= 0) {
          return;
        }
        store.dispatch({
          type: "INCREMENT_SCORE",
          payload: { index, value: incrementValue },
        });
        event.target.reset();
      }
    });
    incDecDiv.appendChild(incForm);

    const incLabel = document.createElement("h4");
    incLabel.textContent = "Increment";
    incForm.appendChild(incLabel);

    const incInput = document.createElement("input");
    incInput.type = "number";
    incInput.name = "increment";
    incInput.classList.add("lws-increment");
    incForm.appendChild(incInput);

    const decForm = document.createElement("form");
    decForm.classList.add("decrementForm");
    decForm.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        const decrementValue = parseInt(event.target.value);
        if (isNaN(decrementValue) || decrementValue <= 0) {
          return;
        }
        store.dispatch({
          type: "DECREMENT_SCORE",
          payload: { index, value: decrementValue },
        });
        event.target.reset();
      }
    });
    incDecDiv.appendChild(decForm);

    const decLabel = document.createElement("h4");
    decLabel.textContent = "Decrement";
    decForm.appendChild(decLabel);

    const decInput = document.createElement("input");
    decInput.type = "number";
    decInput.name = "decrement";
    decInput.classList.add("lws-decrement");
    decForm.appendChild(decInput);

    const numbersDiv = document.createElement("div");
    numbersDiv.classList.add("numbers");
    matchDiv.appendChild(numbersDiv);

    const singleResult = document.createElement("h2");
    singleResult.classList.add("lws-singleResult");
    singleResult.textContent = match.score;
    numbersDiv.appendChild(singleResult);

    matchesContainer.appendChild(matchDiv);
  });
};

// initial render
render();

// event listeners
const addMatchButton = document.querySelector(".lws-addMatch");
addMatchButton.addEventListener("click", () => {
  store.dispatch({ type: "ADD_MATCH" });
});

const resetButton = document.querySelector(".lws-reset");
resetButton.addEventListener("click", () => {
  store.dispatch({ type: "RESET_SCORES" });
});

// subscribe to state changes
store.subscribe(render);
