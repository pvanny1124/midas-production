import React from 'react';

const DisplayField = props => (
    <div>
        {
            props.d_key && props.value && <div>
                <div className="display-field-key">{props.d_key}</div> 
                <div className="display-field-value">{props.value}</div>
            </div>
        }
    </div>
)

export default DisplayField;