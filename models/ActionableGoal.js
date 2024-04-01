const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class ActionableGoal extends Model { // Define a method to calculate the sum of all related GoalEntry quantities
   
    async goalProgress() {
       
        const sum = await sequelize.models.actionableGoalEntry.sum('quantity', {
            where: { actionable_goal_id: this.id } 
        });

        let percent = (sum/this.goal_amount)*100;
        percent = percent > 100 ? 100 : percent;
        return percent || 0; 
    }
}

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
        imgUrl: {
            type: DataTypes.STRING,
            allowNull: true
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
            allowNull: false,
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