import React, { Component } from "react";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import Autocomplete from './Autocomplete';

// import "../../public/styles/style.css";


class CustomNavbar extends Component {
  constructor(props){
    super(props);
    this.state = {
      suggestions: []
    }
  }

  componentDidMount(){
    fetch("https://api.iextrading.com/1.0/ref-data/symbols")
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
          this.setState({suggestions: data});
      });
  }
 
  render() {
  
    return (
      <Navbar default collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/"> Midas </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Nav className="search">
          {/* <Search getTicker={(ticker) => this.props.getTicker(ticker)}/> */}
          <Autocomplete forceUpdate={() => this.forceUpdate} className="search-bar" suggestions={this.state.suggestions} getTicker={(ticker) => this.props.getTicker(ticker)}/>
        </Nav>

        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} componentClass={Link} href="/" to="/">
              Home
            </NavItem>
            {this.props.user ? (
                <NavItem eventKey={2}
                        componentClass={Link}
                        href="/about"
                        to="/about"
                >
                    Profile
                </NavItem>
            ) : (
              <NavItem eventKey={2} componentClass={Link} href="/login" to="/login">
                Login
              </NavItem>
            )}
          
            
            {this.props.user ? (
                <NavItem eventKey={3} componentClass={Link} href="/signout" to="/signout">
                  Signout
                </NavItem>
            ) : (
              <NavItem eventKey={3} componentClass={Link} href="/signup" to="/signup">
               Signup
              </NavItem>
            )}

            {this.props.user  ? (
                <NavItem eventKey={4}>Welcome, {this.props.user.firstName + "!"}</NavItem>
            ) : (<NavItem eventKey={4} componentClass={Link} href="/news" to="/news">
            News
          </NavItem>)}

          <NavItem eventKey={5}>Leaderboards</NavItem>
            
          
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default CustomNavbar;