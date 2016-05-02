module.exports = function(sequelize, DataTypes) {
	var Wep = sequelize.define("weapon", {
		userID: {
			type: DataTypes.INTEGER,
			primaryKey: true
		},
		damage_min: {
			type: DataTypes.INTEGER
		},
		damage_max: {
			type: DataTypes.INTEGER
		},
		upgrade_level: {
			type: DataTypes.INTEGER
		},
		price: {
			type: DataTypes.INTEGER
		},
		weaponName: {
			type: DataTypes.STRING
		},
		weight: {
			type: DataTypes.INTEGER
		}
	}, {
		classMethods: {
			
		}
	});
	
	return Wep;
}