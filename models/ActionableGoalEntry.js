const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class ActionableGoalEntry extends Model {}

ActionableGoalEntry.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_created: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        actionableGoal_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'actionableGoal',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'actionableGoalEntry'
    }
);

module.exports = ActionableGoalEntry;