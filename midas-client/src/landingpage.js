import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import News from "./components/News";
import Navbar from "./components/CustomNavbar";
import Footer from "./components/Footer";
import Signup from "./components/Signup";
import Signout from "./components/Signout";
import Login from "./components/Login";
import StockInfo from './components/StockInfo';
import getStockInfo from './helpers/interactions/iex_interactions';
import './landingpage.css'
import './styles/style.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
      searchedTicker: null,
      isLoading: true,
      stockData: null
    }
  }

  componentWillMount(){
    //check if user is already logged in session
    fetch("/api/auth")
      .then(response => {
          console.log(response);
          return response.json();
      })
      .then(data => {
          this.setState({user: data, isLoading: false});
          console.log("hi pat")
          console.log(data);
      })
      .catch(error => {
        this.setState({isLoading: false})
          console.log(error);
      })
  }

  getUserData(user){
    this.setState({user: user});
  }

  getSearchedTicker(ticker){
    this.setState({searchedTicker: ticker});
  }

  async getStockData(ticker){
    let stockData = getStockInfo(ticker);
    this.setState({stockData: stockData});
  }

  resetUserData(){
    this.setState({user: null});
  }

  render(){
    console.log(this.state.user);
    return (
      
      <Router>
         
         { this.state.isLoading ? (
            <div>Loading.. please wait!</div>
         ) : (
              
             <div>
                <Navbar user={this.state.user} forceUpdate={() => this.forceUpdate} getTicker={(ticker) => this.getSearchedTicker(ticker)}/>
                <Route exact path="/" render={() => <Home user={this.state.user} getUser={(user) => this.getUserData(user)} />} />
                {/* For the following view to render properly, pass key={props.location.key} to make the component re-render since the location changes if the user looks up a new stock*/}
                <Route path="/stocks/:ticker" render={(props) => <StockInfo key={props.location.key} {...props} getUser={(user) => this.getUserData(user)} ticker={this.state.searchedTicker} user={this.state.user} getUser={(user) => this.getUserData(user)} />} />
                <Route path="/about" component={About} />
                <Route path="/signup" render={() => <Signup getUser={(user) => this.getUserData(user)}/>} />
                <Route path="/login" render={() => <Login getUser={(user) => this.getUserData(user)} />} />
                <Route path="/signout" render={() => <Signout resetUser={() => this.resetUserData()} />} />
                <Route path="/news" component={News} />
                <Footer />
             </div>
         ) }
         
       
      </Router>
    );
  }
}


export default App;