import React, { Component } from 'react';
import PortfolioTicker from './Portfolio-Ticker';
import ShowPortfolioValue from './Show-Portfolio-Value';
import PropTypes from 'prop-types';
import { List, Segment } from 'semantic-ui-react'
// import './css/show-portfolio.css'

class ShowPortfolio extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        portfolio: {},
        portfolioList: [],
        waitingForUpdate: false
  
      }
    }

    static propTypes = {
      user: PropTypes.objectOf(PropTypes.any.isRequired),
      cashValue: PropTypes.number
    }

    
    render() {
     var { user, cashValue } = this.props;
     var portfolioList = [];
  

     for(let ticker in user.portfolio) portfolioList.push(<PortfolioTicker ticker={ticker} user={user} />);
     
     return (
      <div className="container-list">

          <ul className="portfolio-stocks">
                  {portfolioList}
          </ul>
      </div>
            
                           
      );
    }
  }

  export default ShowPortfolio;