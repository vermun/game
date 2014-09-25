var levels = [{name: "Łatwy", value: 0.06}, {name: "Średni", value: 0.05}, {name: "Trudny", value: 0.04}, {name: "Extreme", value: 0.02}];

Scene.Difficult_menu = function() {
};
Scene.Difficult_menu.prototype = {
    preload: function() {
    },
    create: function() {
        var style = {font: "50px Arial", fill: "#aaaaaa", align: "center"};
        
        var text = game.add.text(50, 50, "Poziom trudności", style);
        style = {font: "50px Arial", fill: "#aaaa00", align: "center"};
        
        for (var i = 0; i < levels.length; ++i)
        {
            var text = game.add.text(50, 200 + 100 * i, levels[i].name, style);
            text.level_value = levels[i].value;
            text.inputEnabled = true;
            text.events.onInputDown.add(setDifficult, this);
            text.events.onInputOver.add(over, this);
            text.events.onInputOut.add(out, this);
        }


    },
    update: function() {

    }
};
function setDifficult(text)
{
    document.getElementsByTagName("canvas")[0].className = "default";
    difficult *= text.level_value;
    this.game.state.start('Game');
}