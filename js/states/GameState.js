var MonsterKong = MonsterKong || {};

MonsterKong.GameState = { 
    init: function () {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.game.world.setBounds(0,0,360,700);
        
    },
    
    preload: function () {
        this.load.image('ground','assets/images/ground.png');
        this.load.image('platform','assets/images/platform.png');
        this.load.image('goal','assets/images/gorilla3.png');
        this.load.image('barrel','assets/images/barrel.png');

        this.load.spritesheet('player','assets/images/player_spritesheet.png',28,30,5,1,1);
        this.load.spritesheet('fire','assets/images/fire_spritesheet.png',20,21,2,1,1);

        this.load.text('level','assets/data/level.json');

        this.load.image('tilemap', 'assets/images/tiles.png');
        this.load.tilemap('map','assets/data/mapa1.json', null, Phaser.Tilemap.TILED_JSON);
    },
    
    create: function () {

        this.levelData = JSON.parse(this.game.cache.getText('level'));
        this.createGameSet();

        this.player = new MonsterKong.Player(this.game,this.levelData,this.cursors);
        this.game.add.existing(this.player);

        this.createEnemies();

        this.createGoal();
    },
    
    update: function () {

        // this.game.physics.arcade.collide(this.player,this.ground);
        this.game.physics.arcade.collide(this.player,this.platforms);
        this.game.physics.arcade.overlap(this.player,this.fires,this.killPlayer);
        this.game.physics.arcade.overlap(this.player,this.barrels,this.killPlayer);
        this.game.physics.arcade.overlap(this.player,this.goal,this.win);

        // this.game.physics.arcade.collide(this.barrels,this.ground);
        this.game.physics.arcade.collide(this.barrels,this.platforms);


        this.barrels.forEach(function (element) {
                if (element.x < 10 && element.y > 600){
                    element.kill();
                }
        },this);

    },

    render: function() {
        // this.game.debug.spriteInfo(this.player, 32, 32);
        // this.game.debug.bodyInfo(this.player, 32, 150);
    },

    createGameSet: function () {

        // this.ground = this.add.sprite(0,638,'ground');
        // this.game.physics.arcade.enable(this.ground);
        //
        // this.ground.body.allowGravity = false;
        // this.ground.body.immovable = true;
        //
        // this.platforms = this.add.group();
        // this.platforms.enableBody = true;

        // this.levelData.platformData.forEach(function (element) {
        //         this.platforms.create(element.x,element.y,'platform');
        // },this);

        // this.platforms.setAll('body.allowGravity',false);
        // this.platforms.setAll('body.immovable',true);

        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('tilemap');

        this.background = this.map.createLayer('fundo');
        this.background.resizeWorld();

        this.platforms = this.map.createLayer('plataformas');
        this.platforms.resizeWorld();

        this.map.setCollisionBetween(1, 1187, true, 'plataformas');
    },
    
    createEnemies: function () {
        this.fires = this.add.group();
        this.fires.enableBody = true;

        // var fire;
        // this.levelData.fireData.forEach(function (element) {
        //    fire = this.fires.create(element.x,element.y,'fire');
        //    fire.animations.add('fire',[0,1],4,true);
        //    fire.play('fire');
        // },this);

        this.map.createFromObjects('inimigos', 'Fire01', 'fire', 0, true, false, this.fires);

        this.fires.callAll('anchor.setTo', 'anchor', 0, -1);
        this.fires.callAll('animations.add', 'animations', 'fire', [0,1], 4, true);
        this.fires.callAll('animations.play', 'animations', 'fire');
        this.fires.setAll('body.allowGravity',false);

        this.barrels = this.add.group();
        this.barrels.enableBody = true;

        this.createBarrel();

        this.barrelCreator = this.game.time.events.loop(Phaser.Timer.SECOND * this.levelData.barrelFrequency,this.createBarrel,this);
    },
    
    killPlayer: function () {
        console.log('auchh!!');
        game.state.start('GameState');
    },

    win: function () {
        console.log('You Win!!');
        game.state.start('GameState');
    },
    
    createGoal: function () {
        this.goal = this.add.sprite(this.levelData.goal.x,this.levelData.goal.y,'goal');
        this.game.physics.arcade.enable(this.goal);
        this.goal.body.allowGravity = false;
    },

    createBarrel: function () {
        var barrel = this.barrels.getFirstExists(false);

        if (!barrel){
            barrel = this.barrels.create(0,0,'barrel');
        }

        barrel.body.collideWorldBounds = true;
        barrel.body.bounce.set(1,0.5);
        barrel.reset(this.levelData.goal.x,this.levelData.goal.y);
        barrel.body.velocity.x = this.levelData.barrelSpeed;

    }
};