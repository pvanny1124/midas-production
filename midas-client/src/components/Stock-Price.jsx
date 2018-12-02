import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class StockPrice extends Component {
    static propTypes = {
      stockPrice: PropTypes.number.isRequired
    }

    render() {
      console.log("updating ticker in seach bar")
      return (
        <li>{"$" + this.props.stockPrice}</li>
      );
    }
  }
