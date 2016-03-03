module app.services {

    export interface IProductDataService {
        getSizes(idProduct: number, idColour: number, idType: number): ng.IPromise<app.data.Prop[]>;
        getProduct(name: string): ng.IPromise<app.product.ProductResult>;
        get360Pictures(productId: string): ng.IPromise<string[]>;
    }

    class ProductDataService implements IProductDataService {

        constructor(private $http: ng.IHttpService) {
        }

        getSizes(idProduct: number, idColour: number, idType: number): ng.IPromise<app.data.Prop[]> {
            return this.$http.post('/api/catalog/getSize',
                { idProduct: idProduct, idColour: idColour, idType: idType })
                .then((response: ng.IHttpPromiseCallbackArg<app.data.Prop[]>): app.data.Prop[]=> {
                    return response.data;
                });
        } 

        getProduct(seoName: string): ng.IPromise<app.product.ProductResult> {
            return this.$http.post('/api/catalog/GetProduct', { seoName: seoName})
                .then((response: ng.IHttpPromiseCallbackArg<app.product.ProductResult>): app.product.ProductResult=> {
                    return response.data;
                });
        }

        get360Pictures(productId: string): ng.IPromise<string[]> {
            return this.$http.post('/api/catalog/get360Pictures', { productId: productId })
                .then((response: ng.IHttpPromiseCallbackArg<string[]>): string[]=> {
                    return response.data;
                });
        }
    }

    factory.$inject = ['$http'];
    function factory($http: ng.IHttpService): IProductDataService {
        return new ProductDataService($http);
    }

    angular
        .module('app.services')
        .factory('app.services.ProductDataService',
        factory);
}