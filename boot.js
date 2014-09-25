var Scene = {};

Scene.Boot = function()
{

}














Scene.Boot.prototype =
        {
            preload: function()
            {
                // Here we load the assets required for our preloader (in this case a background and a loading bar)
                game.load.image('preloaderBackground', 'assets/phaser.png');
                game.load.image('preloaderBar', 'assets/loading.png');
            },
            create: function()
            {
                document.getElementsByTagName("canvas")[0].className = "default";
                // Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
                game.input.maxPointers = 1;
                // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
                game.stage.disableVisibilityChange = true;
                if (game.device.desktop)
                {
                    // If you have any desktop specific settings, they can go in here
                    game.scale.pageAlignHorizontally = true;

                    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    //game.height = gameHeight; // Assign the available window Height
                    //game.width = gameWidth; // Assign the available window Width
                    //game.scale.refresh(); // Scale the game to fit the screen
                }
                else
                {
                    // Same goes for mobile settings.
                    // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
                    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    game.scale.minWidth = 480;
                    game.scale.minHeight = 260;
                    game.scale.maxWidth = 1024;
                    game.scale.maxHeight = 768;
                    game.scale.forceLandscape = true;
                    game.scale.pageAlignHorizontally = true;
                    game.scale.setScreenSize(true);
                }
                // By this point the preloader assets have loaded to the cache, we've set the game settings
                // So now let's start the real preloader going
                game.state.start('Preloader');
            }
        };