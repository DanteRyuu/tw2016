module.exports = function(sequelize, DataTypes) {
	var Arm = sequelize.define("armour", {
		armourID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		armourType: {
			type: DataTypes.ENUM('boots', 'chest', 'gloves', 'helmet', 'shield')
		},
		strength: {
			type: DataTypes.INTEGER
		},
		agility: {
			type: DataTypes.INTEGER
		},
		stamina: {
			type: DataTypes.INTEGER
		},
		charisma: {
			type: DataTypes.INTEGER
		},
		upgrade_level: {
			type: DataTypes.INTEGER
		},
		price: {
			type: DataTypes.INTEGER
		},
		weight: {
			type: DataTypes.INTEGER
		},
		armourName: {
			type: DataTypes.STRING
		},
		defense: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Arm;
}