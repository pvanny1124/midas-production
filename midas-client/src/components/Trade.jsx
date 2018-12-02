//Implements buying and selling a stock on a /stocks/<ticker> page

import React, { Component } from 'react';
import { getStockPrice } from '../helpers/interactions/iex_interactions';
import { updateUserPortfolio } from '../helpers/interactions/user_interactions';
import '../styles/style.css'

//First, the trade component needs to have the user informartion.
class Trade extends Component {
    constructor(props){
        super(props);
        this.state = {
            amountOfSharesToBuy: null,
            amountOfSharesToSell: null,
            shares: null,
            user: this.props.user,
            tickerData: this.props.tickerData,
            buyFailed: false,
            sellFailed: false,
            buySuccess: false,
            sellSuccess: false,
            marketClosed: false,
            notEnoughShares: false
        }
    }


    handleBuyChange(event){
        //need to do this to access event.target.value through handleBuy/handleSell
        this.setState({amountOfSharesToBuy: event.target.value, shares: event.target.value});
    }
  
    handleSellChange(event){
      this.setState({amountOfSharesToSell: event.target.value});
    }

    handleBuy(event){
        event.preventDefault();
  
        var { tickerData,  user} = this.props;
        var { amountOfSharesToBuy } = this.state;
        var totalCostOfShares = tickerData.price * parseInt(amountOfSharesToBuy);
        var ticker = tickerData.ticker.toLowerCase();
  
        //if the input is empty, just return and do nothing
        if(amountOfSharesToBuy == null || amountOfSharesToBuy == "" || amountOfSharesToBuy == 0) return;
  
        //if user has no shares
        if(isEmpty(user.portfolio)){
          //TODO: Calculate average price brought
          
          //check
          user.portfolio[ticker] = {
            shares: amountOfSharesToBuy
          }
  
          user.cash = user.cash - totalCostOfShares;
  
          this.setState({user: user, buySuccess: true, amountOfSharesToBuy: null});
         
          
          updateUserPortfolio(user)
              .then(user => this.props.getUserData(user))
              .catch((err) => {console.log(err)});
  
          return;
        }
  
        //If the user has money to buy shares...
        if((user.cash - totalCostOfShares) > 0){
            //...Check if he/she already own the stock
            if(user.portfolio.hasOwnProperty(ticker)){
                //add new amount of shares
                user.portfolio[ticker].shares =   parseInt(user.portfolio[ticker].shares) + parseInt(amountOfSharesToBuy);
  
                //update cash
                user.cash = parseInt(user.cash) - parseInt(totalCostOfShares);
  
                //update user in db
                updateUserPortfolio(user)
                    .catch((err) => {console.log(err)})
  
                //update component
                this.setState({user: user, buyFailed: false,  buySuccess: true, amountOfSharesToBuy: null});
           

                return;
            }
            //If the user doesn't own any shares of the ticker...
            //Add a new ticker in the portfolio and insert shares bought
            user.portfolio[ticker] = {
                shares: amountOfSharesToBuy
            };
            
            //update cash
            user.cash = user.cash - totalCostOfShares;
          
            //update component
            this.setState({user: user, buyFailed: false, buySuccess: true, amountOfSharesToBuy: null});
        
  
            //update user in db
            updateUserPortfolio(user)
                .then(user => this.props.getStockPrice(user))
                .catch((err) => {console.log(err)})
  
        } else {
            //if none of these checks passed, the user does not have enough cash to buy stocks.
            this.setState({buyFailed: true, buySuccess: false});
        }
    
    }

    handleSell(event){
        event.preventDefault();
        
        var { tickerData,  user} = this.props;
        var { amountOfSharesToSell } = this.state;
        var ticker = tickerData.ticker.toLowerCase();

        //If user entered an empty string, just return and do nothing
        if(amountOfSharesToSell == "" || amountOfSharesToSell == 0 || amountOfSharesToSell == null) return;
  
        getStockPrice(ticker)
          .then((price) => {
              //if the user doesnt own stocks...
              if(isEmpty(user.portfolio)){
                this.setState({sellFailed: true, sellSuccess: false});
              } else {
                      //check if the user has the stock 
                      if(user.portfolio.hasOwnProperty(ticker)){
                        //Check if he/she has more than or equal to x amount of shares to sell
                            var userOwnedShares = parseInt(user.portfolio[ticker].shares);
  
                            if(userOwnedShares >= parseInt(amountOfSharesToSell)){
                                  //remove x amount of shares from ticker object in portfolio
                                  user.portfolio[ticker].shares = parseInt(userOwnedShares) - parseInt(amountOfSharesToSell);
  
                                  //if user has 0 zero shares of the ticker, remove it from the portfolio object
                                  if(!user.portfolio[ticker].shares) delete user.portfolio[ticker];
                                  //add price x amount of shares to cash    
                                  user.cash = parseInt(user.cash) + (parseInt(amountOfSharesToSell) * parseInt(price));
  
                                  //Update user Portfolio on backend
                                  updateUserPortfolio(user)
                                    .then(user => this.props.getUserData(user))
                                    .catch((err) => {console.log(err)});
  
                                  //Update component for client
                                  this.setState({user: user, sellFailed: false, sellSuccess: true});
                                  return;
                            } else {
                                //the user may not have enough stocks as he/she wants to sell.
                                //Display error message saying "you do not have enough shares..."
                              this.setState({notEnoughShares: true, sellFailed: false, sellSuccess: false});
                              return;
                            }
                      }
                      //otherwise,the user doesn't have enough money
                      this.setState({sellFailed: true, sellSuccess: false});
                      return;                          
             
             }
          });
    }

    // componentWillUnmount(){
    //     this.setState({buySuccess: false, sellSuccess: false})
    // }

    handleContinue(){
        this.setState({
            buySuccess: false, 
            buyFailed: false, 
            sellSuccess: false, 
            sellFailed: false, 
            notEnoughShares: false
        });
    }

    render(){
        console.log(this.props.user);
        console.log(this.props.tickerData);

        var { buyFailed, sellFailed, buySuccess, sellSuccess, notEnoughShares } = this.state;
        // Create our number formatter to display comma separated values.
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            // the default value for minimumFractionDigits depends on the currency
            // and is usually already 2
        });

        //check if user owns the current ticker...
        var ownedShares = 0;
        if(this.props.tickerData.ticker && this.props.user){
                if(this.props.user.portfolio.hasOwnProperty(this.props.tickerData.ticker.toLowerCase())){
                    ownedShares = this.props.user.portfolio[this.props.tickerData.ticker.toLowerCase()].shares;
                }
        }

  
        return (
            <div>

                { this.state.user ? (
                         <div className="container-fluid trader">
                                <p>Available buying power: {formatter.format(this.props.user.cash)}</p>
                                <p>Shares of {this.props.tickerData.ticker} owned: {ownedShares}</p>
                                {/*Buy button*/}
                              
                                {buyFailed ? <div><span>Buy unsuccessful. Not enough cash.</span>
                                                    <form onSubmit={(event) => this.handleContinue(event)}>
                                                            <input type="submit" value="continue" />
                                                    </form>
                                                </div> : <span></span>
                                                  }
                                {buySuccess ? <div>
                                                <p>Buy successful! You have added {this.state.shares} {this.state.shares > 1 ? "shares" : "share"} of {this.props.tickerData.ticker} to your portfolio. You now have {ownedShares} shares of {this.props.tickerData.ticker}</p>
                                                       
                                                        <form onSubmit={(event) => this.handleContinue(event)}>
                                                            <input type="submit" value="continue" />
                                                        </form>
                                                
                                             </div> 

                                        : <form onSubmit={(event) => this.handleBuy(event)}>
                                                <input type="number" min="0" placeholder="x amount of shares" value={this.state.amountOfSharesToBuy} onChange={(event) => this.handleBuyChange(event)}/>
                                                <input type="submit" value="Buy" />
                                          </form>}
            
                                {/*Sell button*/}
                                
                                {sellFailed ? <div><p>Sell unsuccessful. Not enough shares to sell</p>
                                                 <form onSubmit={(event) => this.handleContinue(event)}>
                                                        <input type="submit" value="continue" />
                                                 </form>
                                              </div> 
                                                : (notEnoughShares ? <div><p>You do not have enough shares to sell {this.state.shares}</p>
                                                                        <form onSubmit={(event) => this.handleContinue(event)}>
                                                                            <input type="submit" value="continue" />
                                                                        </form>
                                                </div> : <span></span>)}
                                {sellSuccess ? <div>
                                                    <p>Sell successful! You have sold {this.state.amountOfSharesToSell} {this.state.amountOfSharesToSell > 1 ? "shares" : "share"} of {this.props.tickerData.ticker}. You now have {ownedShares} shares of {this.props.tickerData.ticker}</p>
                                                    <form onSubmit={(event) => this.handleContinue(event)}>
                                                            <input type="submit" value="continue" />
                                                    </form>
                                               </div>
                                               : <form onSubmit={(event) => this.handleSell(event)}>
                                                    <input type="number" min="0" placeholder="x amount of shares" onChange={(event) => this.handleSellChange(event)}/>
                                                    <input type="submit" value="Sell" />
                                                </form>}
                       </div>
                ) : (
                    <p>Please login to buy or sell {this.props.tickerData.ticker} shares</p>
                )}
           


            </div>
            
        );
    } 
}

//Helper functions 
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}



export default Trade;