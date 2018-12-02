import React, { Component } from 'react';
import { getUserPortfolio, updateUserPortfolioValue } from '../helpers/interactions/user_interactions';
import { getStockPrice } from '../helpers/interactions/iex_interactions';

export default class ShowPortfolioValue extends Component {
    constructor(props){
      super(props);
      this.state = {
        waitingForUpdate: false,
        user: this.props.user,
        portfolioValue: "calculating..."

      }
    }
  
 
    componentDidmount(){
      clearInterval(this.interval);
    
    }
  
    render(){
      // var { user, portfolioValue } = this.props;

      var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          // the default value for minimumFractionDigits depends on the currency
          // and is usually already 2
      });

      if(!this.state.waitingForUpdate){
  
        this.interval = setInterval(async () => {
              var totalPortfolioValue = 0;
              var user = await getUserPortfolio(this.props.user.id);
              totalPortfolioValue = parseInt(user.cash); 
              const userPortfolio = user.portfolio;

              for(let ticker in userPortfolio){
                    var newPriceOfStock = await getStockPrice(ticker);
                    totalPortfolioValue += (parseInt(userPortfolio[ticker].shares) * parseFloat(newPriceOfStock));
              }

              user.portfolioValue = totalPortfolioValue;

              updateUserPortfolioValue(user).catch((error) => console.log(error));
      
              this.setState({portfolioValue: formatter.format(totalPortfolioValue), waitingForUpdate: true})
         }, 1000);
        }
      return (
          <li>{"Total portfolio value: " + this.state.portfolioValue}</li>
      );
    }
  }
