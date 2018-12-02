import React, { Component } from "react";

const ReturnOnInvestment = (props) => {
    //how to track cash/total cost basis?
    //reference this guide: https://budgeting.thenest.com/calculate-rate-return-stock-portfolio-28663.html
    let startingValue = props.startingValue;
    let endingValue = props.endingValue;

    let ROI = (((endingValue - startingValue) / startingValue) * 100).toFixed(3);

    return (
        <div>
            {ROI + "%"}
            {endingValue >= startingValue ? <p>Good job! You're in the green!</p> : <p>Invest wisely. You're in the red!</p>}
        </div>
    );
}

export default ReturnOnInvestment;