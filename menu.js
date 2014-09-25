var dancer = new Dancer();
var dancer2 = new Dancer();
Dancer.setOptions({
    flashSWF: 'lib/soundmanager2.swf',
    flashJS: 'lib/soundmanager2.js'
});


var titles = [{name: "One", difficult: 1}, {name: "Dirt Off Your Shoulder", difficult: 3}];
Scene.Menu = function() {
};
Scene.Menu.prototype = {
    preload: function() {
    },
    create: function() {
        var style = {font: "50px Arial", fill: "#aaaa00", align: "center"};
        for (var i = 0; i < titles.length; ++i)
        {
            game.add.text(20, 50 + 100 * i, i + 1 + ". ", style);
            var text = game.add.text(70, 50 + 100 * i, titles[i].name, style);
            text.index = i;
            text.inputEnabled = true;
            text.events.onInputDown.add(loadSong, this);
            text.events.onInputOver.add(over, this);
            text.events.onInputOut.add(out, this);
        }


    },
    update: function() {

    }
};
function loadSong(text)
{
    document.getElementsByTagName("canvas")[0].className = "default";

    dancer.load({src: 'assets/' + text._text + '.ogg'});
    dancer2.load({src: 'assets/' + text._text + '(sound).ogg'});
    dancer.play();
    dancer.title = text._text;
    console.log("test");
    difficult = titles[text.index].difficult;

    this.game.state.start('Difficult_menu');
}

function over()
{
    document.getElementsByTagName("canvas")[0].className = "pointer";

}

function out()
{
    document.getElementsByTagName("canvas")[0].className = "default";
}