var player = null;
var last_mouse_position = {x: 0, y: 0};
var notes = [];
var start_sprite;
var max = 0;
var last = 0;
var elapsed = 1;
var beats = 0
var next_beat_sprite;
var on_line = false;
var line_center = false;
var line_checked = false;
var no_lines = false;
var last_special = 0;
var line_array = [];
var t;
var difficult;
var temp_score;
var score = 0;
var score_text;
var caught_lines;
var all_lines;

var combo_levels = [500, 2000, 6000, 20000, 50000]
var combo_progress;
var combo;
var combo_progress_bar_fill;
var follower;
var follower_index;

var combo_text;

var test_points = [];
var marker_sprite;

Scene.Game = function()
{

}

Scene.Game.prototype = {
    preload: function()
    {

    },
    create: function()
    {
        player = null;
        notes = [];
        start_sprite = null;
        max = 0;
        last = 0;
        elapsed = 1;
        beats = 0
        next_beat_sprite = null;
        on_line = false;
        line_center = false;
        line_checked = false;
        no_lines = false;
        last_special = 0;
        line_array = [];
        temp_score = 0;
        score = 0;
        caught_lines = 0;
        all_lines = 0;
        combo_progress = 0;
        combo = 1;

        t = setInterval(function() {
            loadedSong()
        }, 1000);

        game.world.setBounds(0, 0, game.width, game.height);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.gravity.y = 0;

        var center_line = this.add.sprite(game.world.centerX, 0, "line");
        center_line.width = 1;
        center_line.height = game.height;
        center_line.name = "center_line"
        game.physics.p2.enable(center_line);
        center_line.body.fixedRotation = true;
        center_line.anchor.setTo(0, 0);
        center_line.body.clearShapes();
        center_line.body.addRectangle(center_line.width, center_line.height, center_line.width / 2, center_line.height / 2);
        center_line.body.updateCollisionMask();


        player = this.add.sprite(0, 0, null);
        player.width = 1;
        player.height = 1;
        player.name = "player";
        game.physics.p2.enable(player);
        player.body.fixedRotation = true;
        game.physics.p2.setPostBroadphaseCallback(hit, this);



        follower = this.add.sprite(game.width, 0, "note");
        follower.anchor.setTo(0.5, 0.5);
        follower_index = 0;

        var combo_progress_bar = this.add.sprite(0, 50, "line");
        combo_progress_bar.width = 200;
        combo_progress_bar.height = 20;

        combo_progress_bar_fill = this.add.sprite(0, 50, "fill");
        combo_progress_bar_fill.width = 0;
        combo_progress_bar_fill.height = 20;

        var style = {font: "20px Arial", fill: "#44ff00", align: "center"};
        score_text = game.add.text(0, 0, score, style);
        combo_text = game.add.text(210, 50, combo, style);

        emitter = game.add.emitter(0, 0, 1000);

        emitter.makeParticles(['star', 'star1']);
        emitter.gravity = 200;

        game.paused = true;
    },
    update: function()
    {
        //score_text.text = score;
        //combo_text.text = dancer.getTime() + " | " + dancer2.getTime();//"x" + combo;
        combo_progress_bar_fill.width = (combo_progress / combo_levels[combo - 1]) * 200;

        var increment = Math.round(game.width / follower.x);
        follower_index = follower_index < 0 ? 0 : follower_index;
        if (increment > 0 && line_array.length > follower_index + increment && line_array[follower_index + increment].x < game.width - follower.width * 2)
        {
            follower_index += increment
            follower.x = line_array[follower_index].x
            follower.y = line_array[follower_index].y
        }
        else if (line_array.length)
        {
            follower.x = line_array[follower_index].x
            follower.y = line_array[follower_index].y
        }

        if (on_line)
        {
            if (dancer2.getVolume() < 1)
                dancer2.setVolume(dancer2.getVolume() + 0.05);
            else
                dancer2.setVolume(1);
        }
        else if ((!no_lines && elapsed != 1) || (no_lines && !player.drop))
        {
            if (dancer2.getVolume() > 0)
                dancer2.setVolume(dancer2.getVolume() - 0.05);
            else
                dancer2.setVolume(0);
            if (combo_progress > 0)
                combo_progress -= 10 * combo;
            else
                combo_progress = 0;
        }

        var waveform = dancer.getWaveform();
        score_text.text = waveform[24];
        max = Math.max.apply(null, waveform);
        combo_text.text = max;

        if (max - last > difficult && elapsed + 100 < game.time.now)
        {
            var angle;
            var temp = (game.height) - (game.height * max);

            if (temp > game.height - game.cache._images.note.data.height)
                temp = game.height - game.cache._images.note.data.height;
            else if (temp < 0)
                temp = 0;

            if (notes.length && Math.abs(angle = game.math.angleBetween(notes[notes.length - 1].x, notes[notes.length - 1].y, game.width * 1.3, temp)) > 0.7 && max > 0.4)
            {
                var explode = game.add.sprite(game.width * 1.3, temp, null);
                explode.name = "explode";
                game.physics.p2.enable(explode);
                explode.body.fixedRotation = true;
                explode.body.kinematic = true;
                explode.body.velocity.x = -300;
            }

            if (notes.length > 0 && Math.abs(angle = game.math.angleBetween(notes[notes.length - 1].x, notes[notes.length - 1].y, game.width * 1.3, temp)) > 0.9 && max > 0.45 && last_special + 2000 < game.time.now)
            {
                switch (game.rnd.integerInRange(0, 1)) {
                    case 0:
                        makeLoop(game.width * 1.3, temp, 100, angle);
                        break;
                    case 1:
                        makeChaos(game.width * 1.3, temp, game.rnd.integerInRange(0, 1));
                        break;
                }
                last_special = game.time.now;
            }
            else
            {

                var bit = game.add.sprite(game.width * 1.3, temp, null);
                game.physics.p2.enable(bit);
                bit.body.fixedRotation = true;
                bit.body.kinematic = true;
                bit.body.velocity.x = -300;
                last = max;
                console.log("x:" + marker_sprite.x + " y:" + temp)

                if (beats == 0)
                {
                    next_beat_sprite = bit;
                    var empty;
                    if (line_array.length != 0)
                        empty = game.add.sprite(line_array[line_array.length - 1].x, 0, null);
                    else
                        empty = game.add.sprite(0, 0, null);
                    empty.width = bit.x - empty.x;
                    empty.height = game.height;
                    empty.name = "no_lines";
                    game.physics.p2.enable(empty);
                    empty.body.fixedRotation = true;
                    empty.body.kinematic = true;
                    empty.anchor.setTo(0, 0);
                    empty.body.clearShapes();
                    empty.body.addRectangle(empty.width, empty.height, empty.width / 2, empty.height / 2)
                    empty.body.updateCollisionMask();
                    empty.body.velocity.x = -300;
                }
                if (beats == 1)
                {
                    next_beat_sprite = notes[notes.length - 1];
                }
                beats = 2;
                max = 0;
                elapsed = game.time.now;
                notes.push(bit);
            }
        }
        else
            last = max;




        for (var i = 20; i >= 0; --i)
        {
            if (line_array[i] && line_array[i].x < 0)
            {
                line_array[i].destroy();
                line_array.splice(i, 1);
                --follower_index;
            }
        }
        if (notes[0] && notes[0].x < 0)
        {
            notes[0].destroy();
            notes.splice(0, 1);
        }
        if ((next_beat_sprite && next_beat_sprite.x <= game.width) || game.time.now - elapsed > 1000)
        {
            var index = notes.indexOf(next_beat_sprite);
            var subarray = notes.slice(index);
            var pts = []
            for (var i = 0; i < subarray.length; ++i)
            {
                pts.push(subarray[i].x);
                pts.push(subarray[i].y);
            }

            var result = getCurvePoints(pts, 0.5, false, 20);

            if (line_array.length == 0 && result[0])
            {
                follower.x = result[0];
                follower.y = result[1];
            }

            for (var i = 0; i < result.length - 2; i += 2) {
                var line = game.add.sprite(result[i], result[i + 1], "laser");
                line.width = Math.sqrt(Math.pow(result[i + 2] - result[i], 2) + Math.pow(result[i + 3] - result[i + 1], 2))

                line.name = "line";
                game.physics.p2.enable(line);
                line.body.fixedRotation = true;
                line.body.kinematic = true;
                line.anchor.setTo(0, 0);
                line.body.clearShapes();
                line.body.addRectangle(line.width * 2, line.height * 2, 0, 0, -(game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3])));
                line.body.updateCollisionMask();
                line.body.rotation = game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3]);
                line.body.velocity.x = -300;
                line.alpha = 0.3;
                line_array.push(line);
                ++all_lines;
            }

            next_beat_sprite = null;
            beats = game.time.now - elapsed > 1000 ? 0 : 1;
        }

        if (start_sprite && start_sprite.x < game.world.centerX)
        {
            start_sprite.destroy();
            start_sprite = null;
            dancer2.play();
        }


        if (game.input.activePointer.isDown || game.input.pointer1.isDown)
        {
            if (player.drop == true)
            {
                last_mouse_position.x = game.input.mousePointer.worldX;
                last_mouse_position.y = game.input.mousePointer.worldY;
                player.drop = false;
            }

            player.body.x = last_mouse_position.x;
            player.body.y = last_mouse_position.y;
            player.width = Math.sqrt(Math.pow(game.input.mousePointer.worldX - last_mouse_position.x, 2) + Math.pow(game.input.mousePointer.worldY - last_mouse_position.y, 2));
            player.anchor.setTo(0, 0);
            player.body.clearShapes();
            player.body.addRectangle(player.width, player.height, player.width / 2, player.height / 2, game.math.angleBetween(last_mouse_position.x, last_mouse_position.y, game.input.mousePointer.worldX, game.input.mousePointer.worldY));
            player.body.updateCollisionMask();
            last_mouse_position.x = game.input.mousePointer.worldX;
            last_mouse_position.y = game.input.mousePointer.worldY;
        }
        else
        {
            player.drop = true;
        }



        if (combo_progress > combo_levels[combo - 1])
            combo++;
        else if (combo != 1 && combo_progress < combo_levels[combo - 2])
            combo--;

        if (game.input.keyboard.isDown(Phaser.Keyboard.ESC) || (dancer2.audio.ended && line_array.length == 0)) {
            finish();
        }

        on_line = false;
        line_center = false;
        line_checked = false;
        no_lines = false;
    }
};
function hit(body1, body2)
{
    try
    {
        if (body2.sprite.name === "player")
        {
            var temp = body2;
            body2 = body1;
            body1 = temp;
        }
        if (body1.sprite.name === 'player' && body2.sprite.name === "line" && (game.input.activePointer.isDown || game.input.pointer1.isDown))
        {
            if (body2.sprite.alpha != 1)
            {
                body2.sprite.alpha = 1;
                var mistake = (Math.abs(game.world.centerX - game.input.mousePointer.worldX) / (game.width / 2));
                temp_score += (1 - mistake) * combo;
                score = Math.floor(temp_score);
                ++caught_lines;
                combo_progress += (1 - mistake) * combo;

                if (mistake < 0.025)
                {
                    emitter.x = game.input.mousePointer.worldX;
                    emitter.y = game.input.mousePointer.worldY;

                    emitter.start(true, 8000, null, 1);
                }
            }
            on_line = true;
        }

        if (body1.sprite.name === 'player' && body2.sprite.name === "no_lines")
        {
            no_lines = true;
        }

        if (body2.sprite.name === "center_line")
        {
            var temp = body2;
            body2 = body1;
            body1 = temp;
        }

        if (body1.sprite.name === 'center_line' && body2.sprite.name === "line")
        {
            line_center = true;
            if (body2.sprite.alpha == 1)
                line_checked = true;
        }
        if (body1.sprite.name === 'center_line' && body2.sprite.name === "explode")
        {
            body2.sprite.destroy()
            //explode();
        }
    }
    catch (e)
    {
    }
    return false;
}

function loadedSong()
{
    
    if (dancer && dancer.isLoaded())
    {
        if (dancer2.isLoaded())
        {
            dancer.play();
            dancer.setVolume(0)

            game.paused = false;
            clearInterval(t);
            start_sprite = game.add.sprite(game.width * 1.3, 0, null);
            game.physics.p2.enable(start_sprite);
            start_sprite.body.fixedRotation = true;
            start_sprite.body.kinematic = true;
            start_sprite.anchor.setTo(0, 0);
            start_sprite.body.clearShapes();
            start_sprite.body.addRectangle(start_sprite.width, start_sprite.height, start_sprite.width / 2, start_sprite.height / 2);
            start_sprite.body.updateCollisionMask();
            start_sprite.body.velocity.x = -300;

            marker_sprite = game.add.sprite(game.width, 0, null);
            marker_sprite.width = 1;
            marker_sprite.height = 1;

            game.physics.p2.enable(marker_sprite);
            marker_sprite.body.fixedRotation = true;
            marker_sprite.body.kinematic = true;
            marker_sprite.body.velocity.x = 300;
        }
    }
}

function makeLoop(start_x, start_y, radius, a)
{
    var index = notes.indexOf(next_beat_sprite);
    var subarray = notes.slice(index);
    var pts = []
    for (var i = 0; i < subarray.length; ++i)
    {
        pts.push(subarray[i].x);
        pts.push(subarray[i].y);
    }
    var center_x = start_x - Math.cos(a) * radius;
    var center_y = start_y - Math.sin(a) * radius;
    for (var i = 0; i < 10; ++i) {
        var angle = -((2 * Math.PI * i / 10 + a) % (2 * Math.PI));
        var x = Math.cos(angle) * radius + center_x;
        var y = Math.sin(angle) * radius + center_y;

        pts.push(x);
        pts.push(y);

        var bit = game.add.sprite(x, y, "note");
        bit.name = "bit";
        bit.width = 1;
        game.physics.p2.enable(bit);
        bit.body.fixedRotation = true;
        bit.body.kinematic = true;
        bit.anchor.setTo(0, 0);
        bit.body.clearShapes();
        bit.body.addRectangle(bit.width, bit.height, bit.width / 2, bit.height / 2);
        bit.body.updateCollisionMask();
        bit.body.velocity.x = -300;
        if (notes.length != 0)
            bit.alpha = 0.5;
        notes.push(bit);

        console.log("x:" + marker_sprite.x + " y:" + y)
    }

    var result = getCurvePoints(pts, 0.5, false, 10);
    for (var i = 0; i < result.length - 2; i += 2) {
        var line = game.add.sprite(result[i], result[i + 1], "laser");
        line.width = Math.sqrt(Math.pow(result[i + 2] - result[i], 2) + Math.pow(result[i + 3] - result[i + 1], 2))

        line.name = "line";
        game.physics.p2.enable(line);
        line.body.fixedRotation = true;
        line.body.kinematic = true;
        line.anchor.setTo(0, 0);
        line.body.clearShapes();
        line.body.addRectangle(line.width * 2, line.height * 2, 0, 0, -(game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3])));
        line.body.updateCollisionMask();
        line.body.rotation = game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3]);
        line.body.velocity.x = -300;
        line.alpha = 0.3;
        line_array.push(line);
        ++all_lines;
    }


    next_beat_sprite = notes[notes.length - 1];

    beats = 2;
    last = max;

    max = 0;
    elapsed = game.time.now;
}

function makeChaos(start_x, start_y, type)
{
    var x = start_x;
    var y = start_y;
    var pts_number = game.rnd.integerInRange(1, 4)
    var index = notes.indexOf(next_beat_sprite);
    var subarray = notes.slice(index);
    var pts = [];
    var sign = 0;
    for (var i = 0; i < subarray.length; ++i)
    {
        pts.push(subarray[i].x);
        pts.push(subarray[i].y);
    }
    if (type == 0)
    {
        for (var i = 0; i < game.rnd.integerInRange(1, 4); ++i) {


            if (i % 2 == 1 && sign == 0)
            {
                x += game.rnd.integerInRange(200, 300)
                y += game.rnd.integerInRange(20, 40)
            }
            else if (i % 2 == 1 && sign == 1)
            {
                x += game.rnd.integerInRange(-300, -200);
                y += game.rnd.integerInRange(-40, -20);
            }
            else if ((sign = game.rnd.integerInRange(0, 1) == 0))
            {
                x += game.rnd.integerInRange(200, 300)
                y += game.rnd.integerInRange(20, 40)
            }
            else
            {
                x += game.rnd.integerInRange(-300, -200);
                y += game.rnd.integerInRange(-40, -20);
            }
        }
    }
    else
    {
        switch (game.rnd.integerInRange(0, 1))
        {
            case 0:
                x = game.width + game.rnd.integerInRange(10, 100);
                y = 0 + game.rnd.integerInRange(10, 100);
                break;
            case 1:
                x = game.width + game.rnd.integerInRange(10, 100);
                y = game.height - game.rnd.integerInRange(10, 100);
                break;
        }


        pts.push(x);
        pts.push(y);

        var bit = game.add.sprite(x, y, "note");
        bit.name = "bit";
        bit.width = 1;
        game.physics.p2.enable(bit);
        bit.body.fixedRotation = true;
        bit.body.kinematic = true;
        bit.anchor.setTo(0, 0);
        bit.body.clearShapes();
        bit.body.addRectangle(bit.width, bit.height, bit.width / 2, bit.height / 2);
        bit.body.updateCollisionMask();
        bit.body.velocity.x = -300;
        if (notes.length != 0)
            bit.alpha = 0.5;
        notes.push(bit);
    }

    var result = getCurvePoints(pts, 0.5, false, 10);
    for (var i = 0; i < result.length - 2; i += 2) {
        var line = game.add.sprite(result[i], result[i + 1], "laser");
        line.width = Math.sqrt(Math.pow(result[i + 2] - result[i], 2) + Math.pow(result[i + 3] - result[i + 1], 2))

        line.name = "line";
        game.physics.p2.enable(line);
        line.body.fixedRotation = true;
        line.body.kinematic = true;
        line.anchor.setTo(0, 0);
        line.body.clearShapes();
        line.body.addRectangle(line.width * 2, line.height * 2, 0, 0, -(game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3])));
        line.body.updateCollisionMask();
        line.body.rotation = game.math.angleBetween(result[i], result[i + 1], result[i + 2], result[i + 3]);
        line.body.velocity.x = -300;
        line.alpha = 0.3;
        line_array.push(line);
        ++all_lines;
    }

    next_beat_sprite = notes[notes.length - 1];
    beats = 2;
    last = max;

    max = 0;
    elapsed = game.time.now;
}

function getCurvePoints(ptsa, tension, isClosed, numOfSegmentts) {

    // use input value if provided, or use a default value   
    tension = (typeof tension != 'undefined') ? tension : 0.5;
    isClosed = isClosed ? isClosed : false;
    //numOfSegments = numOfSegments ? numOfSegments : 16;

    var _pts = [], res = [], // clone array
            x, y, // our x,y coords
            t1x, t2x, t1y, t2y, // tension vectors
            c1, c2, c3, c4, // cardinal points
            st, t, i;       // steps based on num. of segments

    // clone array so we don't change the original
    _pts = ptsa.slice(0);

    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
        _pts.unshift(ptsa[ptsa.length - 1]);
        _pts.unshift(ptsa[ptsa.length - 2]);
        _pts.unshift(ptsa[ptsa.length - 1]);
        _pts.unshift(ptsa[ptsa.length - 2]);
        _pts.push(ptsa[0]);
        _pts.push(ptsa[1]);
    }
    else {
        _pts.unshift(ptsa[1]);   //copy 1. point and insert at beginning
        _pts.unshift(ptsa[0]);
        _pts.push(ptsa[ptsa.length - 2]); //copy last point and append
        _pts.push(ptsa[ptsa.length - 1]);
    }

    // ok, lets start..

    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i = 2; i < (_pts.length - 4); i += 2) {
        var numOfSegments = Math.ceil(Math.sqrt(Math.pow(_pts[i + 2] - _pts[i], 2) + Math.pow(_pts[i + 3] - _pts[i + 1], 2)) / 8);
        if (numOfSegments == 0)
            numOfSegments = 16;
        for (t = 0; t <= numOfSegments; t++) {

            // calc tension vectors
            t1x = (_pts[i + 2] - _pts[i - 2]) * tension;
            t2x = (_pts[i + 4] - _pts[i]) * tension;

            t1y = (_pts[i + 3] - _pts[i - 1]) * tension;
            t2y = (_pts[i + 5] - _pts[i + 1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
            c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
            c4 = Math.pow(st, 3) - Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * _pts[i] + c2 * _pts[i + 2] + c3 * t1x + c4 * t2x;
            y = c1 * _pts[i + 1] + c2 * _pts[i + 3] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push(x);
            res.push(y);

        }
    }

    return res;
}

function finish()
{
    for (var i = 0; i < notes.length; ++i)
    {
        notes[i].destroy();
    }
    for (var i = 0; i < line_array.length; ++i)
    {
        line_array[i].destroy();
    }
    dancer.pause();
    dancer2.pause();

    this.game.state.start('Submit');
}