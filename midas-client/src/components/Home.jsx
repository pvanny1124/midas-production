import React, { Component } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import { Jumbotron, Grid, Row, Col, Image, Button, Media } from "react-bootstrap";
import Simulator from './Simulator';
import StockInfo from './StockInfo';
import Welcome from './Welcome';
import "../styles/style.css";



class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: this.props.user
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
          this.props.getUser(data);
          this.setState({user: data})
          console.log(data);
      })
      .catch(error => {
          console.log(error);
      })
  }

  render() {
    return (
      <Grid>
      
        {this.state.user ? (
          <div className="user-home">
            <div className="simulator">
                <Simulator userId={this.props.user.id} />
            </div>
           <div className="stock-info">
                <StockInfo ticker="msft" />    
          </div>
           
        </div>
         
        ) : (
          <Welcome />
        )}
     
      
        
      </Grid>
    );
  }
}

export default Home;