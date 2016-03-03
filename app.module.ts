/// <reference path="../typings/angularjs/angular.d.ts" />
((): void => {
    'use strict';

    angular.module('app', [
        'app.home',
        'app.account',
        'app.cart',
        'app.catalog',
        'app.services',
        'app.product',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'ngCookies',
        'blockUI',
        'toastr'
    ]).directive('accessibleForm', function () {
        return {
            restrict: 'A',
            link: function (scope, elem) {

                // set up event handler on the form element
                elem.on('submit', function () {

                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');

                    // if we find one, set focus
                    if (firstInvalid) {
                        (<any>firstInvalid).focus();
                    }
                });
            }
        };
    })
        .config(["blockUIConfig", function (blockUIConfig) {
            //blockUIConfig.delay = 0;
            blockUIConfig.autoInjectBodyBlock = true;
            // blockUIConfig.autoBlock = false;
            blockUIConfig.template = "<div class=\"block-ui-overlay\"><\/div><div class=\"block-ui-message-container\"><img class=\"anim\" src= \"\/images\/loader.gif\" alt= \"loading...\" \/><\/div>";
        }]);
})();