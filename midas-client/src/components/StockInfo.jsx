import React, { Component } from 'react';
import DisplayField from './DisplayField';
import DisplayTitle from './DisplayTitle';
import Price from './Price';
import TrendingNews from './TrendingNews';
import Trade from './Trade';
import {withRouter} from 'react-router';
// import './css/StockInfo.css';


const API_PREFIX = "https://api.iextrading.com/1.0";

class StockInfo extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            ticker: null,
            price: null,
            chart: null,
            market_cap: null,
            volume: null,
            description: null,
            trending_news: null,
            CEO: null,
            num_of_employees: null,
            week52High: null,
            week52Low: null
         }
    }

    componentDidMount(){
        console.log("PROPS IN STOCK INFO")
        console.log(this.props)

        if(this.props.location.pathname == "/"){
            //hold a dummy for now
            this.getStockInfo("msft");
        } else {
            this.getStockInfo(this.props.match.params.ticker);
        }
       
    }

    // getStockInfo is central function for the API calls since we need multiple 
    // calls to get all data
    getStockInfo = async (ticker) =>{
        await this.getStockInfo_Company(ticker);
        await this.getStockInfo_Quote(ticker);
        await this.getStockInfo_News(ticker);
    }

    getStockInfo_Company = async (ticker) => {
        const api_call = await fetch(`${API_PREFIX}/stock/${ticker}/company?filter=symbol,CEO,description`);
        const data = await api_call.json();

        this.setState({
            ticker:data.symbol,
            CEO: data.CEO,
            description: data.description
        })
    }

    getStockInfo_Quote = async (ticker) => {
        const api_call = await fetch(`${API_PREFIX}/stock/${ticker}/quote?filter=latestPrice,latestVolume,marketCap,week52High,week52Low`);
        const data = await api_call.json();

        this.setState({
            price: data.latestPrice,
            volume: data.latestVolume,
            market_cap: data.marketCap,
            week52High: data.week52High,
            week52Low: data.week52Low
        })
    }

    getStockInfo_News = async (ticker) => {
        const api_call = await fetch(`${API_PREFIX}/stock/${ticker}/news/last/4`)
        const data = await api_call.json();

        this.setState({
            trending_news: data
        })
    }

    render() { 


        return ( 
            <div className="stock-info-main"> 
                <div className="form-container stock-info">
                    <div className="stock-info-head row">
                        <DisplayTitle classname={"stock-info-title col-md-6 stock-info-ticker"} title={this.state.ticker}/>
                        <div className="col-md-6">
                            <Price price={this.state.price} w52high={this.state.week52High} w52low={this.state.week52Low} />
                        </div>
                    </div>
                    <div className="stock-info-body row">
                        <div className="stock-info-left col-md-4">
                            <DisplayField d_key={"Chart"} value={this.state.chart}/>
                            <DisplayField d_key={"Market Cap"} value={this.state.market_cap}/>
                            <DisplayField d_key={"Volume"} value={this.state.volume}/>
                            <DisplayField d_key={"CEO"} value={this.state.CEO} />
                        </div>
                        <div className="stock-info-right col-md-8">
                            <DisplayField d_key={"Description"} value={this.state.description}/>
                        </div>
                        <div className="stock-info-bottom col-md-12">
                            <TrendingNews articles={this.state.trending_news} />
                        </div>
                    </div>
                </div>

                <Trade getUser={(user) => this.props.getUser(user)} className="trade-tool" tickerData={this.state} user={this.props.user}/>
            </div>
         );
    }
}
 
export default withRouter(StockInfo);