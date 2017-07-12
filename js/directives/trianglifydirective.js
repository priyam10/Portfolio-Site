app.directive("ngTrianglify", ["ColorService", function(ColorService) {
    return {
        restrict: 'AE',
        scope: {
            options: "=",
            interval: "@"
        },
        link: function(scope, element, attr, ctrl) {
            var width = 0;
            var height = 0;

            var bg1 = $("<canvas id='bg1''></canvas>").css({
                "z-index": 0,
                "position": "absolute"
            });
            var bg2 = $("<canvas id='bg2''></canvas>").css({
                "z-index": 1,
                "position": "absolute"
            });
            element.append(bg1);
            element.append(bg2);
            bg2.fadeOut();

            resize();
            setBackground();

            var timer;
            scope.$watch('interval', function(newValue) {
                if (newValue && !isNaN(newValue) && newValue > 0 && newValue < 1000) {
                    if (timer) clearInterval(timer);
                    timer = setInterval(() => {
                        scope.options = null;
                        setBackground();
                    }, Math.max(1000, scope.interval * 1000));
                } else if (newValue == 0) {
                    if (timer)
                        clearInterval(timer);
                }
            }, true);

            scope.$watch('options', function(newValue) {
                if (!newValue) {
                    setBackground();
                }
            }, true);

            $(window).resize(() => {
                if (resize()) {
                    setBackground();
                }
            });


            function resize() {
                $(element).parent().css('height', element[0].offsetHeight);
                //Only generate when there is a bigger size, otherwise it is wasted memory
                if (element[0].offsetWidth > width || element[0].offsetHeight > height) {
                    width = element[0].offsetWidth;
                    height = element[0].offsetHeight;
                    bg1.css('height', height);
                    bg2.css('height', height);
                    return true;
                } else return false;
            }

            var dobg1 = true;
            var timerReset = true; //Prevents too many background changes (max 1 per sec)
            var applyAfterTimeout = false; //Tells if the background reset should be applied after timer

            function setBackground() {
                if (timerReset) {
                    var pattern = Trianglify({
                        width: width,
                        height: height,
                        cell_size: 150
                    });


                    scope.options = pattern.opts;

					
			var newRgb1 = ColorService.averageColors(ColorService.hexToRgb(pattern.opts.x_colors[0]),
				ColorService.hexToRgb(pattern.opts.y_colors[Math.floor(pattern.opts.y_colors.length / 2)]));
            var newRgb2 = ColorService.averageColors(ColorService.hexToRgb(pattern.opts.x_colors[pattern.opts.x_colors.length - 1]),
				ColorService.hexToRgb(pattern.opts.y_colors[Math.floor(pattern.opts.y_colors.length / 2)]));

            var ultimateRgb = ColorService.averageColors(newRgb1, newRgb2);
            var secondColor = ColorService.darken(ultimateRgb, 60);
            var thirdColor = ColorService.lighten(ultimateRgb, 30);

            var rs = ultimateRgb.r / 255;
            var rg = ultimateRgb.g / 255;
            var rb = ultimateRgb.b / 255;
            var contentColor = {
                r: Math.min(Math.floor(ultimateRgb.r + (200 * (1 - rs))), 255),
                g: Math.min(Math.floor(ultimateRgb.g + (200 * (1 - rg))), 255),
                b: Math.min(Math.floor(ultimateRgb.b + (200 * (1 - rb))), 255)
            };

            ColorService.colors.bgcolor = contentColor;
            ColorService.colors.darkcolor = ultimateRgb;
            ColorService.colors.ultradarkbgcolor = secondColor;
            ColorService.colors.ultradarkcolor = secondColor;
            ColorService.colors.darkcolor = ultimateRgb;
            ColorService.colors.lightcolor = thirdColor;
            ColorService.colors.ultralightcolor = contentColor;
            ColorService.colors.descriptioncolor = ColorService.lighten(thirdColor, 45);
            ColorService.colors.headercolor = ColorService.darken(secondColor, 25);

            $(".bgcolor").css("background-color", ColorService.rgbToString(contentColor)).data("bgcolor", contentColor);
            $(".darkbgcolor").css("background-color", ColorService.rgbToString(ultimateRgb)).data("bgcolor", ultimateRgb);
            $(".ultradarkbgcolor").css("background-color", ColorService.rgbToString(secondColor)).data("bgcolor", secondColor);
            $(".bgcolor-transparent").css("background-color", ColorService.rgbToString(contentColor, 0.75)).data("bgcolor", contentColor);
            $(".darkbgcolor-transparent").css("background-color", ColorService.rgbToString(ultimateRgb, 0.7)).data("bgcolor", ultimateRgb);
            $(".ultradarkbgcolor-transparent").css("background-color", ColorService.rgbToString(secondColor, 0.75)).data("bgcolor", secondColor);
            $(".ultradarkcolor").css("color", ColorService.rgbToString(secondColor)).data("color", secondColor);
            $(".darkcolor").css("color", ColorService.rgbToString(ultimateRgb)).data("color", ultimateRgb);
            $(".lightcolor").css("color", ColorService.rgbToString(thirdColor)).data("color", thirdColor);
            $(".ultralightcolor").css("color", ColorService.rgbToString(contentColor)).data("color", contentColor);
            $(".headercolor").css("color", ColorService.rgbToString(ColorService.colors.headercolor)).data("color", ColorService.colors.headercolor);
            $(".descriptioncolor").css("color", ColorService.rgbToString(ColorService.colors.descriptioncolor)).data("color", ColorService.colors.descriptioncolor);
			$(".active").css("background-color", ColorService.rgbToString(secondColor, 0.75)).data("bgcolor", secondColor);
			$(".active i").css("color", "#fff");
					
					
					
                    if (dobg1) {
                        pattern.canvas(bg1[0]);
                        bg2.fadeOut(1000);
                        dobg1 = false;
                    } else {
                        pattern.canvas(bg2[0]);
                        bg2.fadeIn(1000);
                        dobg1 = true;
                    }
                    timerReset = false;
                    applyAfterTimeout = false;
                    setTimeout(function() {
                        timerReset = true;
                        if (applyAfterTimeout)
                            setBackground();
                    }, 1000);
                } else {
                    applyAfterTimeout = true;
                }
            }
        }
    };
}]);