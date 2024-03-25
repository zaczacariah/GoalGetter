const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class HabitualGoalEntry extends Model {}

HabitualGoalEntry.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
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
        habitual_goal_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'habitualGoal',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'habitualGoalEntry'
    }
);

module.exports = HabitualGoalEntry;