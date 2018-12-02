'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        // user_id: {
        //     type: Sequelize.INTEGER,
        //     references: {
        //       model: 'Users',
        //       key: 'id'
        //     },
        // },
        status: Sequelize.STRING,
        invoiceNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            unique: true
        },
        sharesPurchased: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        tickerPurchased: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tickerPrice:  {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        orderType: Sequelize.STRING,
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
        }
    });
  },
  
down: (queryInterface, Sequelize) => {
  //TODO
  return queryInterface.dropTable('Orders');
}
};