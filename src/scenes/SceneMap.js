
// 移动速度
var SX = 2;
var SY = 2;

var MUL = 0.7071067811865476;

var SceneMap = SceneBase.extend({	
	ctor : function() {
		this._super();
	},
	clear : function() {
		this.gameoverFlag = false;
		this.started = false;
	},
	start : function() {
		this._super();
		this.clear();
		var size = cc.director.getWinSize();
		this.titleLabel = cc.LabelTTF.create("START", "Arial", "48");
		this.titleLabel.setAnchorPoint(0.5, 0.5);
		this.titleLabel.setPosition(size.width / 2, size.height / 2);
		this.addChild(this.titleLabel, 999);
		cc.eventManager.addListener({
			event : cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan : this.onTouchTitle.bind(this)
		}, this.titleLabel);
		this.background = cc.LayerColor.create();
		this.background.setColor(cc.color(0,0,0));
		this.background.setContentSize(size);
		this.addChild(this.background, 0);
		this.playerSprite = new SpriteCharacter(true, size.width / 2, size.height / 2);
		this.addChild(this.playerSprite, 100);
	},
	onTouchTitle : function(touch, event) {
		var pos = touch.getLocation();
		var target = event.getCurrentTarget();
		if (target.isVisible() && cc.rectContainsPoint(target.getBoundingBox(), pos)) {
			this.clear();
			this.gameStart();
			this.titleLabel.setVisible(false);
		}
		return true;
	},
	updateLogic : function(dt) {
		if (this.started) {
			this.playerSprite.update(dt);
			var size = cc.director.getWinSize();
			var pos = this.playerSprite.getPosition();
			var x = pos.x;
			var y = pos.y;
			switch (Input.dir8()) {
				case 1 :
					console.log("DOWNLEFT");
					x = MAX(0, pos.x - SX * MUL);
					y = MAX(0, pos.y - SY * MUL);
				break;
				case 2 :
					console.log("DOWN");
					y = MAX(0, pos.y - SY);
				break;
				case 3 :
					console.log("DOWNRIGHT");
					x = MIN(size.width, pos.x + SX * MUL);
					y = MAX(0, pos.y - SY * MUL);
				break;
				case 4 :
					console.log("LEFT");
					x = MAX(0, pos.x - SX);
				break;
				case 6 :
					console.log("RIGHT");
					x = MIN(size.width, pos.x + SX);
				break;
				case 7 :
					console.log("UPLEFT");
					x = MAX(0, pos.x - SX * MUL);
					y = MIN(size.height, pos.y + SY * MUL);
				break;
				case 8 :
					console.log("UP");
					y = MIN(size.height, pos.y + SY);
				break;
				case 9 :
					console.log("UPRIGHT");
					x = MIN(size.width, pos.x + SX * MUL);
					y = MIN(size.height, pos.y + SY * MUL);
				break;
				default :
					// console.log("default");
				break;
			}
			this.playerSprite.setPosition(cc.p(x, y));
			console.log(this.playerSprite.getPosition());
		} else {
			if (Input.isTrigger(Keys.C)) {
				this.clear();
				this.gameStart();
				this.titleLabel.setVisible(false);
			}
		}
	},
	gameStart : function() {
		var size = cc.director.getWinSize();
		this.stopAllActions();
		this.started = true;
	},
	startDeadline : function() {
		var size = cc.director.getWinSize();
		var moveToMiddleL = cc.moveTo(7, 
			size.width / 2 - this.faceLeft.getContentSize().width / 2, 
			this.faceLeft.getPositionY());
		var moveToMiddleR = cc.moveTo(7, 
			size.width / 2 + this.faceRight.getContentSize().width / 2, 
			this.faceRight.getPositionY());
		var gameoverCallback = cc.callFunc(this.gameOverPhase, this);
		var gameoverSequence = cc.sequence(cc.delayTime(7), gameoverCallback);
		this.faceLeft.runAction(moveToMiddleL);
		this.faceRight.runAction(moveToMiddleR);
		this.runAction(gameoverSequence);
	},
	winGamePhase : function() {
		var size = cc.director.getWinSize();
		this.stopAllActions();
		this.faceLeft.stopAllActions();
		this.faceRight.stopAllActions();
		this.flashBtn.setEnable(false);
		this.lighting.setVisible(true);
		var moveToLeft = cc.moveTo(0.2, 
			-this.faceLeft.getContentSize().width / 2, 
			this.faceLeft.getPositionY());
		var moveToRight = cc.moveTo(0.2, 
			size.width + this.faceRight.getContentSize().width / 2, 
			this.faceRight.getPositionY());
		var wingameCallback = cc.callFunc(this.winGame, this);
		var sequence = cc.sequence(cc.delayTime(0.2), wingameCallback);
		this.faceLeft.runAction(moveToLeft);
		this.faceRight.runAction(moveToRight);
		this.runAction(sequence);
		this.winGame();
	},
	winGame : function() {
		this.titleLabel.setString("WIN!");
		this.titleLabel.setVisible(true);
	},
	gameOverPhase : function() {
		this.started = false;
		this.gameoverFlag = true;
		this.stopAllActions();
		this.faceLeft.stopAllActions();
		this.faceRight.stopAllActions();
		this.flashBtn.setEnable(false);
		var scaleTo = cc.scaleTo(1, 2);
		var gameoverCallback = cc.callFunc(this.gameOver, this);
		var sequence = cc.sequence(scaleTo, gameoverCallback);
		this.heart.runAction(sequence);
	},
	gameOver : function() {
		this.titleLabel.setString("GameOver!");
		this.titleLabel.setVisible(true);
	}
});
