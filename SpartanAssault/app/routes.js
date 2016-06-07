module.exports = function(app, passport) {

    app.get('/', function(req, res) {
    	if(req.session.username != undefined) {
    		res.redirect('/gender');
    	}
    	else
	        res.render('index.ejs', { messageLoginUser : req.flash('messageLoginUser'),
									  messageLoginPass : req.flash('messageLoginPass'),
									  messageUser : req.flash('messageUser'),
									  messagePass : req.flash('messagePass'),
									  messageEmail : req.flash('messageEmail'),
									  messageLicense : req.flash('messageLicense')}
					   );
    });

	app.get('/terms', function(req, res) {
		res.render('terms.ejs');
	});
	
    app.post('/register', passport.authenticate('local-register', {
		successRedirect : '/success',
		failureRedirect : '/',
		failureFlash : true
	}));

	app.get('/success', function(req, res) {
		res.render('success.ejs');
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/gender',
		failureRedirect : '/',
		failureFlash : true
	}));
	
	app.get('/twitter', passport.authenticate('twitter'));
	
	app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
        	successRedirect : '/gender',
            failureRedirect : '/'
        }));
	
	app.get('/gender', function(req, res) {
		if(req.isAuthenticated()) {
			if(req.session.gender == null || req.session.gender == "") {
				res.render('gender.ejs', { messageGender : req.flash('messageGender')});
			}
			else {
				res.redirect('/origin');
			}
		}
		else res.redirect('/');
	});
	
	app.post('/gender', function(req, res) {
		if(req.body.male == "on" || req.body.female == "on") {
			var value;
			if(req.body.male == "on")
				value = "male";
			else 
				value = "female";
			var User = req.models.user;
			
			User.find({ username : req.session.username}, function(err, users) {
				if(!err) {
					if(users.length > 0) {
						users[0].save({ gender: value }, function (err) {
							if(err) console.log("Save error: " + err);
						});
					}
					else console.log("No user found with username = " + req.session.username);
				}
				else console.log('Error: '+err);
			});
			
			res.redirect('/origin');
		}
		else {
			res.redirect('/gender');
			req.flash('messageGender', 'You have to pick a gender.');
		}
	});
	
	app.get('/origin', function(req, res) {
		if(req.isAuthenticated()) {
			if(req.session.origin == null || req.session.origin == "") {
				res.render('origin.ejs', { messageOrigin : req.flash('messageOrigin')});
			}
			else {
				res.redirect('/canvas');
			}
		}
		else res.redirect('/');
	});
	
	app.post('/origin', function(req, res) {
		if(req.body.n == "on" || req.body.e == "on" || req.body.s == "on" || req.body.w == "on") {
			var value;
			if(req.body.n == "on")
				value = "north";
			else if(req.body.e == "on")
					value = "east";
				else if(req.body.s == "on")
						value = "south";
					else
						value = "west";
			var User = req.models.user;
			
			User.find({ username : req.session.username}, function(err, users) {
				if(!err) {
					if(users.length > 0) {
						users[0].save({ origin: value }, function (err) {
							if(err) console.log("Save error: " + err);
						});
					}
					else console.log("No user found with username = " + req.session.username);
				}
				else console.log('Error: '+ err);
			});
			res.redirect('/canvas');
		}
		else {
			res.redirect('/origin');
			req.flash('messageOrigin', 'You have to pick your origins.');
		}
	});
	
    app.get('/canvas', function(req, res) {
		if(req.isAuthenticated()) {
			res.render('canvas.ejs');
			console.log("Username = " + req.session.username + "; gender = " + req.session.gender);
		}
		else res.redirect('/');
    });
    
    app.get('/gold', function(req, res) {
    	if(req.isAuthenticated()) {
    		var Char = req.models.character;
    		
    		Char.find({ userID : req.session.user_id }, function(err, char) {
    			if(!err) {
    				res.writeHead(200, {"Content-Type": "text/plain"});
    				res.end(char[0].gold + "");
    			}
    		});
    	}
    	else res.redirect('/');
    });
    
    app.get('/level', function(req, res) {
    	if(req.isAuthenticated()) {
    		var Char = req.models.character;
    		
    		Char.find({ userID : req.session.user_id }, function(err, char) {
    			if(!err) {
    				res.writeHead(200, {"Content-Type": "text/plain"});
    				res.end(char[0].level + "");
    			}
    		});
    	}
    	else res.redirect('/');
    });
	
	app.get('/main_info', function(req, res) {
		if(req.isAuthenticated()) {
			var json_text = "{ \"username\" : \""+ req.session.username + "\", \"gender\" : \"";
			console.log("Username = " + req.session.username + "; gender = " + req.session.gender);
			
			if(req.session.gender == "" || req.session.gender == null) {
				var User = req.models.user;
				
				User.find({ userID : req.session.user_id }, function(err, user) {
					if(!err) {
						json_text += user[0].gender  + "\" }";
						
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(json_text);
					}
				});
			}
			else {
				json_text += req.session.gender  + "\" }";
						
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.end(json_text);
			}
		}
		else res.redirect('/');
	});
	
	app.get('/stats', function(req, res) {
		if(req.isAuthenticated()) {
			var character = req.models.character;
			var json_text = "{ \"strength\" : \"";
			
			character.find({ userID : req.session.user_id }, function(err, characterInfo) {
				if(!err) {
					if(characterInfo.length > 0) {
						json_text = json_text + characterInfo[0].strength + "\", \"agility\" : \"" +
												characterInfo[0].agility + "\", \"stamina\" : \"" +
												characterInfo[0].stamina + "\", \"charisma\" : \"" +
												characterInfo[0].charisma + "\", \"hp\" : \"" + 
												characterInfo[0].hp + "\", \"max_hp\" : \"" + 
												characterInfo[0].max_hp + "\", \"xp\" : \"" +
												characterInfo[0].xp + "\" }";
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(json_text);
					}
				}
			});
		}
		else res.redirect('/');
	});
	
	app.post('/consume', function(req, res) {
		if(req.isAuthenticated()) {
			var inv = req.body.inv;
			var pos = req.body.pos;
			var x = Math.floor(pos/4), y = pos%4;
			console.log("inv=" + inv + ", x=" + x + ", y=" + y);
			
			var inventory = req.models.inventory;
			inventory.find({ userID : req.session.user_id,
					  inventory_number : inv,
					  inventory_x_position : x,
					  inventory_y_position : y },
					  function(err, inventories) {
					  	if(!err) {
					  		if(inventories.length > 0) {
					  			var item_id = inventories[0].itemID;
					  			
					  			inventories[0].remove(function (err) {
									if(!err) {
										console.log("removed!");
									}
								});
								
								var cons = req.models.consumable;
								cons.find({ consumableID : item_id}, function(err, consumable) {
									if(!err) {
										if(consumable.length > 0) {
											console.log(consumable[0].consumableHP);
											var hp = consumable[0].consumableHP;
											
											var char = req.models.character;
											char.find({ userID : req.session.user_id }, function(err, character) {
												if(!err) {
													if(character.length > 0) {
														var new_hp = character[0].hp + hp;
														if(new_hp > character[0].max_hp) {
															new_hp = character[0].max_hp;
														}
														
														character[0].hp = new_hp;
														character[0].save(function (err) {
													    	if(err) {
													    		throw err;
													    	}
												        });
												        
												        res.writeHead(200, {"Content-Type": "text/plain"});
														res.end();
													}
												}
											});
										}
									}
								});
					  		}
					  	}
					  });
		}
	});
	
	app.post('/equip_item', function(req, res) {
		if(req.isAuthenticated()) {
			var new_item = req.body.new_item;
			var type = req.body.type;
			console.log(new_item);
			
			if (type == "weapon") {
				var wep = req.models.weapon;
				var json_text = "{ \"min_attack\" : \"";
				
				wep.find({ weaponName : new_item}, function(err, new_wep) {
					if(!err) {
						if(new_wep.length > 0) {
							var new_id = new_wep[0].weaponID;
							var old_id = 0;
							json_text = json_text + new_wep[0].damage_min + "\", \"max_attack\" : \"" +
													new_wep[0].damage_max + "\" }";
							
							var equip = req.models.equipment;
							
							equip.find({ userID : req.session.user_id}, function(err, equipment) {
								if(!err) {
									if(equipment.length > 0) {
										old_id = equipment[0].weaponID;
										equipment[0].weaponID = new_id;
										equipment[0].save(function (err) {
									    	if(err) {
									    		throw err;
									    	}
								        });
									}
								}
							});
							
							var inv = req.models.inventory;
							
							
							inv.find({ userID : req.session.user_id, itemID : new_id, itemType : "weapon"}, function(err, inventory) {
								if(!err) {
									if(inventory.length > 0) {
										inventory[0].itemID = old_id;
										inventory[0].save(function (err) {
									    	if(err) {
									    		throw err;
									    	}
								        });
								        res.writeHead(200, {"Content-Type": "text/plain"});
										res.end(json_text);
									}
								}
							});
						}
					}
				});
			}
			else {
				var arm = req.models.armour;
				
				arm.find({ armourName : new_item}, function(err, new_arm) {
					if(!err) {
						if(new_arm.length > 0) {
							var new_id = new_arm[0].armourID;
							console.log(new_id);
							var old_id = 0;
							
							var equip = req.models.equipment;
							
							equip.find({ userID : req.session.user_id}, function(err, equipment) {
								if(!err) {
									if(equipment.length > 0) {
										switch(type) {
											case "helmet":
												old_id = equipment[0].helmetID;
												equipment[0].helmetID = new_id;
												break;
											case "chest":
												old_id = equipment[0].chestID;
												equipment[0].chestID = new_id;
												break;
											case "gloves":
												old_id = equipment[0].glovesID;
												equipment[0].glovesID = new_id;
												break;
											case "boots":
												old_id = equipment[0].bootsID;
												equipment[0].bootsID = new_id;
												break;
											case "shield":
												old_id = equipment[0].shieldID;
												equipment[0].shieldID = new_id;
												break;
										}
										equipment[0].save(function (err) {
									    	if(err) {
									    		throw err;
									    	}
								        });
									}
								}
							});
							
							var inv = req.models.inventory;
							
							
							inv.find({ userID : req.session.user_id, itemID : new_id, itemType : "armor"}, function(err, inventory) {
								if(!err) {
									if(inventory.length > 0) {
										inventory[0].itemID = old_id;
										inventory[0].save(function (err) {
									    	if(err) {
									    		throw err;
									    	}
								        });
									}
								}
							});
							
							res.writeHead(200, {"Content-Type": "text/plain"});
							res.end();
						}
					}
				});
			}
		}
		else res.redirect('/');
	});
	
	app.get('/equipped_items', function(req, res) {
		if(req.isAuthenticated()) {
			var equipment = req.models.equipment;
			var armor = req.models.armour;
			var weap = req.models.weapon;
			var json_text = "{ \"helmet\" : \"";
			var strength = 0;
			var agility = 0;
			var stamina = 0;
			var charisma = 0;
			var defense = 0;
			var weight = 0;
			
			equipment.find({ userID : req.session.user_id }, function(err, equip) {
				if(!err) {
					armor.find({ armourID : equip[0].helmetID}, function(err, helm) {
						if(!err) {
							json_text += helm[0].armourName + "\", \"chest\" : \"";
							strength += helm[0].strength;
							agility += helm[0].agility;
							stamina += helm[0].stamina;
							charisma += helm[0].charisma;
							defense += helm[0].defense;
							weight += helm[0].weight;
							armor.find({ armourID : equip[0].chestID}, function(err, chest) {
								if(!err) {
									json_text += chest[0].armourName + "\", \"gloves\" : \"";
									strength += chest[0].strength;
									agility += chest[0].agility;
									stamina += chest[0].stamina;
									charisma += chest[0].charisma;
									defense += chest[0].defense;
									weight += chest[0].weight;
									armor.find({ armourID : equip[0].glovesID}, function(err, gloves) {
										if(!err) {
											json_text += gloves[0].armourName + "\", \"boots\" : \"";
											strength += gloves[0].strength;
											agility += gloves[0].agility;
											stamina += gloves[0].stamina;
											charisma += gloves[0].charisma;
											defense += gloves[0].defense;
											weight += gloves[0].weight;
											armor.find({ armourID : equip[0].bootsID}, function(err, boots) {
												if(!err) {
													json_text += boots[0].armourName + "\", \"shield\" : \"";
													strength += boots[0].strength;
													agility += boots[0].agility;
													stamina += boots[0].stamina;
													charisma += boots[0].charisma;
													defense += boots[0].defense;
													weight += boots[0].weight;
													armor.find({ armourID : equip[0].shieldID}, function(err, shield) {
														if(!err) {
															json_text += shield[0].armourName + "\", \"weapon\" : \"";
															strength += shield[0].strength;
															agility += shield[0].agility;
															stamina += shield[0].stamina;
															charisma += shield[0].charisma;
															defense += shield[0].defense;
															weight += shield[0].weight;
															weap.find({ weaponID : equip[0].weaponID}, function(err, weapon) {
																if(!err) {
																	console.log(weapon[0].weaponID);
																	weight += weapon[0].weight;
																	json_text += weapon[0].weaponName + "\", \"strength\" :" + strength +
																										", \"agility\" :" + agility +
																										", \"stamina\" :" + stamina +
																										", \"charisma\" :" + charisma +
																										", \"defense\" :" + defense + 
																										", \"weight\" :" + weight + 
																										", \"min_attack\" :" + weapon[0].damage_min +
																										", \"max_attack\" :" + weapon[0].damage_max + " }";
																	res.writeHead(200, {"Content-Type": "text/plain"});
																	res.end(json_text);
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
		else res.redirect('/');
	});
	
	app.get('/inventory', function(req, res) {
		if(req.isAuthenticated()) {
			var armor = req.models.armour;
			var weap = req.models.weapon;
			var inv = req.models.inventory;
			var consumables = req.models.consumable;
			
			inv.find({ userID : req.session.user_id }, function(err, inventories) {
				if(!err) {
					var json_text = "{ \"inventories\" : [ ";
					var inv_value = 0, max_value = 0, min_value = 0;
					
					var get_inv = function(inventories, index, json_text, get_inv) {
						if(inventories.length === 0) {
							json_text += " ], \"inventory_val\" :  \"" + inv_value +
										 "\", \"min_val\" : \"" + min_value +
										 "\", \"max_val\" : \""+ max_value + "\" }";
							
							res.writeHead(200, {"Content-Type": "text/plain"});
							res.end(json_text);
							
							return false;
						}
						
						json_text += "{ \"number\" : \""
								   + inventories[index].inventory_number + "\", \"x\" : \""
								   + inventories[index].inventory_x_position + "\", \"y\" : \""
								   + inventories[index].inventory_y_position + "\", \"name\" : \"";
						
						var item_name;
						var item_type;
						if(inventories[index].itemType === "armor") {
							armor = req.models.armour;
							armor.find({ armourID : inventories[index].itemID }, function(err, armor_item) {
								if(!err) {
									json_text += armor_item[0].armourName + "\", \"type\" : \"" + armor_item[0].armourType + "\" }";
									inv_value+= armor_item[0].price;
									if(armor_item[0].price > max_value) {
										max_value = armor_item[0].price;
									}
									if(min_value == 0 || armor_item[0].price < min_value) {
										min_value = armor_item[0].price;
									}
									
									if(index === parseInt(inventories.length-1)) {
										json_text += " ], \"inventory_val\" :  \"" + inv_value +
													 "\", \"min_val\" : \"" + min_value +
													 "\", \"max_val\" : \""+ max_value + "\" }";
										
										res.writeHead(200, {"Content-Type": "text/plain"});
										res.end(json_text);
									}
									else {
										json_text += ", ";
										get_inv(inventories, index+1, json_text, get_inv);
									}
								}
							});
						}
						else 
							if(inventories[index].itemType === "weapon") {
								weap.find({ weaponID : inventories[index].itemID }, function(err, weap_item) {
									if(!err) {
										json_text += weap_item[0].weaponName + "\", \"type\" : \"" + "weapon" + "\" }";
										inv_value+= weap_item[0].price;
										if(weap_item[0].price > max_value) {
											max_value = weap_item[0].price;
										}
										if(min_value == 0 || weap_item[0].price < min_value) {
											min_value = weap_item[0].price;
										}
										
										if(index === parseInt(inventories.length-1)) {
											json_text += " ], \"inventory_val\" :  \"" + inv_value +
														 "\", \"min_val\" : \"" + min_value +
														 "\", \"max_val\" : \""+ max_value + "\" }";
											
											console.log("Json: " + json_text);
											res.writeHead(200, {"Content-Type": "text/plain"});
											res.end(json_text);
										}
										else {
											json_text += ", "; 
											get_inv(inventories, index+1, json_text, get_inv);
										}
									}
								});
							}
							else {
								consumables.find({ consumableID : inventories[index].itemID }, function(err, cons_item) {
									if(!err) {
										json_text += cons_item[0].consumableName + "\", \"type\" : \"" + cons_item[0].consumableType + "\" }";
										inv_value+= cons_item[0].price;
										if(cons_item[0].price > max_value) {
											max_value = cons_item[0].price;
										}
										if(min_value == 0 || cons_item[0].price < min_value) {
											min_value = cons_item[0].price;
										}
										
										if(index === parseInt(inventories.length-1)) {
											json_text += " ], \"inventory_val\" :  \"" + inv_value +
														 "\", \"min_val\" : \"" + min_value +
														 "\", \"max_val\" : \""+ max_value + "\" }";
											
											res.writeHead(200, {"Content-Type": "text/plain"});
											res.end(json_text);
										}
										else {
											json_text += ", ";
											get_inv(inventories, index+1, json_text, get_inv);
										}
									}
								});
							}
					}
					
					get_inv(inventories, 0, json_text, get_inv);
				}
		
			});
		}
		else res.redirect('/');
	});
	
	app.get('/fights', function(req, res) {
		if(req.isAuthenticated()) {
			var Fights = req.models.fights;
			var json_text = "{ \"total\" : \"";
			
			Fights.find({ username : req.session.username, type : "dungeon" }, function(err, fights) {
				if(!err) {
					if(fights.length > 0) {
						json_text += fights[0].total + "\", \"wins\" : \""
								  + fights[0].wins + "\", \"defeats\" : \""
								  + fights[0].defeats + "\", \"draws\" : \""
								  + fights[0].draws + "\" , \"dmg_taken\" : \""
								  + fights[0].dmg_taken + "\" , \"dmg_dealt\" : \""
							   	  + fights[0].dmg_dealt + "\" , \"gold_won\" : \""
								  + fights[0].gold_won + "\" , \"gold_lost\" : \""
								  + fights[0].gold_lost + "\" }";
								  
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(json_text);
					}
				}
			});
		}
		else res.redirect('/');
	});
	
	app.get('/pvp', function(req, res){
		if(req.isAuthenticated()) {
			var Pvp = req.models.fights;
			var json_text = "{ \"total_pvp\" : \"";
			
			Pvp.find({ username : req.session.username, type : "arena" }, function(err, pvp_fights) {
				if(!err) {
					if(pvp_fights.length > 0) {
						json_text += pvp_fights[0].total + "\", \"wins_pvp\" : \""
								  + pvp_fights[0].wins + "\", \"defeats_pvp\" : \""
								  + pvp_fights[0].defeats + "\", \"draws_pvp\" : \""
								  + pvp_fights[0].draws + "\" , \"dmg_taken_pvp\" : \""
								  + pvp_fights[0].dmg_taken + "\" , \"dmg_dealt_pvp\" : \""
							   	  + pvp_fights[0].dmg_dealt + "\" , \"gold_won_pvp\" : \""
								  + pvp_fights[0].gold_won + "\" , \"gold_lost_pvp\" : \""
								  + pvp_fights[0].gold_lost + "\" }";
								  
						res.writeHead(200, {"Content-Type": "text/plain"});
						res.end(json_text);
					}
				}
			});
		}
		else res.redirect('/');
	});
	
	app.post('/wpnsmith',function(req,res){
		var now=new Date();
		var nowmill=Date.parse(now.toString());
		var datemill=nowmill+1000*60*60*25;
		var newNow=new Date(datemill);
		var warehouse=req.models.warehouse;
		var weapon=req.models.weapon;
		var response="{weaponsmith:[";
		warehouse.find({type:'weapon'},function(err,witems){
			if(!err){
				if(witems.length > 0) {
					var stamp=witems[0].timestamp;
					if(nowmill>Date.parse(stamp.toString())){
						warehouse.find({type:'weapon', timestamp:stamp}).remove(function(err){});
	
						var ids="[";
						weapon.aggregate({}).max("weaponID").get(function(err, max) {
							
							var myRand=Math.floor(Math.random()*100%16)+1;		
							for(var randAux=0; randAux<=myRand; randAux++){
								if(randAux>0 && randAux<=myRand-1){
									ids+=",";
								}
								if(randAux<myRand){
									ids+=(Math.floor(Math.random()*100%(max+1)));
								}else{
									ids+="]";
									var vector = JSON.parse(ids);
									weapon.find({weaponID:vector}, function(err, weapons){
										if(!err){
											for (var indexID=0; indexID<=vector.length; indexID++){
												if(indexID==vector.length){
													response+="]}";
													res.writeHead(200, {"Content-Type": "text/plain"});
													res.end(response);
													break;
												}
												for (var indexWpn=0; indexWpn<weapons.length; indexWpn++){
													if(vector[indexID]==weapons[indexWpn].weaponID){
														response+="{\"name\":\""+weapons[indexWpn].weaponName+"\", \"price\":"+weapons[indexWpn].price+
														",\"damage\":"+weapons[indexWpn].damage_max+"}";
														
														var newItem = new warehouse();
														newItem.type='weapon';
														newItem.itemID = weapons[indexWpn].weaponID;
														newItem.timestamp = newNow;
														newItem.save(function(err){
															if(err){
																throw err;
															}
														});
														
														if(indexID!=vector.length-1){
															response+=",";
														}
														break;											
													}
												}
											}
										}
									});
								}
							}
						});
						
					}else{
						warehouse.find({type:'weapon'}, function(err, sell_weapons) {
							if(!err) {
								weapon.find({}, function(err, weapons){
									if(!err){
										for(var index = 0; index <= sell_weapons.length; index++) {
											if(index == sell_weapons.length) {
												response+="]}";
												res.writeHead(200, {"Content-Type": "text/plain"});
												res.end(response);
												console.log(response);
											}
											else {
												for(var index2 = 0; index2 < weapons.length; index2++){
													if(sell_weapons[index].itemID==weapons[index2].weaponID){
														if(index != 0) {
															response += ",";
														}
														response += "{\"name\":\""+weapons[index2].weaponName+"\", \"price\":"+weapons[index2].price+
																	",\"damage\":"+weapons[index2].damage_max+"}";
													}
												}
											}
										}
									}
									else
										console.log('Error:'+err);
								});
							}
						});
					}
				}
			}else{
				console.log(err);
			}
		});
	});
	
    app.post('/logout', function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });
	
   	var json_rndBattle;
	
	app.post('/randombattle', function(req,res){
		console.log("randomBattle");
		json_rndBattle = "{ \"myLvl\" : \"";
		var Character=req.models.character;
		Character.find({userID : req.session.user_id},function(err,character){
			if(!err){
				if(character.length > 0){
					console.log("levelul meu : " + character[0].level);
					json_rndBattle += character[0].level + "\", \"enemyLvl\" : \"";
					
					Character.find({level : [character[0].level-1, character[0].level, character[0].level+1]}).each().filter(function (character){return character.userID != req.session.user_id;}).get(function(character){
						if(!err){
							console.log("merge");
							console.log(character.length);
							if(character.length > 0){
								var n = Math.round(Math.random()*(character.length-1));
								console.log("numarul random"+n);
								var User=req.models.user;
								console.log(n);
								console.log(character[n].userID);
								var enemyID=character[n].userID;
								var enemyOR;
								json_rndBattle +=character[n].level + "\", \"enemyName\" : \"";
								User.find({userID : character[n].userID}, function(err,user){
									if(!err){
										if(user.length > 0){
											enemyOR = user[0].origin;
											var enemyName=user[0].username;
											console.log(enemyName);
											json_rndBattle +=enemyName + "\", \"myUserName\" : \"";
											json_rndBattle += req.session.username + "\", \"enemyUserName\" : \"";
											json_rndBattle += user[0].username + "\", \"enemyDefense\" : \"";
											
												var enemyDefense=0;
												var enemyDmg=0;
												var Equipment=req.models.equipment;
						Equipment.find({userID : enemyID}, function(err,enemyEquipment){
							if(!err){
								if(enemyEquipment.length>0){
									var Armour=req.models.armour;
									
									
									Armour.find({armourID : enemyEquipment[0].helmetID}, function(err,helmet){
										if(!err){
											if(helmet.length>0){
											
												enemyDefense+=helmet[0].defense;
												
													Armour.find({armourID : enemyEquipment[0].chestID}, function(err,chest){
													if(!err){
														if(chest.length>0){
															enemyDefense+=chest[0].defense;
													
													Armour.find({armourID : enemyEquipment[0].glovesID}, function(err,gloves){
														if(!err){
															if(gloves.length>0){
																enemyDefense+=gloves[0].defense;
																
													Armour.find({armourID : enemyEquipment[0].bootsID}, function(err,boots){
														if(!err){
															if(boots.length>0){
																enemyDefense+=boots[0].defense;
																
													Armour.find({armourID : enemyEquipment[0].shieldID}, function(err,shield){
														if(!err){
															if(shield.length>0){
																enemyDefense+=shield[0].defense;
													
														var Weapon=req.models.weapon;
									
													Weapon.find({weaponID : enemyEquipment[0].weaponID}, function(err,weapon){
														if(!err){
															if(weapon.length>0){
																enemyDmg+=weapon[0].damage_max;
																
														json_rndBattle += enemyDefense + "\", \"enemyDmg\" : \"";
														json_rndBattle += enemyDmg + "\", \"myDefense\" : \"";
														
														var myDmg=0;
														var myDefense=0;
																
														
															
									Equipment.find({userID : req.session.user_id}, function(err,myEquipment){
										if(!err){
											if(myEquipment.length>0){
												 Armour=req.models.armour;
									
									
													Armour.find({armourID : myEquipment[0].helmetID}, function(err,helmet){
														if(!err){
															if(helmet.length>0){
																myDefense+=helmet[0].defense;
												
													Armour.find({armourID : myEquipment[0].chestID}, function(err,chest){
														if(!err){
															if(chest.length>0){
																myDefense+=chest[0].defense;
																
																
													Armour.find({armourID : myEquipment[0].glovesID}, function(err,gloves){
														if(!err){
															if(gloves.length>0){
																myDefense+=gloves[0].defense;
																
													
													Armour.find({armourID : myEquipment[0].bootsID}, function(err,boots){
														if(!err){
															if(boots.length>0){
																myDefense+=boots[0].defense;
																
													Armour.find({armourID : myEquipment[0].shieldID}, function(err,shield){
														if(!err){
															if(shield.length>0){
																myDefense+=shield[0].defense;
																
													var Weapon=req.models.weapon;
									
													Weapon.find({weaponID : myEquipment[0].weaponID}, function(err,weapon){
														if(!err){
															if(weapon.length>0){
																myDmg+=weapon[0].damage_max;
																
																json_rndBattle += myDefense + "\", \"myDmg\" : \"";
																json_rndBattle += myDmg + "\", \"enemyStrength\" : \"";
																
																
													
						
						var Character=req.models.character;
						Character.find({userID : user[0].userID}, function(err,character){
							if(!err){
								if(character.length>0){
									
									var enemyHp = character[0].max_hp;
									
								
									
									var enemyStrength = character[0].strength;
									var enemyAgility = character[0].agility;
									var enemyStamina = character[0].stamina;
									var enemyCharisma = character[0].charisma;
									
										json_rndBattle += enemyStrength + "\", \"enemyHp\" : \"";
									
									var myID = req.session.user_id;
									enemyDmg+=enemyStrength/10;
									var myUserName = req.session.username;
							
									Character.find({userID : myID}, function(err,myCharacter){
										if(!err){
											if(myCharacter.length>0){
												
												var myHp = myCharacter[0].max_hp;
												
												json_rndBattle += enemyHp + "\", \"myHp\" : \"";
												json_rndBattle += myHp + "\", \"enemyAgility\" : \"";
												json_rndBattle += enemyAgility + "\", \"enemyStamina\" : \"";
												json_rndBattle += enemyStamina + "\", \"enemyCharisma\" : \"";
												json_rndBattle += enemyCharisma + "\", \"myStrength\" : \"";
												
												var myStrength = myCharacter[0].strength;
												var myAgility = myCharacter[0].agility;
												var myStamina = myCharacter[0].stamina;
												var myCharisma = myCharacter[0].charisma;
												
												json_rndBattle += myStrength + "\", \"myAgility\" : \"";
												myDmg+=myStrength/10;
												
													json_rndBattle += myAgility + "\", \"myStamina\" : \"";
													json_rndBattle += myStamina + "\", \"myCharisma\" : \"";
													json_rndBattle += myCharisma + "\",\"winner\" : \"";
													
												
												var round=0;
												
												
												var myHitChance =(50/100 + myStamina/100 - enemyAgility/100)*100;
												var enemyHitChance = (50/100 + enemyStamina/100 - myAgility/100)*100;
												if(enemyOR == "east"){
													enemyDefense = enemyDefense + enemyDefense/10;
												}
												if(req.session.origin == "east"){
													myDefense = myDefense + myDefense/10;
												}
												
												myDmg -= enemyDefense/10;
												enemyDmg -= myDefense/10;
												
												console.log("myDmg:"+myDmg);
												console.log("enemyDmg"+enemyDmg);
												console.log("rundele");
												var ok = true;
												if(myHp > 10 || enemyHp > 10){
												while(ok){
													
													var n = Math.round(Math.random()*100) + 1;
													
													if(n<myHitChance){
														enemyHp=enemyHp-myDmg;
													}
													var n = Math.round(Math.random()*100) + 1;
													if(n<enemyHitChance){
														myHp=myHp-enemyDmg;
													}
													
													console.log("round"+round);
													console.log("enemyHP:"+enemyHp);
													console.log("myHp:"+myHp);
													
													
													if(round>15 || enemyHp<=0 || myHp<=0) {
														ok = false;
													}
													
													var winner;
													
															if(!ok){
													if(myHp>0 && enemyHp<=0){
														console.log("A castigat"+ myUserName);
														json_rndBattle += myUserName + "\" }";

														var Char = req.models.character;
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});

														res.redirect('/randomBattleResult');
													}
													else if(enemyHp>0 && myHp<=0){
														console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
													
	    												Char.find({ userID : enemyID }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														
	    														if(char[0].hp <30){
	    															char[0].hp=0;
	    														}
	    														else{
	    															char[0].hp -=30;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												
	    												res.redirect('/randomBattleResult');
													}
													else {
														console.log("Draw");
														json_rndBattle += "Draw" + "\" }";
													
														
																console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
		
	    												Char.find({ username : enemyName }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    												
	    												Char.find({ username : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    													res.redirect('/randomBattleResult');
													}
															
												}
													round++;
												}
												}
											
		
												console.log(json_rndBattle);
										
												
												
	    											
											}else console.log("negasit");
										}	
									});
								}
							}
						});
											}
										}
								});
											}
										}
									});			
																
											}
										}
									});													
																
											}
										}
									});
											}
										}
									});
												
											}
										}
									});
									

								}else console.log("nu m-am gasit");
							}else console.log("Error"+err);
						});
																
											}
										}
								});
													
											}
										}
									});	
											}
										}
									});		
											}
										}
									});													
															
											}
										}
									});
												
											}else console.log("nu am gasit armura");
										}
									});
									

								}
							}
						});
											
										}
									}
								});
							}
						}else console.log("error:"+err);
					});
					
				}else console.log("nu am gasit");
				
			}
			});
			
				
		
	});
	
	 app.get('/randomBattleResult', function(req, res) {
	 	console.log(json_rndBattle);
		res.render('fightResult.ejs', { JSON_BATTLE : JSON.parse(json_rndBattle)});
    });

	app.post('/battle', function(req,res){
		json_rndBattle = "{ \"enemyName\" : \"";
		var enemyName=req.body.enemyName;
		var User = req.models.user;
			console.log("Am ajuns in battle");
		
			User.find({ username : enemyName}, function(err, user) {
				if(!err) {
					if(user.length > 0){
						
						var enemyDefense=0;
						var enemyOR = user[0].origin;
						var enemyID = user[0].userID;
						var enemyDmg=0;
						var Equipment=req.models.equipment;
						Equipment.find({userID : user[0].userID}, function(err,enemyEquipment){
							if(!err){
								if(enemyEquipment.length>0){
									var Armour=req.models.armour;
									
									
									Armour.find({armourID : enemyEquipment[0].helmetID}, function(err,helmet){
										if(!err){
											if(helmet.length>0){
											
												enemyDefense+=helmet[0].defense;
												
													Armour.find({armourID : enemyEquipment[0].chestID}, function(err,chest){
													if(!err){
														if(chest.length>0){
															enemyDefense+=chest[0].defense;
													
													Armour.find({armourID : enemyEquipment[0].glovesID}, function(err,gloves){
														if(!err){
															if(gloves.length>0){
																enemyDefense+=gloves[0].defense;
																
													Armour.find({armourID : enemyEquipment[0].bootsID}, function(err,boots){
														if(!err){
															if(boots.length>0){
																enemyDefense+=boots[0].defense;
																
													Armour.find({armourID : enemyEquipment[0].shieldID}, function(err,shield){
														if(!err){
															if(shield.length>0){
																enemyDefense+=shield[0].defense;
													
														var Weapon=req.models.weapon;
									
													Weapon.find({weaponID : enemyEquipment[0].weaponID}, function(err,weapon){
														if(!err){
															if(weapon.length>0){
																enemyDmg+=weapon[0].damage_max;
																

														
														var myDmg=0;
														var myDefense=0;
																
														
															
									Equipment.find({userID : req.session.user_id}, function(err,myEquipment){
										if(!err){
											if(myEquipment.length>0){
												 Armour=req.models.armour;
									
									
													Armour.find({armourID : myEquipment[0].helmetID}, function(err,helmet){
														if(!err){
															if(helmet.length>0){
																myDefense+=helmet[0].defense;
												
													Armour.find({armourID : myEquipment[0].chestID}, function(err,chest){
														if(!err){
															if(chest.length>0){
																myDefense+=chest[0].defense;
																
																
													Armour.find({armourID : myEquipment[0].glovesID}, function(err,gloves){
														if(!err){
															if(gloves.length>0){
																myDefense+=gloves[0].defense;
																
													
													Armour.find({armourID : myEquipment[0].bootsID}, function(err,boots){
														if(!err){
															if(boots.length>0){
																myDefense+=boots[0].defense;
																
													Armour.find({armourID : myEquipment[0].shieldID}, function(err,shield){
														if(!err){
															if(shield.length>0){
																myDefense+=shield[0].defense;
																
													var Weapon=req.models.weapon;
									
													Weapon.find({weaponID : myEquipment[0].weaponID}, function(err,weapon){
														if(!err){
															if(weapon.length>0){
																myDmg+=weapon[0].damage_max;
																
																
																
													
						
						var Character=req.models.character;
						Character.find({userID : user[0].userID}, function(err,character){
							if(!err){
								if(character.length>0){
									
									var enemyHp = character[0].hp;
									var enemyStrength = character[0].strength;
									var enemyAgility = character[0].agility;
									var enemyStamina = character[0].stamina;
									var enemyCharisma = character[0].charisma;
									
									json_rndBattle += enemyName + "\", \"enemyLvl\" : \"";
									json_rndBattle += character[0].level + "\", \"enemyHp\" : \"";
									json_rndBattle += enemyHp + "\", \"enemyStrength\" : \"";
									json_rndBattle += enemyStrength + "\", \"enemyAgility\" : \"";
									json_rndBattle += enemyAgility + "\", \"enemyStamina\" : \"";
									json_rndBattle += enemyStamina + "\", \"enemyCharisma\" : \"";
									json_rndBattle += enemyCharisma + "\", \"enemyStrength\" : \"";
									json_rndBattle += enemyStrength + "\", \"enemyDefense\" : \"";
									json_rndBattle += enemyDefense + "\", \"myUserName\" : \"";
									
									
									var myID = req.session.user_id;
									enemyDmg+=enemyStrength/10;
									var myUserName = req.session.username;
							
									Character.find({userID : myID}, function(err,myCharacter){
										if(!err){
											if(myCharacter.length>0){
												
												var myHp = myCharacter[0].hp;
												
												var myStrength = myCharacter[0].strength;
												var myAgility = myCharacter[0].agility;
												var myStamina = myCharacter[0].stamina;
												var myCharisma = myCharacter[0].charisma;
												var myLevel = myCharacter[0].level;
												
												json_rndBattle += myUserName + "\", \"myHp\" : \"";
												json_rndBattle += myHp + "\", \"myStrength\" : \"";
												json_rndBattle += myStrength + "\", \"myAgility\" : \"";
												json_rndBattle += myAgility + "\", \"myStamina\" : \"";
												json_rndBattle += myStamina + "\", \"myStrength\" : \"";
												json_rndBattle += myStrength + "\", \"myCharisma\" : \"";
												json_rndBattle += myCharisma + "\", \"myLvl\" : \"";
												json_rndBattle += myLevel + "\", \"myDefense\" : \"";
												json_rndBattle += myDefense + "\", \"enemyDmg\" : \"";
												
												myDmg+=myStrength/10;
												var round=0;
												
												if(enemyOR == "east"){
													enemyDefense += enemyDefense/10;
												}
												if(req.session.origin == "east"){
													myDefense += myDefense/10;
												}
												
												var myHitChance =(50/100 + myStamina/100 - enemyAgility/100)*100;
												var enemyHitChance = (50/100 + enemyStamina/100 - myAgility/100)*100;
												myDmg -= enemyDefense/10;
												enemyDmg -= myDefense/10;
												
												json_rndBattle += enemyDmg + "\", \"myDmg\" : \"";
												json_rndBattle += myDmg + "\", \"winner\" : \"";
												
												console.log("myDmg:"+myDmg);
												console.log("enemyDmg"+enemyDmg);
												console.log("rundele");
													var ok = true;
													
												if(myHp > 10 || enemyHp > 10){
												while(ok){
													
													var n = Math.round(Math.random()*100) + 1;
													
													if(n<myHitChance){
														enemyHp=enemyHp-myDmg;
													}
													var n = Math.round(Math.random()*100) + 1;
													if(n<enemyHitChance){
														myHp=myHp-enemyDmg;
													}
													
													console.log("round"+round);
													console.log("enemyHP:"+enemyHp);
													console.log("myHp:"+myHp);
													
													
													if(round>15 || enemyHp<=0 || myHp<=0) {
														ok = false;
													}
													
													var winner;
													
															if(!ok){
													if(myHp>0 && enemyHp<=0){
														console.log("A castigat"+ myUserName);
														json_rndBattle += myUserName + "\" }";

														var Char = req.models.character;
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});

														res.redirect('/BattleResult');
													}
													else if(enemyHp>0 && myHp<=0){
														console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
													
	    												Char.find({ userID : enemyID }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														
	    														if(char[0].hp <30){
	    															char[0].hp=0;
	    														}
	    														else{
	    															char[0].hp -=30;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												
	    												res.redirect('/BattleResult');
													}
													else {
														console.log("Draw");
														json_rndBattle += "Draw" + "\" }";
													
														
																console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
		
	    												Char.find({ username : enemyName }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    												
	    												Char.find({ username : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    													res.redirect('/BattleResult');
													}
															
												}
													round++;
												}
												}
												
												 // res.render('fightResult.ejs', { myCharismaValue : 'xxx'}
												 // );
												
												console.log(json_rndBattle);
												
											}else console.log("negasit");
										}	
									});
								}
							}
						});
											}
										}
								});
											}
										}
									});			
																
											}
										}
									});													
																
											}
										}
									});
											}
										}
									});
												
											}
										}
									});
									

								}else console.log("nu m-am gasit");
							}
						});
																
											}
										}
								});
													
											}
										}
									});	
											}
										}
									});		
											}
										}
									});													
															
											}
										}
									});
												
											}else console.log("nu am gasit armura");
										}
									});
									

								}
							}
						});
						
						
					}else {
						console.log("nu l-am gasit");
					req.flash('enemyName','Username does not exist!!!!!');
					res.render('tab_bar_colosseum.ejs', {enemyName : req.flash('enemyName')});
					}
				
				}else console.log("Error:"+err);
				
			});

	});
	
	
	 app.get('/BattleResult', function(req, res) {
		//res.render('fightResult.ejs');
		res.render('fightResult.ejs', { JSON_BATTLE : JSON.parse(json_rndBattle)});
    });
	
		app.get('/training',function(req,res){
		var character=req.models.character;
		character.find({userId:req.session.user_id},function(err,result){
			if(!err){
				var json_response="{\"stats\":[{\"statName\":\"Strength\",\"statValue\":"+result[0].strength+"},{\"statName\":\"Agility\",\"statValue\":"+result[0].agility+"},"+
									"{\"statName\":\"Charisma\",\"statValue\":"+result[0].charisma+"},{\"statName\":\"Stamina\",\"statValue\":"+result[0].stamina+"}], " +
									"\"gold\": " + result[0].gold + "}";
				console.log(json_response);
				res.writeHead(200, {"Content-Type": "text/plain"});
				res.end(json_response);
			}else{
				console.log(err);
			}
		});
	});
	
/*	app.post('/forestFight', function(req,res){
		console.log("");
		
		var User = req.models.user;
		User.find({ userID : req.session.user_id }, function(err, user) {
		if(!err) {
	    	if(user.length>0){
	    		var myDefense=0;
	    		var myDmg=0;
	    		
	    		
	    								Equipment.find({userID : req.session.user_id}, function(err,myEquipment){
										if(!err){
											if(myEquipment.length>0){
												 Armour=req.models.armour;
									
									
													Armour.find({armourID : myEquipment[0].helmetID}, function(err,helmet){
														if(!err){
															if(helmet.length>0){
																myDefense+=helmet[0].defense;
												
													Armour.find({armourID : myEquipment[0].chestID}, function(err,chest){
														if(!err){
															if(chest.length>0){
																myDefense+=chest[0].defense;
																
																
													Armour.find({armourID : myEquipment[0].glovesID}, function(err,gloves){
														if(!err){
															if(gloves.length>0){
																myDefense+=gloves[0].defense;
																
													
													Armour.find({armourID : myEquipment[0].bootsID}, function(err,boots){
														if(!err){
															if(boots.length>0){
																myDefense+=boots[0].defense;
																
													Armour.find({armourID : myEquipment[0].shieldID}, function(err,shield){
														if(!err){
															if(shield.length>0){
																myDefense+=shield[0].defense;
																
													var Weapon=req.models.weapon;
									
													Weapon.find({weaponID : myEquipment[0].weaponID}, function(err,weapon){
														if(!err){
															if(weapon.length>0){
																myDmg+=weapon[0].damage_max;
																
	
	    		
	    		var Mobs = req.models.mob;
	    			Mobs.find({ name : moob_name }, function(err, mobs) {
					if(!err) {
					if(mobs.length>0){
	    			var ok = true;
	    										if(user[0].hp > 10){
												while(ok){
													
													var n = Math.round(Math.random()*100) + 1;
													
													if(n<myHitChance){
														enemyHp=enemyHp-myDmg;
													}
													var n = Math.round(Math.random()*100) + 1;
													if(n<enemyHitChance){
														myHp=myHp-enemyDmg;
													}
													
													console.log("round"+round);
													console.log("enemyHP:"+enemyHp);
													console.log("myHp:"+myHp);
													
													
													if(round>15 || enemyHp<=0 || myHp<=0) {
														ok = false;
													}
													
													var winner;
													
															if(!ok){
													if(myHp>0 && enemyHp<=0){
														console.log("A castigat"+ myUserName);
														json_rndBattle += myUserName + "\" }";

														var Char = req.models.character;
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});

														res.redirect('/BattleResult');
													}
													else if(enemyHp>0 && myHp<=0){
														console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
													
	    												Char.find({ userID : enemyID }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														char[0].xp = char[0].xp + 50;
	    														
	    														if(char[0].hp < 10){
	    															char[0].hp =0;
	    														}
	    														else char[0].hp -= 10;
	    														
	    														if(char[0].xp>=Math.pow(2,char[0].level-1)*100)
	    														{
	    															char[0].level = char[0].level + 1;
	    															char[0].max_hp += 30;
	    															char[0].strength += 2;
	    															char[0].agility += 2;
	    															char[0].charisma += 2;
	    															char[0].stamina += 2;
	    														}
	    														
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												Char.find({ userID : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														
	    														if(char[0].hp <30){
	    															char[0].hp=0;
	    														}
	    														else{
	    															char[0].hp -=30;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
	    													}else console.log(err);
	    												});
	    												
	    												res.redirect('/BattleResult');
													}
													else {
														console.log("Draw");
														json_rndBattle += "Draw" + "\" }";
													
														
																console.log("A castigat" + enemyName);
														json_rndBattle += enemyName + "\" }";
														
														
														var Char = req.models.character;
		
	    												Char.find({ username : enemyName }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    												
	    												Char.find({ username : req.session.user_id }, function(err, char) {
	    													if(!err) {
	    														char[0].gold = char[0].gold + 50;
	    														if(char[0].hp<20){
	    															char[0].hp = 0;
	    														}
	    														else{
	    															char[0].hp -= 20;
	    														}
																char[0].save(function (err) {
					    											if(err) {
					    												throw err;
					    											}
		    													});
		    												
		    													
	    													}else console.log(err);
	    												});
	    													res.redirect('/BattleResult');
													}
															
												}
													round++;
												}
												}
	    		
	    			}													

		    												
		}else console.log(err);
		});
	    	}													

		    												
		}else console.log(err);
		});
		
		});*/
	
	app.post('/training',function(req,res){
		var character=req.models.character;
		character.find({ userID:req.session.user_id  }).each(function (person) {
			person.strength = req.body.newStrength;
			person.agility = req.body.newAgility;
			person.charisma = req.body.newCharisma;
			person.stamina = req.body.newStamina;
		//	person.gold = req.body.newGold;
		}).save(function (err) {
			if(err) {
				throw err;
			}
		});
	});
	
	app.get('/work',function(req,res){
		var jobs = req.models.jobs;
		var work = req.models.work;
		jobs.find({},function(err,joblist){
			if(!err){
				if(joblist.length > 0) {
					var jsonJobs="{ \"jobs\" : [";
					var now=new Date();
					for(var index = 0; index < joblist.length; index++) {
						jsonJobs+="{ \"jobname\" : \""+joblist[index].jobname+"\","+
									"\"maxhours\": "+joblist[index].maxhours+","+
									"\"minhours\": "+joblist[index].minhours+","+
									"\"salary\": "+joblist[index].salary+",";
						if(joblist[index].reward==undefined || joblist[index].reward == ""){
							jsonJobs+="\"reward\": \"-\" }";;
						}else{
							jsonJobs+="\"reward\": \""+joblist[index].reward+"\"}";;
						}
						if(index<joblist.length-1){
							jsonJobs+=",";
						}else{
							if(index==joblist.length-1){
								work.find({userId : req.session.user_id},function(err,job){
									if(!err) {
										if(job.length>0){
											console.log(now.toString());
											console.log(job[0].jobend);
											if(Date.parse(now.toString())>Date.parse(job[0].jobend.toString())){
												jsonJobs+="],\"working\":"+true+",\"jobdone\":"+true+"}";
											}else{
												jsonJobs+="],\"working\":"+true+",\"jobdone\":"+false+",\"timestamp\":"+Date.parse(job[0].jobend.toString())+"}";
											}
											console.log(jsonJobs);
											res.writeHead(200, {"Content-Type": "text/plain"});
											res.end(jsonJobs);
										}else{
											jsonJobs+="],\"working\":"+false+"}";
											console.log(jsonJobs);
											res.writeHead(200, {"Content-Type": "text/plain"});
											res.end(jsonJobs);
										}
									}
								});	
							}
						}	
					}
				}
			}else{console.log(err);}	
		});
	});
	
	app.post('/work',function(req,res){
		var job=req.body.job;
		var hours=req.body.hours;
		console.log("You will work as a "+job+" for the next "+hours+" hours");
		var work=req.models.work;
		var jobs=req.models.jobs;
		jobs.find({jobname:job},function(err,thejob){
			if(!err) {
				if(thejob.length > 0) {
					var totalValue=hours*thejob[0].salary;
					var currentdate = new Date();
					var datemill=Date.parse(currentdate.toString())+1000*60*60*hours;
					var newDate=new Date(datemill);
					console.log("INSERT INTO TABLE work VALUES ("+req.session.user_id+","+newDate+","+thejob[0].reward+","+totalValue+")")
					work.create([{userId : req.session.user_id , jobend : newDate , rewarditem : thejob[0].reward , totalreward : totalValue,}],function(err,items){if(err)console.log(err)});
				}
			}
		});
	});
	
	app.post('/jobdone',function(req,res){
		var id = req.session.user_id;
		var works=req.models.work;
		works.get(id, function(err, work){
			if(!err) {
				var item = work.rewarditem;
				var gold = work.totalreward;
				if(req.session.origin == "west") {
					gold += gold/10;
				}
				
				var Char = req.models.character;
		
	    		Char.find({ userID : id }, function(err, char) {
	    			if(!err) {
	    				char[0].gold = char[0].gold + gold;
						char[0].save(function (err) {
					    	if(err) {
					    		throw err;
					    	}
		    			});
	    			}
	    		});
				
				work.remove(function (err) {
					if(!err) {
						console.log("removed!");
					}
				});
				
				var item_id = 0;
				switch(item) {
					case "fish":
						item_id = 2;
						break;
					case "muffin":
						item_id = 3;
						break;
					case "bread":
						item_id = 4;
						break;
				}
				var inv = req.models.inventory;
				var found = false;
				var result = function(i) {
					var inv_no = i;
					console.log("Checking inventory" + inv_no);
					inv.find({ userID : id, inventory_number : inv_no }, function(err, inventories) {
						if(!err) {
							if(inventories.length < 8) {
								if(inventories.length == 0) {
									console.log("Position clear: " + Math.floor(j/4) + ", " + j%4);
									inv.create([{userID : id,
														itemID : item_id,
														itemType : "food",
														inventory_number : inv_no,
														inventory_x_position : 0,
														inventory_y_position : 0 }], function(err,items) { if(err) console.log(err) });
									found = true;
									res.writeHead(200, {"Content-Type": "text/plain"});
				    				res.end();
								}
								else {
									var vector = [];
									for(var j = 0; j < inventories.length; j++) {
										vector[inventories[j].inventory_x_position*4 + inventories[j].inventory_y_position] = 1;
									}
									for(j = 0; j < 8; j++) {
										if(vector[j] == undefined && !found) {
											console.log("Position clear: " + Math.floor(j/4) + ", " + j%4);
											inv.create([{userID : id,
														itemID : item_id,
														itemType : "food",
														inventory_number : inv_no,
														inventory_x_position : Math.floor(j/4),
														inventory_y_position : j%4 }], function(err,items) { if(err) console.log(err) });
											found = true;
											res.writeHead(200, {"Content-Type": "text/plain"});
	    									res.end();
										}
										else {
											console.log("Was actually " + vector[j]);
										}
										if(found) {
											break;
										}
									}
								}
							}
							else {
								if(i < 5) {
				    				result(i+1);
								}
							}
						}
						else console.log(err);
					});
				};
				result(1);
				//console.log("removed!");
			}
		});
	});
	
	////////////////////////////end
	
	app.get('*', function(req, res) {
		if(!isLoggedIn(req, res, function() {})) {
			res.redirect('/');
		}
    });
	
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

