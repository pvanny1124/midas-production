const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('Users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      firstName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
      lastName: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
      },
      username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            isAlphanumeric: true,
          },
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: true,
            isEmail: true,
          },
      },
      password_hash: {
        type: DataTypes.STRING
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cash: {
          type: DataTypes.STRING,
          allowNull: false
      },
      portfolioValue: {
          type: DataTypes.STRING,
          allowNull: false
      },
      portfolio: {
          type: DataTypes.JSONB,
          allowNull: false
      },
      posts: {
        type: DataTypes.JSONB
      },
      createdAt: {
          allowNull: false,
          type: DataTypes.DATE
      },
      updatedAt: {
          allowNull: false,
          type: DataTypes.DATE
      },
      rank: {
          type: DataTypes.INTEGER
      },

  });

  User.beforeCreate((user) =>
      new sequelize.Promise((resolve) => {
          bcrypt.hash(user.password_hash, null, null, (err, hashedPassword) => {
              resolve(hashedPassword);
          });
      }).then((hashedPw) => {
          user.password_hash = hashedPw;
      })
  );
  return User;
}


