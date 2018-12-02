import React, { Component } from "react";
import { Grid, Col, Image } from "react-bootstrap";
// import "../../public/styles/style.css";

class About extends Component {
  render() {
    return (
      <div>
        <Image src="assets/dog-people.jpg" className="header-image" />
        <Grid>
          <Col xs={12} sm={8} smOffset={2}>
            <Image src="assets/person-1.jpg" className="about-profile-pic" />
            <h3> Frank the Tank </h3>

            <p>
              I guess that would be considered a UFO. A big cotton ball in the
              sky. Every highlight needs it's own personal shadow. Trees live in
              your fan brush, but you have to scare them out. If you didn't have
              baby clouds, you wouldn't have big clouds.
            </p>

            <p>
              Mix your color marbly don't mix it dead. Everyone is going to see
              things differently - and that's the way it should be. It's hard to
              see things when you're too close. Take a step back and look. And I
              know you're saying, 'Oh Bob, you've done it this time.' And you
              may be right.
            </p>

            <p>
              That's what painting is all about. It should make you feel good
              when you paint. And I will hypnotize that just a little bit. Let's
              have a happy little tree in here.
            </p>
          </Col>
        </Grid>
      </div>
    );
  }
}

export default About;
