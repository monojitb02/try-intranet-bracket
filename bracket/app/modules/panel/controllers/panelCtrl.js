'use strict';

var utility = require('../../../util');
var api = require('../../../util/api');
module.exports = function($scope, $rootScope, $state, $http, $timeout) {

    //checking login status
    if (!utility.loggedInUser) {
        $state.go('login');
    }

    //logout user
    $scope.logout = function() {
        $http({
            url: api.logout,
            method: 'POST'
        }).success(function(result) {
            if (result.success) {
                utility.loggedInUser = null;
                $state.go('login');
            }
        }).error(function() {
            //TODO: show error message
        });
    };

    $scope.$on('$stateChangeSuccess', function(event) {
        // console.log('stateChangeSuccess');
    });

    //TO_DO: try watching on window.location 
    $scope.$on('$viewContentLoaded', function(event) {
        //console.log('viewContentLoaded');
        $timeout(function() {
            //console.log('test window location', window.location, window.location.hash);
            var originalHash = window.location.hash /*.replace(/\?.*$/, '')*/ ,
                activeListElement = jQuery('a[href="' + originalHash + '"]').closest("li");
            $rootScope.currentPath = originalHash;

            if (jQuery('.nav-active').length &&
                !jQuery.contains(jQuery('.nav-active')[0], activeListElement[0])) {
                jQuery('.nav-active > ul').slideUp(200);
                jQuery('.nav-active').removeClass('nav-active');
            }

            // For only transition between items of same sub menu 
            jQuery('.leftpanelinner li.active').removeClass('active');
            activeListElement.addClass('active');
            if (activeListElement.parents('ul').hasClass('children')) {
                activeListElement.parents('.nav-parent').addClass('active nav-active');
                activeListElement.parents('ul').slideDown(200);
            }
            return adjustmainpanelheight();
        }, 0);

    });

    function closeVisibleSubMenu() {
        jQuery('.nav-parent').each(function() {
            var t = jQuery(this);
            if (t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function() {
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function adjustmainpanelheight() {
        // Adjust mainpanel height
        /* var pageContentHeight = jQuery('.page-content').height();
         jQuery('.mainpanel').height(jQuery('.mainpanel').height());*/
    }

    jQuery('.nav-bracket > li').hover(function() {
        jQuery(this).addClass('nav-hover');
    }, function() {
        jQuery(this).removeClass('nav-hover');
    });

    // Menu Toggle slide
    $scope.toggleMenuSlide = function($event) {
        var navParent = jQuery($event.target).closest('a').parent();
        var sub = navParent.find('> ul');
        //console.log('menu slide');
        // Dropdown works only when leftpanel is not collapsed
        if (!jQuery('body').hasClass('leftpanel-collapsed')) {
            //console.log(sub.is(':visible'));
            if (sub.is(':visible')) {
                sub.slideUp(200, function() {
                    navParent.removeClass('nav-active');
                    jQuery('.mainpanel').css({
                        height: ''
                    });
                });
            } else {
                closeVisibleSubMenu();
                navParent.addClass('nav-active');
                sub.slideDown(200, function() {});
            }
        }
        return adjustmainpanelheight();
    };

    // Menu Toggle
    $scope.toggleMenu = function() {
        //console.log('test menutoggle');
        var body = jQuery('body');
        var bodypos = body.css('position');
        if (bodypos != 'relative') {
            if (!body.hasClass('leftpanel-collapsed')) {
                body.addClass('leftpanel-collapsed');
                jQuery('.nav-bracket ul').attr('style', '');

                jQuery(this).addClass('menu-collapsed');

            } else {
                body.removeClass('leftpanel-collapsed chat-view');
                jQuery('.nav-bracket li.active ul').css({
                    display: 'block'
                });
                jQuery(this).removeClass('menu-collapsed');
            }
        } else {
            if (body.hasClass('leftpanel-show')) {
                body.removeClass('leftpanel-show');
            } else {
                body.addClass('leftpanel-show');
            }
            adjustmainpanelheight();
        }
    };

    // Chat View
    $scope.toggleChatView = function() {
        var body = jQuery('body');
        var bodypos = body.css('position');
        if (bodypos != 'relative') {
            if (!body.hasClass('chat-view')) {
                body.addClass('leftpanel-collapsed chat-view');
                jQuery('.nav-bracket ul').attr('style', '');
            } else {
                body.removeClass('chat-view');
                if (!jQuery('.menutoggle').hasClass('menu-collapsed')) {
                    jQuery('body').removeClass('leftpanel-collapsed');
                    jQuery('.nav-bracket li.active ul').css({
                        display: 'block'
                    });
                } else {

                }
            }
        } else {
            if (!body.hasClass('chat-relative-view')) {
                body.addClass('chat-relative-view');
                body.css({
                    left: ''
                });
            } else {
                body.removeClass('chat-relative-view');
            }
        }
    };

    //change state to profile
    $scope.goMyProfile = function() {
        $state.go('app.profile');
    };

};
