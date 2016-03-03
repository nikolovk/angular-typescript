((): void => {
    'use strict';

    angular
        .module('app')
        .config(config);


    config.$inject = [
        '$routeProvider',
        '$locationProvider'
    ];

    function config($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider): void {
        $routeProvider
            .when('/', {
                templateUrl: '/template/store/HomePage',
                controller: 'app.home.HomeController',
                controllerAs: 'vm',
            })
            .when('/Home/Store/Search', {
                templateUrl: '/template/Catalog/SearchViewResult',
                controller: 'app.catalog.CatalogController',
                controllerAs: 'vm',
            })
            .when('/faq', {
                templateUrl: '/template/store/faq',
                controller: 'app.home.FaqController',
                controllerAs: 'vm',
                resolve: {
                    model: ['app.services.HomeDataService',
                        function (homeDataService: app.services.IHomeDataService) {
                            return homeDataService.getFaq()
                                .then(model => {
                                    return model;
                                });
                        }]
                }
            })
            .when('/user-profile/my-account', {
                templateUrl: '/template/manage/index',
            })
            .when('/user-profile/my-orders', {
                templateUrl: '/template/manage/Orders',
            })
            .when('/user-profile/promo-codes', {
                templateUrl: '/template/manage/PromoCodes',
            })
            .when('/user-profile/gift-voucher', {
                templateUrl: '/template/manage/GiftVoucher',
            })
            .when('/user-profile/address-book', {
                templateUrl: '/template/manage/addressbook',
            })
            .when('/user-profile/account-settings', {
                templateUrl: '/template/manage/AccountSettings',
            })
            .when('/promotions/giftconditions', {
                templateUrl: '/template/catalog/giftconditions',
            })
            .when('/contacts', {
                templateUrl: '/template/store/contacts',
            })
            .when('/reset-password', {
                templateUrl: 'template/account/resetpassword',
            })
            .when('/delivery-conditions', {
                templateUrl: '/template/store/DeliveryConditions',
                controller: 'app.home.DeliveryConditionsController',
                controllerAs: 'vm',
                resolve: {
                    model: ['app.services.HomeDataService',
                        function (homeDataService: app.services.IHomeDataService) {
                            return homeDataService.getDeliveryConditions()
                                .then(model => {
                                    return model;
                                });
                        }]
                }
            })
            .when('/store-conditions', {
                templateUrl: '/template/store/StoreConditions',
                controller: 'app.home.StoreConditionsController',
                controllerAs: 'vm',
                resolve: {
                    model: ['app.services.HomeDataService',
                        function (homeDataService: app.services.IHomeDataService) {
                            return homeDataService.getStoreConditions()
                                .then(model => {
                                    return model;
                                });
                        }]
                }
            })
            .when('/cookies', {
                templateUrl: '/template/store/Cookies',
                controller: 'app.home.CookiesController',
                controllerAs: 'vm',
                resolve: {
                    model: ['app.services.HomeDataService',
                        function (homeDataService: app.services.IHomeDataService) {
                            return homeDataService.getCookies()
                                .then(model => {
                                    return model;
                                });
                        }]
                }
            })
            .when('/shoppingcart', {
                templateUrl: '/template/shoppingcart/shoppingcart',
                controller: 'app.cart.ShoppingCartController',
                controllerAs: 'vm',
            })
            .when('/user-profile', {
                templateUrl: '/template/Manage/Index',
                controller: 'app.account.AccountController',
                controllerAs: 'vm',
            })
            .when('/error', {
                templateUrl: '/template/Store/error'
            })
            .when('/error404', {
                templateUrl: '/template/Store/error404'
            })
            .when('/:category', {
                templateUrl: '/template/Catalog/SearchViewResult',
                controller: 'app.catalog.CatalogController',
                resolve: {
                    resolve: ['$q', '$location','$route', '$routeParams', 'app.services.CatalogDataService', 'app.services.CatalogSearchService',
                        function ($q, $location,$route, $routeParams, catalogDataService: app.services.ICatalogDataService,
                            catalogSearchService: app.services.ICatalogSearchService) {
                            if ($route.current.params.category == catalogSearchService.CategoryOrWord){
                                return;
                            }

                            return catalogDataService.search(null, $route.current.params.category, true)
                                .then((data: app.data.Response) => {
                                    if (data.StatusCode == 500) {
                                        $location.path(data.RedirectUrl);
                                        return $q.reject();
                                    } else {
                                        catalogSearchService.dataSource = data.Result;
                                        catalogSearchService.IsCategory = true;
                                        catalogSearchService.CategoryOrWord = $route.current.params.category;
                                    }



                                });
                        }]
                },
                controllerAs: 'vm',
            })
            .when('/:category/:product', {
                templateUrl: '/template/Catalog/Product',
                controller: 'app.product.ProductController',
                resolve: {
                    product: ['$q', '$location', '$route', '$routeParams', 'app.services.ProductDataService',
                        function ($q: ng.IQService,$location: ng.ILocationService, $route, $routeParams, productDataService: app.services.IProductDataService) {
                            return productDataService.getProduct($route.current.params.product)
                                .then(product => {
                                    if (product.StatusCode == 500) {
                                        $location.path(product.RedirectUrl);
                                        return $q.reject();
                                    } else {
                                        return product;
                                    }
                                });
                        }]
                },
                controllerAs: 'vm',
            })
        ;

        $locationProvider.html5Mode(true)
    }

})();