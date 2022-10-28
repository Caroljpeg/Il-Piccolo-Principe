

var game = new Phaser.Game(1024, 768, Phaser.WEBGL, '', { preload: preload, create: create, update: update, render: render });

function preload() {
	game.load.crossOrigin = 'anonymous';

	//game.load.baseURL = 'http://examples.phaser.io/assets/' ;
	game.load.path = 'game/';
	game.load.image('background','img/background.png');
	game.load.image('moneta1','img/moneta1.png');
	game.load.image('stella1','img/stella1.png');
	game.load.image('moneta2','img/moneta2.png');
	game.load.image('stella2','img/stella2.png');
	game.load.image('moneta3','img/moneta3.png');
	game.load.image('stella3','img/stella3.png');
	game.load.image('platform', 'img/platform.png');
	game.load.image('platform2','img/platform2.png');
	game.load.image('platform3', 'img/platform3.png');
	game.load.image('coin', 'img/coin.png');
	game.load.image('star', 'img/star.png');
	game.load.spritesheet('principe', 'img/principe.png', 65, 70, 14);
	game.load.spritesheet('principe_lumin', 'img/principe_lumin.png', 65, 70, 14);
	game.load.spritesheet('principe_torcia', 'img/principe_torcia.png', 65, 70, 14);
	game.load.spritesheet('aviatore', 'img/aviatore.png', 63.75,100, 14);
	game.load.spritesheet('enemy', 'img/serpente.png', 200, 70, 6);
	game.load.image('rose', 'img/rose.png');
	game.load.image('checkpoint_on','img/Checkpoint_on.png');
	game.load.image('checkpoint_off','img/Checkpoint_off.png');
	game.load.image('fakewall','img/fakewall.png');
	game.load.image('fakewall2','img/fakewall2.png');
	game.load.image('tap','img/tap.png');
	game.load.image('tap2','img/tap2.png');
	game.load.spritesheet('king', 'img/Re.png', 87, 157, 6);
	game.load.image('messageBoxKing','img/message_box_king.png');
	game.load.image('messageBoxStart','img/message_box_start.png');
	game.load.image('messageBoxTips','img/message_box_tips.png');
	game.load.spritesheet('sign', 'img/sign.png', 150, 150, 7);
	game.load.spritesheet('notAnimated', 'img/tree.png', 200, 200, 15);
	game.load.image('fog','img/fog.png');
	game.load.image('peso bianco','img/peso bianco.png');
	game.load.image('murostick','img/murostick.png');
	game.load.image('murostick2','img/murostick2.png');
	game.load.image('murostick3','img/murostick3.png');
	game.load.image('murostick4','img/murostick4.png');
	game.load.image('murostick5','img/murostick5.png');
	game.load.image('murostick6','img/murostick6.png');
	game.load.image('murostick7','img/murostick7.png');
	game.load.image('murostick8','img/murostick8.png');
	game.load.image('murostick9','img/murostick9.png');
	game.load.image('murostick10','img/murostick10.png');
	game.load.image('shaded_wall','img/Shaded_wall.png');
	game.load.image('piatstick','img/piatstick.png');
	game.load.image('piatstick2','img/piatstick2.png');
	game.load.image('underground','img/underground.png');
	game.load.image('Planetoide_re','img/Planetoide_re.png');
	game.load.image('Info_av','img/Info_av.png');
	game.load.image('Info_pp','img/Info_pp.png');
	game.load.spritesheet('lever', 'img/leva.png', 200, 150, 4);
	game.load.image('finishCoin','img/finish_coin.png');
	game.load.image('finishStar','img/finish_star.png');
	game.load.image('tutorial5','img/tutorial5.png');
	game.load.image('tutorial4','img/tutorial4.png');
	game.load.image('tutorial3','img/tutorial3.png');
	game.load.image('tutorial2','img/tutorial2.png');
	game.load.image('tutorial1','img/tutorial1.png');
	game.load.json('map', 'tilemap.json');
}

// Map.
var map;
var backgrounds;
var undergrounds;
var platforms;
var platformsBlue;
var checkPoints;
var stars;
var coins;
var buttons;
var walls;
var roses;
var shaded;
var signs;
var animated;
var enemies;
var endGame;

// Player.
var player;
var initialPosition;
var facing = 'right';
var jumpState = 'none';
var jumpTimer = 0;
var jumping = false;

// King.
var king;

// Inputs.
var cursors;
var jumpButton;
var swapButton;
var pauseInput = true;

// Interfaces.
var messageBox;
var messageBoxText;
var messageBoxChoose;
var messageBoxChooseCursor;
var counterImages;
var fog;
var fogIn;
var fogOut;
var fogZone;
var quickBoxMessageGraphic;
var quickBoxMessageText;
var faceInfo;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.time.desiredFps = 30;

	// Making Map.
	map = game.cache.getJSON('map');

	// Groups
	backgrounds = game.add.group();
	undergrounds = game.add.physicsGroup();
	platforms = game.add.physicsGroup();
	platformsBlue = game.add.physicsGroup();
	shaded = game.add.physicsGroup();
	checkPoints = game.add.physicsGroup();
	stars = game.add.physicsGroup();
	coins = game.add.physicsGroup();
	buttons = game.add.physicsGroup();
	walls = game.add.physicsGroup();
	roses = game.add.physicsGroup();
	signs = game.add.physicsGroup();
	animated = game.add.physicsGroup();
	enemies = game.add.physicsGroup();

	map.layers.forEach(layer => {
		layer.objects.forEach(object => {
			if (layer.name == 'backgrounds') {
				let key = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.replace('img/', '').replace('.png', '');
				let sprite = backgrounds.create(object.x, object.y, key);
				sprite.width = object.width;
				sprite.height = object.height;
				if (object.properties) {
					object.properties.forEach(property => {
						if (property.name == 'stars') {
							sprite.data.stars = property.value;
						} else if (property.name == 'coins') {
							sprite.data.coins = property.value;
						}
					});
				}
				if (sprite.data.stars || sprite.data.coins) {
					sprite.alpha = 0.0;
				}
				backgrounds.add(sprite);
			} else if (layer.name == 'underground') {
				let key = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.replace('img/', '').replace('.png', '');
				let sprite = undergrounds.create(object.x, object.y, key);
				sprite.width = object.width;
				sprite.height = object.height;
				undergrounds.add(sprite);
			} else if (layer.name == 'platforms') {
				if (object.gid) {
					addPlatform(layer, object, platforms);
				}
			} else if (layer.name == 'platforms_movable') {
				if (object.gid) {
					addPlatform(layer, object, platforms);
				}
			} else if (layer.name == 'platforms_blue') {
				if (object.gid) {
					platform = addPlatform(layer, object, platformsBlue);
					platform.data.initialPosition = {x: platform.x, y: platform.y};
				}
			} else if (layer.name == 'shades') {
				if (object.gid) {
					addPlatform(layer, object, shaded);
				}
			} else if (layer.name == 'enemies') {
				let key = '';
				let moveSpeed = 75;
				let leftDir = true;
				let distance = 100;
				if (object.properties) {
					object.properties.forEach(property => {
						if (property.name === 'sprite') {
							key = property.value;
						} else if (property.name === 'moveSpeed') {
							moveSpeed = property.value;
						} else if (property.name === 'leftDir') {
							leftDir = property.value;
						} else if (property.name === 'distance') {
							distance = property.value;
						}
					});
				}
				let enemy = game.add.sprite(object.x, object.y, key);
				enemy.anchor.set(0.5, 1.0);
				enemy.animations.add('move', [6, 5, 4, 3, 2, 1, 0], 10, true);
				enemy.data.moveSpeed = moveSpeed;
				enemy.scale.set( 0.6 , 0.6);
				enemy.data.leftDir = leftDir;
				enemy.data.distance = distance;
				enemy.data.startX = object.x;
				enemies.add(enemy);
				enemy.body.gravity.y = 500;
				let targetX = (leftDir ? object.x - distance : object.x + distance);
				let tween = game.add.tween(enemy).to({x: targetX}, distance / moveSpeed * 1000, 'Linear', true, 0, -1);
				tween.yoyo(true);
				tween.onLoop.add(() => {
					enemy.scale.x *= -1;
				});
				enemy.animations.play('move');
			} else if (layer.name == 'events') {
				switch(object.type) {
					case "initial_position": // Player
						initialPosition = new Phaser.Point(object.x, object.y);
						break;
					case "button":
						let button = game.add.sprite(object.x + object.width / 2, object.y + object.height / 2, 'lever');
						button.width = object.width;
						button.height = object.height;
						button.anchor.set(0, 0);
						button.scale.set(0.4,0.4);
						if (object.properties) {
							object.properties.forEach(property => {
								if (property.name == 'wall') {
									button.data.wall = property.value;
								}
							});
						}
						button.animations.add('press', [0, 1, 2, 3], 4, false);
						buttons.add(button);
						break;
					case "wall":
						let key = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.replace('img/', '').replace('.png', '');
						let wall = walls.create(object.x + object.width / 2, object.y + object.height / 2, key);
						wall.width = object.width;
						wall.height = object.height;
						wall.anchor.set(0.5, 0.5);
						if (object.properties) {
							object.properties.forEach(property => {
								if (property.name == 'button') {
									wall.data.button = property.value;
								}
							});
						}
						break;
					case "king":
						king = game.add.sprite(object.x + object.width / 2, object.y + object.height / 2, 'king');
						king.anchor.set(0.5, 1.0);
						king.animations.add('idle', [0, 1, 2, 3, 4, 5], 4, true);
						king.animations.play('idle');
						king.data.box = new Phaser.Rectangle(king.x - 150, king.y - 150, 300, 300);
						break;
					case "game_world_size":
						game.world.setBounds(object.x, object.y, object.width, object.height);
						break;
					case "fog_in":
						fogIn = new Phaser.Rectangle(object.x, object.y, object.width, object.height);
						break;
					case "fog_out":
						fogOut = new Phaser.Rectangle(object.x, object.y, object.width, object.height);
						break;
					case "fog_zone":
						fogZone = game.add.graphics(object.x, object.y);
						fogZone.beginFill(0x000000, 1);
						fogZone.drawRect(0, 0, object.width, object.height);
						fogZone.endFill();
						fogZone.data.box = new Phaser.Rectangle(object.x, object.y, object.width, object.height);
						break;
					case "end_game":
						let key2 = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.replace('img/', '').replace('.png', '');
						endGame = game.add.sprite(object.x + object.width / 2, object.y + object.height / 2, key2);
						game.physics.arcade.enable(endGame);
						endGame.width = object.width;
						endGame.height = object.height;
						endGame.anchor.set(0.5, 0.5);
						break;
				}
			} else if (layer.name == 'signs') {
				sign = game.add.image(object.x + object.width / 2, object.y + object.height / 2, 'sign');
				sign.animations.add('close', [1, 2, 3, 4, 5, 6], 10, false);
				sign.animations.add('futher', [5, 4, 3, 2, 1, 0], 10, false);
				sign.anchor.set(0.5, 0.5);
				sign.alpha = 0.0;
				signs.add(sign);
			} else if (layer.name == 'animated') {
				anim = game.add.sprite(object.x + object.width / 2, object.y + object.height / 2, 'notAnimated');
				anim.anchor.set(0.5, 0.5);
				anim.animations.add('close', [1, 2, 3, 4, 5, 6, 7], 10, false);
				anim.animations.add('futher', [6, 5, 4, 3, 2, 1, 0], 10, false);
				anim.alpha = 0.0;
				animated.add(anim);
			} else if (layer.name == 'images') {
				let key = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.replace('img/', '').replace('.png', '');
				let image = game.add.image(object.x + object.width / 2, object.y + object.height / 2, key);
				image.width = object.width;
				image.height = object.height;
				image.anchor.set(0.5, 0.5);
			} else if (layer.name == 'check_points') {
				let checkPoint = checkPoints.create(object.x + object.width / 2, object.y + object.height / 2, 'checkpoint_off');
				checkPoint.width = object.width;
				checkPoint.height = object.height;
				checkPoint.anchor.set(0.5, 0.5);
				let priority = 0;
				if (object.properties) {
					object.properties.forEach(property => {
						if (property.name == 'priority') {
							priority = property.value;
						}
					});
				}
				checkPoint.data.priority = priority;
				checkPoint.data.activated = false;
			} else if (layer.name == 'roses') {
				let rose = roses.create(object.x + object.width / 2, object.y + object.height / 2, 'rose');
				rose.width = object.width;
				rose.height = object.height;
				rose.anchor.set(0.5, 0.5);
				if (object.properties) {
					object.properties.forEach(property => {
						if (property.name == 'flipY') {
							rose.scale.y *= (property.value ? -1.0 : 1.0);
						}
					});
				}
			} else if (layer.name == 'coins') {
				let coin = coins.create(object.x + object.width / 2, object.y + object.height / 2, 'coin');
				coin.width = object.width;
				coin.height = object.height;
				coin.anchor.set(0.5, 0.5);
				game.add.tween(coin).to({y: coin.y - 18}, 1000, 'Linear', true, 0, -1).yoyo(true);
			} else if (layer.name == 'stars') {
				let star = stars.create(object.x + object.width / 2, object.y + object.height / 2, 'star');
				star.width = object.width;
				star.height = object.height;
				star.anchor.set(0.5, 0.5);
				game.add.tween(star).to({y: star.y - 18}, 1000, 'Linear', true, 0, -1).yoyo(true);
			}
		});
	});

	platforms.setAll('body.immovable', true);
	platformsBlue.setAll('body.immovable', true);
	shaded.setAll('body.immovable', true);
	walls.setAll('body.immovable', true);
	game.world.bringToTop(enemies);
	game.world.bringToTop(king);
	game.world.bringToTop(fogZone);
	game.world.bringToTop(animated);
	game.world.bringToTop(roses);

	// Inputs.
	cursors = game.input.keyboard.createCursorKeys();

	game.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(() => {
		player.data.godMode = !player.data.godMode;
	});

	// Jump.
	game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(() => {
		if (pauseInput) {
			if (messageBox.data.spacebar) {
				if (messageBox.data.choosing && messageBox.data.chooseCallback) {
					messageBox.data.chooseCallback(messageBox.data.chooseIndex);
				}
				nextMessageBox();
			}
			return;
		}
		let canJump = false;
		if (player.key == 'aviatore' && player.data.jumpCount < 2) {
			canJump = true;
		}
		if (((player.body.onFloor() || player.body.touching.down) && game.time.now > jumpTimer) || canJump) {
			player.body.velocity.y = 0;
			player.animations.play('jump_impulse');
		}
	});

	// Swap player.
	game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(swapPlayer, this);

	// Message box choose cursor.
	game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(() => {
		if (messageBox.data.choosing) {
			messageBox.data.chooseIndex--;
			if (messageBox.data.chooseIndex < 0) {
				messageBox.data.chooseIndex = 0;
			}
			refreshMessageBoxChooseCursor();
		}
	});
	game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(() => {
		if (messageBox.data.choosing) {
			messageBox.data.chooseIndex++;
			if (messageBox.data.chooseIndex >= messageBoxChoose.children.length) {
				messageBox.data.chooseIndex = messageBoxChoose.children.length - 1;
			}
			refreshMessageBoxChooseCursor();
		}
	});

	// Fog
	fog = game.add.image(0, 0, 'fog');
	fog.anchor.set(0.5, 0.5);


	// Player
	player = game.add.sprite(initialPosition.x, initialPosition.y, 'aviatore');
	game.physics.arcade.enable(player);
	player.body.collideWorldBounds = true;
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 500;
	player.animations.add('move', [6, 5, 4, 3, 2, 1, 0], 10, true);
	player.animations.add('jump_impulse', [13, 12, 11], 10, false);
	player.animations.add('jump_floating', [10], 5, false);
	player.animations.add('jump_falling', [9], 5, false);
	player.animations.add('jump_down', [8, 13], 8, false);
	player.events.onAnimationComplete.add(playerAnimationOnComplete, this);
	player.data.initialPosition = {x: initialPosition.x, y: initialPosition.y}
	player.data.starsCount = 0;
	player.data.coinsCount = 0;
	player.data.jumpCount = 0;
	player.data.powerShade = false;
	player.data.powerFog = false;
	player.data.powerSign = false;
	player.data.powerAnimated = false;
	player.data.inFogZone = false;
	player.data.startMessage = true;
	player.data.endGame = false;
	player.data.canNotSwap = false;

	//player.data.godMode = true;

	// Camera.
	game.camera.follow(player, 0.1, 0.1);
	game.camera.focusOn(player)

	// Message Box.
	messageBox = game.add.image(0, 0, 'messageBoxStart');
	messageBox.fixedToCamera = true;
	messageBox.data.texts = [];
	messageBox.data.textsIndex = 0
	messageBox.data.spacebar = false;
	messageBox.data.choosing = false;
	messageBox.data.chooseIndex = 0;

	messageBoxText = game.add.text(0, 0, '', {wordWrap: true, wordWrapWidth: 650});
	messageBoxText.fixedToCamera = true;

	messageBoxChoose = game.add.group();
	messageBoxChooseCursor = game.add.graphics(0, 0);
	messageBoxChooseCursor.fixedToCamera = true;
	setupMessageBox('start');
	hideMessageBox();

	quickBoxMessageGraphic = game.add.graphics();
	quickBoxMessageGraphic.fixedToCamera = true;
	quickBoxMessageGraphic.alpha = 0.0;

	quickBoxMessageText = game.add.text(0, 0, '', {fill: '#ffffff', wordWrap: true, wordWrapWidth: 700});
	quickBoxMessageText.fixedToCamera = true;
	quickBoxMessageText.cameraOffset.set(game.width / 2, game.height * 0.75);
	quickBoxMessageText.anchor.set(0.5, 0.5);
	quickBoxMessageText.alpha = 0.0;

	// Interface
	counterImages = game.add.group();
	let count = 3;
	for (let i = 0; i < count; i++) {
		image = game.add.image(0, 0, '');
		image.fixedToCamera = true;
		image.cameraOffset.set(game.width - 32 - (50 * ((count - 1) - i)), 24);
		image.anchor.set(13.2, -0.4);
		counterImages.add(image);
	}

	faceInfo = game.add.image(0, 0, 'Info_av');
	faceInfo.fixedToCamera = true;
	faceInfo.scale.set(0.8)
	faceInfo.cameraOffset.set(20, 16);
	pauseInput = false;
}

function addPlatform(layer, object, group) {
	let key = map.tilesets[0].tiles.find(t => t.id == object.gid - 1).image.toLowerCase().replace('img/', '').replace('.png', '');
	let sprite = group.create(object.x + object.width / 2, object.y + object.height / 2, key);
	sprite.width = object.width;
	sprite.height = object.height;
	sprite.anchor.set(0.5, 0.5);
	if (object.properties) {
		object.properties.forEach(property => {
			if (property.name == 'path') {
				layer.objects.forEach(o => {
					if (o.id == property.value) {
						let path = {
							x: o.x,
							y: o.y,
							polyline: []
						}
						o.polyline.forEach(point => {
							path.polyline.push(point);
						});
						let reversePoints = o.polyline.reverse();
						reversePoints.shift();
						reversePoints.pop();
						reversePoints.forEach(point => {
							path.polyline.push(point);
						});
						sprite.data.path = path;
						sprite.data.pathIndex = 0;
					}
				});
			} else if (property.name == 'moveSpeed') {
				sprite.data.moveSpeed = property.value;
			} else if (property.name == 'flipY') {
				sprite.scale.y *= (property.value ? -1.0 : 1.0);
			}
		});
	}
	return sprite;
}

function setupMessageBox(type) {
	if (type === 'start') {
		messageBox.loadTexture('messageBoxStart');
		messageBox.scale.set(0.4, 0.4);
		messageBox.cameraOffset.x = game.width / 2 - messageBox.width / 2;
		messageBox.cameraOffset.y = game.height - messageBox.height - game.height * 0.1;

		messageBoxText.cameraOffset.x = messageBox.cameraOffset.x + 45;
		messageBoxText.cameraOffset.y = messageBox.cameraOffset.y + 385;
		messageBoxText.scale.set(0.8, 0.8);
	} else if (type === 'king') {
		messageBox.loadTexture('messageBoxKing');
		messageBox.scale.set(0.4, 0.4);
		messageBox.cameraOffset.x = game.width / 2 - messageBox.width / 2;
		messageBox.cameraOffset.y = game.height - messageBox.height - game.height * 0.1;


		messageBoxText.cameraOffset.x = messageBox.cameraOffset.x + 85;
		messageBoxText.cameraOffset.y = messageBox.cameraOffset.y + 80;
	} else if (type === 'tips') {
		messageBox.loadTexture('messageBoxTips');
		messageBox.scale.set(0.4, 0.4);
		messageBox.cameraOffset.x = game.width / 2 - messageBox.width / 2;
		messageBox.cameraOffset.y = game.height - messageBox.height - game.height * 0.1;

		messageBoxText.cameraOffset.x = messageBox.cameraOffset.x + 85;
		messageBoxText.cameraOffset.y = messageBox.cameraOffset.y + 30;
		messageBoxText.scale.set(0.8, 0.8);
	}
}

function showMessageBox() {
	pauseInput = true;
	messageBox.alpha = 1.0;
	messageBoxText.alpha = 1.0;
	nextMessageBox();
}

function hideMessageBox(text) {
	messageBoxChoose.removeAll(true);
	messageBoxChooseCursor.clear();
	messageBox.data.choosing = false;
	messageBox.alpha = 0.0;
	messageBoxText.alpha = 0.0;
	pauseInput = false;
}

function textMessageBox(text) {
	let choose;
	let chooseCallback;
	if (Array.isArray(text)) {
		let string = text.shift();
		chooseCallback = text.pop();
		choose = text;
		text = string;
	}
	messageBoxChoose.removeAll(true);
	messageBoxChooseCursor.clear();
	messageBox.data.spacebar = false;
	messageBox.data.choosing = false;
	messageBox.data.chooseIndex = 0;
	messageBoxText.text = text;
	messageBox.data.spacebar = true;
	if (choose) {
		let centerPoint = new Phaser.Point(messageBox.cameraOffset.x + 400, messageBox.cameraOffset.y + 180);
		for (var j = 0; j < choose.length; j++) {
			c = choose[j];
			let t = game.add.text(0, 0, c);
			t.fixedToCamera = true;
			if (j == 0) {
				t.cameraOffset.x = centerPoint.x - t.width - 20;
			} else {
				t.cameraOffset.x = centerPoint.x + t.width + 20;
			}
			t.cameraOffset.y = centerPoint.y;
			messageBoxChoose.add(t);
		}
		messageBox.data.choosing = true;
		messageBox.data.chooseCallback = chooseCallback;
		refreshMessageBoxChooseCursor();
		messageBoxChooseCursor.alpha = 0.5;
	}
}

function refreshMessageBoxChooseCursor() {
	let text = messageBoxChoose.children[messageBox.data.chooseIndex];
	messageBoxChooseCursor.clear();
	messageBoxChooseCursor.beginFill(0x00FF00, 1);
	messageBoxChooseCursor.drawRect(0, 0, text.width + 4, text.height + 4);
	messageBoxChooseCursor.endFill();
	messageBoxChooseCursor.cameraOffset.x = text.cameraOffset.x - 2;
	messageBoxChooseCursor.cameraOffset.y = text.cameraOffset.y - 2;
}

function nextMessageBox() {
	if (messageBox.data.textsIndex >= messageBox.data.texts.length) {
		hideMessageBox();
		return;
	}
	textMessageBox(messageBox.data.texts[messageBox.data.textsIndex]);
	messageBox.data.textsIndex++;
}

function showQuickBoxMessage(message) {
	let text = quickBoxMessageText;
	quickBoxMessageGraphic.alpha = 0.4;
	quickBoxMessageText.alpha = 1.0;
	quickBoxMessageText.text = message;

	quickBoxMessageGraphic.clear();
	quickBoxMessageGraphic.beginFill(0x000000, 1);
	quickBoxMessageGraphic.drawRect(- (text.width + 4) / 2, - (text.height + 4) / 2, text.width + 4, text.height + 4);
	quickBoxMessageGraphic.endFill();
	quickBoxMessageGraphic.cameraOffset.x = text.cameraOffset.x - 2;
	quickBoxMessageGraphic.cameraOffset.y = text.cameraOffset.y - 2;
}

function hideQuickBoxMessage() {
	if (quickBoxMessageGraphic) {
		quickBoxMessageGraphic.alpha = 0.0;
	}
	if (quickBoxMessageText) {
		quickBoxMessageText.alpha = 0.0;
	}
}

function swapPlayer() {
	if (pauseInput || player.data.canNotSwap) {
		return;
	}
	if (player.key == 'aviatore') {
		if (faceInfo.key !== 'Info_pp') {
			faceInfo.loadTexture('Info_pp');
		}
		if (player.data.inFogZone) {
			player.loadTexture('principe_torcia', 8);
		} else {
			player.loadTexture('principe', 8);
		}
		player.body.setSize(45, 92, 0, 0);
		player.anchor.set(0.5, 1);
	} else {
		if (faceInfo.key !== 'Info_av') {
			faceInfo.loadTexture('Info_av');
		}
		if (player.data.powerShade) {
			shaded.setAll('alpha', 1.0);
		}
		player.loadTexture('aviatore', 8);
		player.body.setSize(45, 64, 0, 0);
		player.anchor.set(0.5, 1);
	}
	playerCheckAnimation();
}

function update() {

	if (player.data.startMessage) {
        player.data.startMessage = false;

        messageBox.data.textsIndex = 0;
        messageBox.data.texts = [];
        messageBox.data.texts[0] = 'Come puoi aver perduto la tua innocente meraviglia dopo averla insegnata a me?';
        setupMessageBox('start');
        showMessageBox();
        pauseInput = false;
        game.time.events.add(5000, () => {
            hideMessageBox();
            messageBox.data.textsIndex = 0;
            messageBox.data.texts = [];
            messageBox.data.texts[0] = 'Io ho riscoperto l’essenza della fanciullezza            e tu ora vuoi crescere e disilluderti, sei certo            di desiderarlo?';
            setupMessageBox('start');
            showMessageBox();
            pauseInput = false;
            game.time.events.add(5000, () => { hideMessageBox();});
        });
    }

	if (player.key == 'aviatore') {
		player.body.setSize(45, 92, 0, 0);
		player.anchor.set(0.5, 1);
	} else {
		player.body.setSize(45, 64, 0, 0);
		player.anchor.set(0.5, 1);
	}

	if (player.data.coinsCount > 0) {
		for (let i = counterImages.children.length - 1; i >= 0; i--) {
			let image = counterImages.children[i];
			if (image.key !== 'coin') {
				image.loadTexture('coin');
			}
			if (i < player.data.coinsCount) {
				image.alpha = 1.0;
			} else {
				image.alpha = 0.3;
			}
		}
	} else if (player.data.starsCount > 0) {
		for (let i = counterImages.children.length - 1; i >= 0; i--) {
			let image = counterImages.children[i];
			if (image.key !== 'star') {
				image.loadTexture('star');
			}
			if (i < player.data.starsCount) {
				image.alpha = 1.0;
			} else {
				image.alpha = 0.3;
			}
		}
	}

	platforms.children.forEach(platform => {
		if (platform.data.path) {
			let index = platform.data.pathIndex;
			let path = platform.data.path;
			let point = platform.data.path.polyline[index];
			let moveSpeed = platform.data.moveSpeed || 50;
			let destination = {
				x: path.x + point.x,
				y: path.y + point.y
			}
			game.physics.arcade.moveToObject(platform, destination, moveSpeed);
			if (Phaser.Math.distance(platform.x, platform.y, destination.x, destination.y) <= moveSpeed * 0.1) {
				platform.data.pathIndex = (index + 1) % path.polyline.length;
			}
		}
	});

	// Player movement.
	if (pauseInput || player.animations.currentAnim.name == 'jump_impulse') {
		player.body.velocity.x = 0;
	} else {
		let move_speed = (player.key == 'aviatore' ? 200 : (jumping ? 250 : 400));
		player.body.velocity.x = 0;
		if (cursors.left.isDown) {
			player.body.velocity.x = -move_speed;
			facing = 'left';
		} else if (cursors.right.isDown) {
			player.body.velocity.x = move_speed;
			facing = 'right';
		}
	}

	if (facing == 'left') {
		player.scale.x = 1.0;
		if (fog.scale.x > 0) {
			fog.scale.x = -fog.scale.x;
		}
	} else {
		player.scale.x = -1.0
		fog.scale.x = Math.abs(fog.scale.x);
	}

	// Collisions.
	game.physics.arcade.collide(player, walls);
	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(enemies, walls);
	game.physics.arcade.collide(enemies, platforms);
	game.physics.arcade.overlap(player, enemies, () => killPlayer());
	game.physics.arcade.overlap(player, endGame, () => theEndGame());

	platformsBlue.children.forEach(platform => {
		if (game.physics.arcade.collide(player, platform)) {
			if (player.key == 'aviatore') {
				platform.body.velocity.y = 50;
			} else {
				platform.body.velocity.y = -100;
			}
		} else {
			let destination = platform.data.initialPosition;
			let x_min = (platform.x - platform.width / 2);
			let x_max = (platform.x + platform.width / 2);
			if (platform.y - player.y <= 15 && x_min - player.x < 15 && player.x - x_max < 15) {
				return;
			}
			if (Phaser.Math.distance(platform.x, platform.y, destination.x, destination.y) <= 5) {
				platform.body.velocity.y = 0;
				platform.y = destination.y;
			} else {
				game.physics.arcade.moveToObject(platform, destination, 75);
			}
		}
	});

	// Stars
	game.physics.arcade.overlap(player, stars, (player, star) => {
		star.body.enable = false;
		player.data.starsCount++;
		player.data.coinsCount = 0;
		coins.setAll('alpha', 1);
		coins.setAll('body.enable', true);
		for (let starsCount = 0; starsCount <= 3; starsCount++) {
			if (player.data.starsCount == starsCount) {
				backgrounds.children.forEach(background => {
					if (background.data.stars === undefined || background.data.coins === undefined) {
						return;
					}
					if (background.data.stars == starsCount) {
						game.add.tween(background).to({alpha: 1.0}, 500, 'Linear', true);
					} else {
						game.add.tween(background).to({alpha: 0.0}, 500, 'Linear', true);
					}
				});
				break;
			}
		}
		game.add.tween(star.scale).to({x: 1.2, y: 1.2}, 300, 'Linear', true).onComplete.add(() => {
			game.add.tween(star.scale).to({x: 0.0, y: 0.0}, 500, 'Linear', true).onComplete.add(() => {
				star.alpha = 0;
				star.scale.set(1.0, 1.0);
			});
		});
	});

	// Coins
	game.physics.arcade.overlap(player, coins, (player, coin) => {
		coin.body.enable = false;
		player.data.coinsCount++;
		player.data.starsCount = 0;
		stars.setAll('alpha', 1);
		stars.setAll('body.enable', true);
		for (let coinsCount = 0; coinsCount <= 3; coinsCount++) {
			if (player.data.coinsCount == coinsCount) {
				backgrounds.children.forEach(background => {
					if (background.data.stars === undefined || background.data.coins === undefined) {
						return;
					}
					if (background.data.coins == coinsCount) {
						game.add.tween(background).to({alpha: 1.0}, 1000, 'Linear', true);
					} else {
						game.add.tween(background).to({alpha: 0.0}, 1000, 'Linear', true);
					}
				});
				break;
			}
		}
		game.add.tween(coin.scale).to({x: 1.2, y: 1.2}, 300, 'Linear', true).onComplete.add(() => {
			game.add.tween(coin.scale).to({x: 0.0, y: 0.0}, 500, 'Linear', true).onComplete.add(() => {
				coin.alpha = 0;
				coin.scale.set(1.0, 1.0);
			});
		});
	});

	// Buttons
	game.physics.arcade.overlap(player, buttons, (player, button) => {
		walls.forEach(wall => {
			if (wall.data.button == button.data.wall) {
				wall.alpha = 0;
				wall.body.enable = false;
				button.animations.play('press');
				button.body.enable = false;
			}
		});
	});

	// Check Points.
	game.physics.arcade.overlap(player, checkPoints, (player, checkPoint) => {
		player.data.checkPoint = checkPoint;
		checkPoint.loadTexture('checkpoint_on');
	}, (player, checkPoint) => {
		let result = false;
		if (player.data.checkPoint) {
			if (player.data.checkPoint.data.priority < checkPoint.data.priority) {
				result = true;
			} else {
				result = false;
			}
		} else {
			result = true;
		}
		if (result && checkPoint.activated) {
			result = false;
		}
		return result;
	});

	// Roses
	game.physics.arcade.overlap(player, roses, (player, rose) => {
		killPlayer();
	});

	// Power shaded.
	if (player.data.powerShade && (player.key == 'principe' || player.key == 'principe_lumin')) {
		shaded.children.forEach(mask => {
			let distance = 0;
			if (mask.scale.y < 0) {
				mask.scale.y *= -1;
				distance = pointRectDistance(player, mask);
				mask.scale.y *= -1;
			} else {
				distance = pointRectDistance(player, mask);
			}
			if (distance <= 120) {
				mask.alpha = 0.4;
				if (player.key !== 'principe_lumin') {
					player.loadTexture('principe_lumin');
				}
				player.data.canNotSwap = true;
			} else {
				mask.alpha = 1.0;
				if (player.key !== 'principe') {
					player.loadTexture('principe');
				}
				player.data.canNotSwap = false;
			}
		});
	} else {
		game.physics.arcade.collide(player, shaded);
	}

	// King box.
	if (king) {
		if (Phaser.Rectangle.containsPoint(king.data.box, player)) {
			if (!player.data.meetKing) {
				meetKing();
			}
		} else {
			player.data.meetKing = false;
		}
	}

	// Signs.
	if (player.data.powerSign) {
		signs.children.forEach(sign => {
			sign.alpha = 1.0;
			if (Phaser.Point.distance(player, sign) <= 80 && player.key === 'aviatore') {
				if (sign.animations.currentAnim.name !== 'close') {
					sign.animations.play('close');
					messageBox.data.textsIndex = 0;
					messageBox.data.texts = [];
					messageBox.data.texts[0] = 'A volte è necessario lasciarsi andare per poter tornare con i piedi per terra!';
					setupMessageBox('tips');
					showMessageBox();
					pauseInput = false;
				}
			} else {
				if (sign.animations.currentAnim.name !== 'futher') {
					sign.animations.play('futher');
					hideMessageBox();
				}
			}
		});
	}

	// Animated.
	if (player.data.powerAnimated) {
		animated.children.forEach(anim => {
			anim.alpha = 1.0;
			if (Phaser.Point.distance(player, anim) <= 80 && player.key === 'aviatore') {
				if (anim.animations.currentAnim.name !== 'close') {
					anim.animations.play('close');
					messageBox.data.textsIndex = 0;
					messageBox.data.texts = [];
					messageBox.data.texts[0] = 'L’essenziale é invisibile agli occhi...';
					setupMessageBox('tips');
					showMessageBox();
					pauseInput = false;
				}
			} else {
				if (anim.animations.currentAnim.name !== 'futher') {
					anim.animations.play('futher');
					hideMessageBox();
				}
			}
		});
	}

	// Roses
	game.physics.arcade.overlap(player, roses, (player, rose) => {
		killPlayer();
	});

	// Player jump.
	if (jumping && (player.body.onFloor() || player.body.touching.down)) {
		player.animations.play('jump_down');
		jumping = false;
		player.data.jumpCount = 0;
	}

	playerCheckAnimation();

	// if player fall down kill him.
	if (player.body.onFloor()) {
		killPlayer()
	}

	// Power fog.
	if (player.data.powerFog && (player.key === 'principe' || player.key === 'principe_torcia')) {
		if (fogIn) {
			if (Phaser.Rectangle.containsPoint(fogIn, player)) {
				player.data.inFogZone = true;
			}
		}
		if (fogOut) {
			if (Phaser.Rectangle.containsPoint(fogOut, player)) {
				player.data.inFogZone = false;
			}
		}
		if (player.data.inFogZone) {
			player.data.canNotSwap = true;
			if (player.key === 'principe') {
				player.loadTexture('principe_torcia');
			}
			if (player.key == 'principe' || player.key == 'principe_torcia') {
				fog.alpha = 1.0;
				fog.x = player.x;
				fog.y = player.y;
				fogZone.alpha = 0.0;
			} else {
				fog.alpha = 0.0;
				fogZone.alpha = 1.0;
			}
		} else {
			player.data.canNotSwap = false;
			fog.alpha = 0.0;
			fogZone.alpha = 1.0;
			if (player.key === 'principe_torcia') {
				player.loadTexture('principe');
			}
		}
	} else {
		if (fogIn) {
			if (Phaser.Rectangle.containsPoint(fogIn, player)) {
				killPlayer();
			}
		}
	}
}

function pointRectDistance(point, rect) {
	let min_x = rect.x - rect.width / 2;
	let min_y = rect.y - rect.height / 2;
	let max_x = rect.x + rect.width / 2;
	let max_y = rect.y + rect.height / 2;
	let dx = Math.max(min_x - point.x, 0, point.x - max_x);
	let dy = Math.max(min_y - point.y, 0, point.y - max_y);
	return Math.hypot(dx, dy);
}

function meetKing() {
	player.data.meetKing = true;
	if (player.data.powerAnimated || player.data.powerShade || player.data.powerFog || player.data.powerSign) {
		return;
	}
	setupMessageBox('king');
	messageBox.data.textsIndex = 0;
	messageBox.data.texts = [];
	if (player.data.starsCount >= 2 || player.data.coinsCount >= 2) {
		messageBox.data.texts[0] = 'Benvenuto suddito, ti ordino di ascoltare la mia storia, poiché quello che sentirai ti aiuterà a capire se è giusto per te il cammino che hai intrapreso.';
		messageBox.data.texts[1] = 'Un tempo, su un pianeta, governava il Re. Durante una guerra, il figlio del Re fu catturato e imprigionato dai nemici. ';
		messageBox.data.texts[2] = 'Il Re ordinò all’Eroe più valoroso del regno, di precipitarsi - lui solo - a liberarlo. Nonostante i suoi sforzi, anche l’Eroe fu imprigionato.';
		messageBox.data.texts[3] = 'Tempo dopo, quando l’esercito del Re riuscì a sconfiggere il Sovrano avversario e il Principe fu salvato, il re convocò i più fidati tra i suoi consiglieri.';
		messageBox.data.texts[4] = 'il Primo gli suggerì di condannare a morte l’Eroe, poiché non aveva rispettato gli ordini del suo sovrano.';
		messageBox.data.texts[5] = 'Il Secondo suggerì di ricoprire di ricchezze l’Eroe per la sua eroica lealtà.';
		messageBox.data.texts[6] = ['Ora chiedo a te, a quale dei due consiglieri il Re diede ascolto?', 'Primo', 'Secondo', (choice) => {
			messageBox.data.textsIndex = 0;
			messageBox.data.texts = [];
			if (player.data.starsCount >= 2) {
				if (choice == 0) {
					// Wrong answer
					messageBox.data.texts[0] = 'La tua risposta non é corretta, rivedi le tue priorità.';
				} else {
					// Correct answer
					messageBox.data.texts[0] = 'La tua risposta é coerente rispetto al cammino che hai intrapreso. Ora puoi proseguire con l’aiuto di poteri fondamentali per terminare il gioco, ma ricorda che non tutti gli ostacoli possono essere superati da entrambi i personaggi.';
					player.data.powerAnimated = true;
					player.data.powerShade = true;
				}
			} else if (player.data.coinsCount >= 2) {
				if (choice == 0) {
					// Correct answer
					messageBox.data.texts[0] = 'La tua risposta é coerente rispetto al cammino che hai intrapreso. Ora puoi proseguire con l’aiuto di poteri fondamentali per terminare il gioco, ma ricorda che non tutti gli ostacoli possono essere superati da entrambi i personaggi.';
					player.data.powerFog = true;
					player.data.powerSign = true;
				} else {
					// Wrong answer
					messageBox.data.texts[0] = 'La tua risposta non é corretta, rivedi le tue priorità.';
				}
			}
		}];
	} else {
		messageBox.data.texts[0] = 'Presta attenzione! Hai lasciato qualcosa lungo il tuo cammino, presentati al mio cospetto solo quando avrai scelto la tua strada. Devi tornare indietro';
	}
	showMessageBox();
}

function killPlayer() {
	if (player.data.godMode) {
		return;
	}
	let respawnPoint = player.data.checkPoint || player.data.initialPosition;
	player.x = respawnPoint.x;
	player.y = respawnPoint.y;
	player.data.inFogZone = false;
	player.data.canNotSwap = false;
	game.camera.focusOn(player);
	game.camera.shake(0.005, 500);
}

function playerIsMoving() {
	return player.body.velocity.x != 0;
}

function playerCheckAnimation() {
	let key = player.animations.currentAnim.name;
	if (jumping || key == 'jump_impulse') {
		if (player.body.velocity.y > 0 && !player.animations.currentAnim.isPlaying) {
			player.animations.play('jump_falling');
		}
	} else {
		if (playerIsMoving()) {
			player.animations.play('move');
		} else {
			player.animations.play(facing);
			player.animations.stop();
			player.frame = 7;
		}
	}
}

function playerAnimationOnComplete(gameObject, anim) {
	if (anim.name == 'jump_impulse') {
		let jumpSize;
		if (player.key == 'aviatore') {
			jumpSize = 300;
		} else {
			jumpSize = 300;
		}
		player.body.velocity.y = -300;
		jumpTimer = game.time.now + 750;
		jumping = true;
		player.data.jumpCount++;
		player.animations.play('jump_floating');
	}
}

function theEndGame() {
	if ((player.data.starsCount < 3 && player.data.coinsCount < 3) || player.data.endGame) {
		return
	}
	player.data.endGame = true;
	let image;
	if (player.data.starsCount >= 3) {
		image = game.add.image(0, 0, 'finishStar');
	} else {
		image = game.add.image(0, 0, 'finishCoin');
	}
	image.fixedToCamera = true;
	image.alpha = 0.0;
	pauseInput = true;
	game.add.tween(image).to({alpha: 1.0}, 1000, 'Linear', true);
}

function render () {
	//game.debug.body(player);
	//game.debug.text(game.time.suggestedFps, 32, 32);
}
