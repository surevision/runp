// 敌我精灵

var R = 8.0;	// 圆半径

var SpriteCharacter = SpriteBase.extend({
	ctor : function(isPlayer, x, y) {
		this._super("blank");
		this.isPlayer = isPlayer;
		this.tails = [];
		this.tailSize = 0;
		this.dtCount = 0.0;
		this.lastX = 0;
		this.lastY = 0;
		this.setPosition(x, y);
		this.color = isPlayer ? cc.color(255,255,255, 255) : cc.color(196,0,0, 255);
		this.node = cc.DrawNode.create();//cc.LayerColor.create();
		this.addChild(this.node, 1000);
		this.drawNode();
	},
	addTail : function(x, y) {
		var tail = new SpriteBase("blank");
		var drawNode = cc.DrawNode.create()
		tail.addChild(drawNode);
		tail.node = drawNode;
		this.getParent().addChild(tail, 1);
		tail.setPosition(this.getPosition());
		this.drawTail(tail);
		var i = 0;
		for (i = 0; i < this.tailSize; i += 1) {
			if (this.tails[i] == null) {
				this.tails[i] = tail;
				break;
			}
		}
		if (i == this.tailSize) {
			this.tails[i] = tail;
			this.tailSize += 1;
		}
		var fade = cc.FadeOut.create(0.2);
		var scale = cc.ScaleTo.create(0.2, 0, 0);
		var spawn = cc.Spawn.create([fade, scale]);
		var callback = cc.CallFunc.create(function(){
			tail.removeFromParent();
			this.tails[i] = null;
		}, this);
		var sequence = cc.Sequence.create([spawn, callback]);
		tail.runAction(sequence);
	},
	drawNode : function() {
		this.node.ignoreAnchorPointForPosition(false);
		this.node.setAnchorPoint(0.5, 0.5);
		this.node.drawDot(cc.p(0, 0), R, this.color);
	},
	drawTail : function(tail) {
		tail.node.ignoreAnchorPointForPosition(false);
		tail.setCascadeOpacityEnabled(true);
		tail.node.setAnchorPoint(0.5, 0.5);
		tail.node.drawDot(cc.p(0, 0), R, this.color);
	},
	hitRect : function(rect) {
		x = this.getPositionX();
		y = this.getPositionY();
		if (x - R > rect.x + rect.width ||
			x + R < rect.x ||
			y - R > rect.y + rect.height ||
			y + R < rect.y) {
				return false;
		}
		return true;
	},
	hitCircle : function(pos, r) {
		x = this.getPositionX();
		y = this.getPositionY();
		return (x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y) < R * R + r * r;
	},
	update : function(dt) {
		this.dtCount += dt;
		var pos = this.getPosition();
		if (this.lastX != pos.x || this.lastY != pos.y) {
			this.lastX = pos.x;
			this.lastY = pos.y;
			if (this.dtCount > 0.02) {
				this.addTail(this.lastX, this.lastY);
				this.dtCount = 0.0;
			}
		}
	},
	dispose : function() {
		this._super();
		for (var i = 0; i < this.tailSize; i += 1) {
			if (this.tails[i] == null) {
				this.tails[i].removeFromParent();
				break;
			}
		}
	}
});