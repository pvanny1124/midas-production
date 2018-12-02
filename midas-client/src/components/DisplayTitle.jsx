import React from 'react';

const DisplayTitle = props => (
    <div className={props.classname}>
        {
            props.title && <div>
                    <strong>{props.title}</strong>
            </div>
        }
    </div>
)

export default DisplayTitle;