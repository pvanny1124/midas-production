import React, { Component, Fragment } from "react";
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
// import "../../public/styles/style.css";
import { BrowserHistory, withRouter} from 'react-router-dom';

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array)
  };

  static defaultProps = {
    suggestions: []
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: "",
      // Redirect if the user has entered a stock
      redirect: false
    };
  }

  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.symbol.toLowerCase().indexOf(userInput.toLowerCase()) > -1 || suggestion.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    ).slice(0, 4);

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    try {

    if (e.keyCode === 13) {
      
      let enteredSymbol = filteredSuggestions[activeSuggestion].symbol;

      //pass name of ticker up to main component
      this.props.getTicker(enteredSymbol);

      this.setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: "",
        redirect: true
      });

      //Show stock info page as soon as user presses enter
      this.props.history.push(`/stocks/${enteredSymbol.toLowerCase()}`);
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }

  } catch (error) {
      //user entered gibberish at this point...
      console.log(error);
  }
  };


  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="list-group">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "active";
              }

              return (
                <li
                  className={"list-group-item " + className}
                  key={suggestion.symbol}
                  onClick={onClick}
                >
                  {suggestion.name + " " + "(" + suggestion.symbol + ")"}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions, you're on your own!</em>
          </div>
        );
      }
    }

    return (
      <div>
            <Fragment>
            
            <div class="input-group mb-3">
                <input type="text" 
                      className="form-control nav-input" 
                      placeholder="Lookup a stock" 
                      aria-label="Recipient's username" 
                      aria-describedby="basic-addon2"
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      value={userInput}
                />
            </div>


            {suggestionsListComponent}
          </Fragment>
        </div>
     
    );
  }
}

export default withRouter(Autocomplete);