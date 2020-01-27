require('./style.less');
var template = require('./template.html');

ko.components.register('ko:ho-game', {
    template: template,

    viewModel: {
        createViewModel: function(params, componentInfo) {
            var $component = $(componentInfo.element);

            return new function() {
                var vm = this;

                vm.params = params;

                vm.currentLevelNum = ko.observable(0);
                vm.maxLevelNum = 2;

                vm.levels = ko.observableArray([
                    {
                        completed: ko.observable(false),

                        assets: {
                            bg: '../images/level-1/bg.svg',

                            objects: [
                                '../images/level-1/01.svg',
                                '../images/level-1/02.svg',
                                '../images/level-1/03.svg',
                                '../images/level-1/04.svg',
                                '../images/level-1/05.svg',
                                '../images/level-1/06.svg',
                                '../images/level-1/07.svg',
                                '../images/level-1/08.svg',
                                '../images/level-1/09.svg',
                                '../images/level-1/10.svg',
                            ],
                        },
                    }, {
                        completed: ko.observable(false),

                        assets: {
                            bg: '../images/level-2/bg.jpg',

                            objects: [
                                '../images/level-2/01.svg',
                                '../images/level-2/02.svg',
                                '../images/level-2/03.svg',
                            ],
                        },
                    }, {
                        completed: ko.observable(false),

                        assets: {
                            bg: '../images/level-3/bg.jpg',

                            objects: [
                                '../images/level-3/01.svg',
                                '../images/level-3/02.svg',
                                '../images/level-3/03.svg',
                                '../images/level-3/04.svg',
                            ],
                        },
                    },
                ]);

                var $gameBody = $component.find('[js-game-body]').first();
                var $gameArea = $component.find('[js-game-area]').first();
                var $legend = $component.find('[js-legend-objects]').first();
                var $helpBtn = $component.find('[js-help]').first();
                var $fullscreenBtn = $component.find('[js-fullscreen]').first();
                var $prevLevelBtn = $component.find('[js-level-prev]').first();
                var $nextLevelBtn = $component.find('[js-level-next]').first();

                $helpBtn.on('click', function() {
                    var $remainingOjects = $gameArea.find('[js-object]:visible');
                    var $randomObject = $(_.sample($remainingOjects.get()));
                    $randomObject.css('background-color', 'orange');
                    setTimeout(function() {$randomObject.css('background-color', 'transparent')}, 1000);
                });

                $fullscreenBtn.on('click', function() {
                    if (!document.fullscreenElement)
                        $gameBody.get(0).requestFullscreen()
                    else
                        document.exitFullscreen();
                });

                $prevLevelBtn.on('click', function() {
                    if (vm.currentLevelNum() !== 0) {
                        vm.currentLevelNum(vm.currentLevelNum() - 1);
                        initGame(vm.currentLevelNum());
                    }
                });

                $nextLevelBtn.on('click', function() {
                    if (vm.currentLevelNum() !== vm.maxLevelNum) {
                        vm.currentLevelNum(vm.currentLevelNum() + 1);
                        initGame(vm.currentLevelNum());
                    }
                });

                initGame(vm.currentLevelNum());

                function initGame(levelNum) {
                    $gameArea.empty();
                    $legend.empty();
                    $gameArea.css('background-image', 'url("' + vm.levels()[levelNum].assets.bg + '")');


                    // Objects -------------------------------------------------------

                    var $objects = $(vm.levels()[levelNum].assets.objects).map(function(i, objAsset) {
                        return $('<object class="ho-game__object" js-object type="image/svg+xml"></object>')
                            .css({
                                top: 'calc(' + _.random(12, 96) + '% - 10%)',
                                left: 'calc(' + _.random(12, 100) + '% - 10%)',
                            })

                            .attr('data', objAsset)
                            .data('index', i).get(0);
                    });

                    $objects.on('load', function() {
                        var $item = $(this);

                        $item.contents().find('svg').children().on('click', function() {
                            $legendObjects.filter(function(i, legendItem) {return $(legendItem).data('index') === $item.data('index')}).remove();
                            $item.remove();

                            if ($objects.filter(':visible').length === 0) {
                                vm.levels()[levelNum].completed(true);
                                $gameArea.css('background-image', 'none');

                                var msgHtml = levelNum === vm.maxLevelNum
                                    ? $('<div class="ho-game__message">Вы победили! <a href="#" js-again>Начать сначала?</a></div>')
                                    : $('<div class="ho-game__message">Уровень пройден! <a href="#" js-again>Дальше?</a></div>');

                                $gameArea.append(msgHtml);

                                $gameArea.find('[js-again]').on('click', function($evt) {
                                    $evt.preventDefault();

                                    if (vm.currentLevelNum() === vm.maxLevelNum)
                                        vm.currentLevelNum(0);
                                    else
                                        vm.currentLevelNum(vm.currentLevelNum() + 1);

                                    initGame(vm.currentLevelNum());
                                });
                            }
                        });
                    });

                    $gameArea.append($objects);
                    //$objects.draggable(); // Not working with `object` elements


                    // Legend -------------------------------------------------------

                    var $legendObjects = $(vm.levels()[levelNum].assets.objects).map(function(i, objAsset) {
                        var $legendObject = $('<li class="ho-game__legend-object"></li>').data('index', i);

                        var $legendObjectInner = $('<div class="ho-game__legend-object-inner"></div>')
                            .css('background-image', 'url("' + objAsset + '")');

                        return $legendObject.append($legendObjectInner).get(0);
                    });

                    $legend.append($legendObjects);
                }
            };
        }
    },
});
