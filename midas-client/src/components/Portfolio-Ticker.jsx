import React, { Component } from 'react';
import { getUserPortfolio } from '../helpers/interactions/user_interactions';
import { getStockPrice } from '../helpers/interactions/iex_interactions';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react'
import '../styles/style.css'

class PortfolioTicker extends Component {
  constructor(props){
      super(props);
      this.state = {
        shares: this.props.user.portfolio[this.props.ticker].shares,
        user: this.props.user,
        ticker: this.props.ticker,
        waitingForUpdate: false
      } 
  }

  static propTypes = {
    ticker: PropTypes.string.isRequired,
    user: PropTypes.objectOf(PropTypes.any.isRequired)
  }

  componentDidMount(){
    clearInterval(this.interval);
    getTickerPrice(this.props.ticker).then(async (tickerPrice) => {
       this.setState({price: tickerPrice,})
    });
    
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  handleClick(){
    this.props.history.push("/stocks/" + this.state.ticker);
  }

  render(){
  
    if(!this.state.waitingForUpdate){
      this.interval = setInterval(async () => {
            console.log("UPDATING TICKER");
            var newPrice = await getStockPrice(this.state.ticker);
            var user = await getUserPortfolio(this.state.user.id);
            
            var amountOfSharesOwned = user.portfolio[this.state.ticker].shares;
          
            this.setState({price: newPrice, shares: amountOfSharesOwned, waitingForUpdate: true, user: user});
      }, 2000);
    }
     
    return (

              <li onClick={() => this.handleClick()} className="list-group-item portfolio-item stock"> 
                {this.state.ticker + " " + this.state.price + " Shares: " + this.state.shares}
              </li>
                        
           
    );
  }
}

async function getTickerPrice(ticker){
  var tickerPrice = await getStockPrice(ticker)
  return tickerPrice;
}

export default withRouter(PortfolioTicker);