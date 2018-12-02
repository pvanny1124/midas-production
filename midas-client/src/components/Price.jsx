import React from 'react';

const Price = props => (
    <div className="price row">
        <div className="stock-info-price col-md-6">
            {
                props.price &&
                <h4>${props.price}</h4>
            }
        </div>
    <div className="stock-info-week52Limits col-md-4 col-sm-12 row">
            <div className="col-sm-2">
                {
                    props.w52high &&
                    <div class="week-52-high">${props.w52high}</div> 
                }
            </div>
            <div className="col-sm-2">
                {
                    props.w52low &&
                    <div class="week-52-low">${props.w52low}</div>
                }
            </div>
        </div>
    </div>
)

export default Price;