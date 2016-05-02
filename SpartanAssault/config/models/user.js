var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("user", {
		userID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING
		},
		twitterID: {
			type: DataTypes.STRING
		},
		gender: {
			type: DataTypes.ENUM('male', 'female', '')
		},
		origin: {
			type: DataTypes.ENUM('north', 'east', 'south', 'west', '')
		}
	}, {
		classMethods: {
			generateHash: function(pass) {
				return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
			},
			checkPass: function(pass) {
				return bcrypt.compareSync(pass, this.password);
			}
		}
	});
	
	return User;
}