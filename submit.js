
Scene.Submit = function() {
};
Scene.Submit.prototype = {
    preload: function() {
    },
    create: function() {
        var style = {font: "65px Arial", fill: "#aaaaaa", align: "center"};
        var text

        text = game.add.text(game.world.centerX, 50, "Podsumowanie", style);
        text.anchor.setTo(0.5, 0.5);

        style = {font: "50px Arial", fill: "#aaaa00", align: "center"};

        text = game.add.text(game.world.centerX, 150, "Wynik: " + score, style);
        text.anchor.setTo(0.5, 0.5);

        if (all_lines != 0)
            text = game.add.text(game.world.centerX, 250, "Celność: " + Math.round((caught_lines / all_lines) * 100) + "% (" + caught_lines + "/" + all_lines + ")", style);
        else
            text = game.add.text(game.world.centerX, 250, "Celność: 0% (0/0)", style);

        text.anchor.setTo(0.5, 0.5);

        style = {font: "50px Arial", fill: "#eeeeee", align: "center"};

        var text = game.add.text(game.world.centerX, game.height - 100, "Wróć", style);
        text.anchor.setTo(0.5, 0.5);
        text.inputEnabled = true;
        text.events.onInputDown.add(back, this);
        text.events.onInputOver.add(over, this);
        text.events.onInputOut.add(out, this);
    },
    update: function() {

    }
};

function back()
{
    this.game.state.start('Menu');
}