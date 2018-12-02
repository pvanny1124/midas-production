const express = require('express');
const passport = require('../middlewares/auth');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
const User = require("../models/users")(sequelize, Sequelize);
const router = express.Router();

//main route to return our dummy data in json
router.get("/api/user/:id", function(req, res){
    const userId = req.params.id;
    User.findAll({where: { id: userId }, raw: true})
      .then(data => {
        res.json(data[0]);
    }).catch((err) => {
        res.send(err);
      })
  });


router.put("/api/user/:id/portfolio-value", function(req, res){
    const newPortfolioValue = req.body.portfolioValue;
    const user_id = req.body.id;
  
    User.update({portfolioValue: newPortfolioValue}, 
          { where: { id: user_id },
            returning: true,
            raw: true
          }).then(data => {
              res.json(data[1][0]);
          }).catch((error) => {
              console.log(error);
          });
  });
  

router.put("/api/user/:id", function(req, res){
    const userId = req.params.id;
    const newPortfolio = req.body.portfolio;
    const newCashValue = req.body.cash;
  
    User.update({portfolio: newPortfolio, cash: newCashValue}, 
          { where: { id: userId },
            returning: true,
            raw: true
          }).then(data => {
              res.json(data[1][0]);
          }).catch((error) => {
              console.log(error);
          });
  });

module.exports = router;