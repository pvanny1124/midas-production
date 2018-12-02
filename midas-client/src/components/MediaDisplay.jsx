import React from 'react';
import { Media } from 'react-bootstrap';

const MediaDisplay = props => (
    <Media>
        {console.log(props.news)}
        <Media.Left>
            <img width={64} height={64} src={props.news.image} alt={"thumbnail"} />
        </Media.Left>
        <Media.Body>
            <Media.Heading>{props.news.headline}</Media.Heading>
            <p>{props.news.summary}</p>
        </Media.Body>
    </Media>
)

export default MediaDisplay;