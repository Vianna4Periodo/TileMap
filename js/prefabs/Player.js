var MonsterKong = MonsterKong || {};

MonsterKong.Player = function (game,data,cursors) {
    Phaser.Sprite.call(this,game,data.player.x,data.player.y,'player',3);

    this.data = data;
    this.cursors = cursors;

    this.anchor.setTo(0.5);
    this.animations.add('walking',[0,1,2,1],6,true);
    game.physics.arcade.enable(this);
    this.customParams = {};

    this.body.collideWorldBounds = true;
    game.camera.follow(this);
}


MonsterKong.Player.prototype = Object.create(Phaser.Sprite.prototype);
MonsterKong.Player.prototype.constructor = MonsterKong.Player;


MonsterKong.Player.prototype.update = function () {
    this.body.velocity.x = 0;

    if (this.cursors.left.isDown){
        this.body.velocity.x = - this.data.player.RUNNING_SPEED;
        this.scale.setTo(1,1);
        this.play('walking');
    } else  if (this.cursors.right.isDown){
        this.body.velocity.x = this.data.player.RUNNING_SPEED;
        this.scale.setTo(-1,1);
        this.play('walking');
    } else {
        this.animations.stop();
        this.frame = 3;
    }

    if ((this.cursors.up.isDown) && (this.body.blocked.down)){
        this.body.velocity.y = -this.data.player.JUMPING_SPEED;
    }
};