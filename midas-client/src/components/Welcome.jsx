import React from 'react';
import {Link} from 'react-router-dom';
import {Jumbotron,Media,Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHandHoldingUsd, faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

const Welcome = () => (
    <Jumbotron className="row">
        <div className="welcome-info col-md-7">
            <h1><strong>Welcome to Midas</strong></h1>
            <h4>Ever consider trying the stock market but afraid to lose because of inexperience? We provide you a platform where you can practice investing fake currency we provide and keep track of for you.</h4>
            <Media className={"welcome-bullets"}>
    
                <div>
                    <Media.Left>
                        <FontAwesomeIcon icon={faChartLine} size={"4x"} />
                    </Media.Left>
                    <Media.Body>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ipsum quaerat eaque est aliquid doloremque dignissimos consectetur veniam eligendi. Molestiae asperiores labore ipsa hic deleniti adipisci numquam rerum nesciunt quis.</p>
                    </Media.Body>
                </div>
    
                <div>
                    <Media.Left>
                        <FontAwesomeIcon icon={faHandHoldingUsd} size={"4x"} />
                    </Media.Left>
                    <Media.Body>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, consectetur animi tenetur ut earum et dolorem laudantium officiis incidunt mollitia corporis eaque eligendi dolores delectus inventore cumque doloremque rerum officia.</p>
                    </Media.Body>
                </div>
    
                <div>
                    <Media.Left>
                        
                        <FontAwesomeIcon icon={faCommentsDollar} size={"4x"} />
                    </Media.Left>
                    <Media.Body>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus, consectetur animi tenetur ut earum et dolorem laudantium officiis incidunt mollitia corporis eaque eligendi dolores delectus inventore cumque doloremque rerum officia.</p>
                    </Media.Body>
                </div>
    
            </Media>
            
            
            {/* <Link to="/about">
                <Button bsStyle="primary"> Click to Learn more </Button>
            </Link> */}
        </div>
        <div className="welcome-placeholder col-md-5">
            <h1>Placeholder</h1>
        </div>
    </Jumbotron>

    // <Row className="show-grid text-center">
    //         <Col xs={12} sm={4} className="person-wrapper">
    //             <Image src="assets/person-1.jpg" circle className="profile-pic" />
    //             <h3> Frank </h3>
    //             <p> This is better than Robinhood </p>
    //         </Col>
    //         <Col xs={12} sm={4} className="person-wrapper">
    //             <Image src="assets/person-2.jpg" circle className="profile-pic" />
    //             <h3> Frank </h3>
    //             <p> It changed my life </p>
    //         </Col>
    //         <Col xs={12} sm={4} className="person-wrapper">
    //             <Image src="assets/person-3.jpg"  className="profile-pic" />
    //             <h3> Frank </h3>
    //             <p> Best website ever </p>
    //         </Col>
    // </Row> 
)

export default Welcome;