var game = new Phaser.Game(360,592,Phaser.AUTO);

game.state.add('GameState', MonsterKong.GameState);
game.state.start('GameState');