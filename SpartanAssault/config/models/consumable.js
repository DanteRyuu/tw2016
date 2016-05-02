module.exports = function(sequelize, DataTypes) {
	var Cons = sequelize.define("consumable", {
		consumableID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		consumableType: {
			type: DataTypes.STRING
		},
		consumableName: {
			type: DataTypes.STRING
		},
		consumableHP: {
			type: DataTypes.INTEGER
		},
		price: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Cons;
}