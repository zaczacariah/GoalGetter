const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class ActionableGoal extends Model {}

ActionableGoal.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        unit: {
            type: DataTypes.ENUM,
            values: ['$', 'Kg', 'Steps', 'Km'],
            defaultValue: '$'
        },
        direction: {
            type: DataTypes.ENUM,
            values: ['ASC', 'DESC'],
            allowNull: false,
            defaultValue: "ASC"
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        goal_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        due_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }    
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'actionableGoal'
    }
);

module.exports = ActionableGoal;