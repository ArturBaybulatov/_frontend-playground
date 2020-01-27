(function() {
    var LIGHT_RADIUS = 100;
    var bg, items, explosions, shadow, flashlight;


    var game = new Phaser.Game($(window).width(), $(window).height(), Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update,
    });

    function preload() {
        game.load.image('bg', 'bg.jpg');
        game.load.image('item', 'item.png');
        game.load.spritesheet('explosion', 'explosion.png', 128, 128);
    }

    function create() {
        // Background ---------------------------------------

        game.stage.backgroundColor = '#000';

        bg = game.add.sprite(0, 0, 'bg');

        bg.height = game.height;
        bg.width = game.width;


        // Cups ---------------------------------------------

        items = game.add.group();
        items.inputEnableChildren = true;

        for (var i = 0; i < 10; i++) {
            var item = items.create(_.random(0, game.width - 80), _.random(0, game.height - 80), 'item');
            item.name = 'item-' + i;
            item.setScaleMinMax(0.05);
        }

        explosions = game.add.group();

        items.onChildInputUp.add(function(item) {
            item.destroy();
            game.debug.text(items.length + ' cups left', 10, 20);

            explode(item.position.x + 30, item.position.y + 30);

            if (items.length === 0) {
                flashlight.destroy();

                var text = game.add.text(game.world.centerX, game.world.centerY, 'You won',  {
                    font: '64px Arial',
                    fill: '#fff',
                    align: 'center',
                    boundsAlignH: '',
                    boundsAlignV: '',
                });

                text.anchor.set(0.5);
            }
        });


        // Flashlight --------------------------------------

        shadow = game.add.bitmapData(game.width, game.height);

        flashlight = game.add.image(0, 0, shadow);
        flashlight.blendMode = Phaser.blendModes.MULTIPLY;
    }

    function update() {
        updateShadowTexture();
    }


    // Util --------------------------------------------

    function updateShadowTexture() {
        shadow.context.fillStyle = '#111';
        shadow.context.fillRect(0, 0, game.width, game.height);

        var gradient = shadow.context.createRadialGradient(
            game.input.activePointer.x, game.input.activePointer.y, LIGHT_RADIUS * 0.75,
            game.input.activePointer.x, game.input.activePointer.y, LIGHT_RADIUS
        );

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        shadow.context.beginPath();
        shadow.context.fillStyle = gradient;
        shadow.context.arc(game.input.activePointer.x, game.input.activePointer.y, LIGHT_RADIUS, 0, Math.PI*2);
        shadow.context.fill();
        shadow.dirty = true;
    };

    function explode(x, y) {
        var explosion = explosions.getFirstDead();

        if (explosion == null) {
            explosion = game.add.sprite(0, 0, 'explosion');
            explosion.anchor.setTo(0.5, 0.5);

            var animation = explosion.animations.add('boom', [0, 1, 2, 3], 30, false);
            animation.killOnComplete = true;

            explosions.add(explosion);
        }

        explosion.revive();

        explosion.x = x;
        explosion.y = y;

        explosion.angle = game.rnd.integerInRange(0, 360);
        explosion.animations.play('boom');
    }
}());
