var orm = require('orm');
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(app) {
	var str = "mysql://sql7115093:9L8lUdwDWb@sql7.freemysqlhosting.net:3306/sql7115093";
	var encoded_str = str.replace(/%([^\d].)/, "%25$1");
	app.use(orm.express(encoded_str,
	{
		define: function (db, models) {
			models.user = db.define("user", {
				userID : { type: 'number', key: true },
				username : String,
				password : String,
				email : String,
				gender : ["male", "female", ""],
				origin : ["north", "east", "south", "west", ""]
			}, {
					methods: {
						generateHash: function(pass) {
							return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
						},
						checkPass: function(pass) {
							return bcrypt.compareSync(pass, this.password);
						}
					}
				}
			);
			
			models.character=db.define("character",{
				userID: { type: 'number', key: true },
				level:Number,
				xp:Number,
				hp:Number,
				strength:Number,
				agility:Number,
				stamina:Number,
				charisma:Number,
				guildID:Number,
				gold: Number
			},{
				methods: {
					
				}
			});
			
			models.inventory=db.define("inventory",{
				userID: { type: 'number', key: true },
				itemID: { type: 'number', key: true },
				itemType:String,
				inventory_number:Number,
				inventory_x_position:Number,
				inventory_y_position:Number
			},{
				methods: {
					
				}
			});
			
			models.equipment=db.define("equipment",{
				userID:{ type: 'number', key: true },
				helmetID:Number,
				chestID:Number,
				glovesID:Number,
				bootsID:Number,
				weaponID:Number,
				shieldID:Number
			},{
				methods: {
					
				}
			});
			
			models.fights=db.define("fights", {
				userID: { type: 'number', key: true},
				total:Number,
				wins:Number,
				defeats:Number,
				draws:Number,
				dmg_taken:Number,
				dmg_dealt:Number,
				gold_won:Number,
				gold_lost:Number,
				type: { type: 'enum', values: ['dungeon', 'arena'], key: true}
			}, {
				methods : {
					
				}
			});
			
			db.sync();
		}
	}));
};