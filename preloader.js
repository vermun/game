Scene.Preloader = function() {
    this.background = null; // define background
    this.preloadBar = null; // define loader bar
};

Scene.Preloader.prototype = {
    preload: function() {

        //this.game.stage.backgroundColor = '#B4D9E7'; // set background colour for whole game
        this.background = this.add.sprite(game.width / 2, game.height / 2, "preloaderBackground");
        this.background.anchor.setTo(0.5, 0.5);
        this.preloadBar = this.add.sprite(game.width / 2, game.height - 27, 'preloaderBar'); // show loader bar
        this.preloadBar.anchor.setTo(0.5, 0.5);
        this.load.setPreloadSprite(this.preloadBar); // assign loader image so it works as a loader

        game.load.tilemap('map', 'assets/song_map.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('note', 'assets/note.png');
        game.load.image('line', 'assets/line.png');
        game.load.image('fill', 'assets/fill.png');
        game.load.image('line2', 'assets/line2.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('star1', 'assets/star1.png');
        game.load.image('ghost', 'assets/ghost.png');
        game.load.image('laser', 'assets/laser.png');
        //game.load.spritesheet('player', 'assets/dude.png', 32, 48);
        //game.load.script('filter', 'filters/Fire.js');  
    },
    create: function() {
        this.game.state.start('Menu'); // go to menu when everything is loaded
    }
};