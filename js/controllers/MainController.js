app.controller("MainController", ["$scope", "ColorService", 'ScrollService',
    function($scope, ColorService, ScrollService) {
		
        var birthdate = moment("1993-11-10 15:59").startOf('minute');
        $scope.age = moment().diff(birthdate, 'years'); 
		
		$('.logocircle').hover(function() {
            $(this).find('.logo').css({
                'color': ColorService.rgbToString(ColorService.colors.ultradarkcolor),
                'background-color': ColorService.rgbToString(ColorService.colors.darkcolor)
            });
        }, function() {
            $(this).find('.logo').css({
                'color': ColorService.rgbToString(ColorService.colors.lightcolor),
                'background-color': ColorService.rgbToString(ColorService.colors.ultradarkcolor)
            });
        });
		
		
		$scope.interval = 30;
		
		setTimeout(() => {

            $(".hoverdarker").hover(function() {
                    $(this).css('background-color', ColorService.rgbToString(ColorService.darken($(this).data('bgcolor'), 30)));
                },
                function() {
                    $(this).css('background-color', ColorService.rgbToString($(this).data('bgcolor')));
                });

        }, 5);
		
        $scope.resetBG = function() {
            $scope.triangleconfig = null;
        }
		
		
        this.ivesimages = [];
        for (let i = 0; i < 3; i++) {
            this.ivesimages.push("res/images/ives" + i + ".png");
        };

        this.currentIves = Math.floor(Math.random() * 3)
        this.changeIvesImage = () => {
            if (!$scope.$$phase) {
                $scope.$apply(() => { this.currentIves = (this.currentIves + 1) % 3; });
            } else {
                this.currentIves = (this.currentIves + 1) % 3;
            }
        }
		
		this.changeIvesImage();
		
        navigationScroll();

        $(window).scroll(navigationScroll);

        function navigationScroll() {
            var windowTopHTML = $("html").scrollTop();
            var windowTopBody = $("body").scrollTop();
            var windowTop = Math.max(windowTopHTML, windowTopBody);
            if (windowTop > 50) {
                $('.header').removeClass('navigator');
                $('.nghello').addClass('navigator');
				$(".profilepic").css("opacity", "1");	
				$("ng-navigation").css("opacity", "0.9");
            } else {
                $('.header').addClass('navigator');
                $('.nghello').removeClass('navigator');
				$(".profilepic").css("opacity", "0");
				$("ng-navigation").css("opacity", "0");
            }
        }

        $scope.goDown = function() {
            var top = 0;
            if ($('#userinforow').offset().top - 120 + $('#userinforow')[0].offsetHeight - $(window).height() > $('#userinforow').offset().top) {
                top = $('#userinforow').offset().top - 120;
            } else {
                top = $('#userinforow').offset().top + $('#userinforow')[0].offsetHeight - $(window).height() - 75;
            }
            $("html, body").stop().animate({
                scrollTop: top
            }, 800);
			$(".profilepic").css("opacity", "1");
			$(".profilepic").css("visibility", "visible");
        }

					
    }
]);
