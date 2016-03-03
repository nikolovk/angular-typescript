module app.product {
    export class ProductController {
        private mainPictureUrl: string;
        private orderRequest: app.data.OrderModelRequest = <any>{};
        private product360: any = null;
        private show360: boolean = false;
        private currentGift = null;

        constructor(
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $location: ng.ILocationService,
            private $uibModal: any,
            private productDataService: app.services.IProductDataService,
            private shoppingCartDataService: app.services.IShoppingCartDataService,
            private catalogSearchService: app.services.ICatalogSearchService,
            private product: ProductResult
        ) {
            for (var i = 0; i < this.product.Product.Pictures.length; i++) {
                if (this.product.Product.Pictures[i].IsMain) {
                    this.mainPictureUrl = this.product.Product.Pictures[i].PictureUrl;
                    break;
                }
            }

            if (this.product.Product.PropViewModel && this.product.Product.PropViewModel[0]){
                this.productDataService.getSizes(this.product.Product.Id, 0, 0)
                    .then(sizes=> {
                        this.product.Product.PropViewModel[0].SelectedSize = null;
                        this.product.Product.PropViewModel[0].Sizes = sizes;

                            this.$scope.$watch(() =>
                                this.product.Product.PropViewModel[0].SelectedSize,
                                (newValue: app.data.Prop, oldValue: app.data.Prop) => {
                                    if (!newValue) {
                                        this.product.Product.PropViewModel[0].HasSizeError = true;
                                    } else {
                                        this.product.Product.PropViewModel[0].HasSizeError = false;
                                    }
                                });

                    });
            }

            this.orderRequest.Products = [];
            if (this.product.Product.TreeSixtyViewModel){
                this.open360();
            }

            if (this.product.Product.ActiveGift && this.product.Product.ActiveGift.length > 0) {
                this.currentGift = this.product.Product.ActiveGift[0];
                this.orderRequest.GiftId = this.product.Product.ActiveGift[0].IdProduct;
            }
        }

        setGift(gift) {
            this.currentGift = gift;
            this.orderRequest.GiftId = gift.IdProduct;
        }

        addToCart() {
            this.product.Product.AddClicked = true;
            var propsAreValid: boolean = this.validateProps();
            if (!propsAreValid) {
                return;
            }
            var cartModel: app.data.ShoppingCartViewModel = {
                Name: this.product.Product.Name,
                IdProduct: this.product.Product.Id,
                Quantity: 1,
                PicPath: this.product.Product.Pictures[0].PictureUrl,
                Price: this.product.Product.Price,
                PriceReduce: this.product.Product.PriceReduce,
                Prop: this.getSelectedProps()
            };

            this.shoppingCartDataService.addToCart(cartModel)
                .then(result => {
                    this.catalogSearchService.cartProducts = result;
                });
        }

        quickOrder() {
            var propsAreValid: boolean = this.validateProps();
            if (!propsAreValid) {
                return;
            }

            this.orderRequest.Products.push({
                IdProduct : this.product.Product.Id,
                Quantity: 1,
                Price: this.product.Product.PriceReduce,
                Prop: this.getSelectedProps()
            });
            this.shoppingCartDataService.makeOrder(this.orderRequest)
                .then(() => {
                });
        }

        propUpdate(prop: PropViewModel) {
            if (prop.HasActiveSize && !prop.SelectedSize) {
                prop.HasSizeError = true;
            } else {
                prop.HasSizeError = false;
            }
        }

        setSelectedSize(prop: PropViewModel, sizes: app.data.Prop[], value: string) {
            for (var i = 0; i < sizes.length; i++){
                if (sizes[i].Value == value) {
                    prop.SelectedSize = sizes[i];
                    return;
                }
            }
            prop.SelectedSize = null;
        }

        validateProps() {
            var result: boolean = true;
            for (var i = 0; i < this.product.Product.PropViewModel.length; i++) {
                if (this.product.Product.PropViewModel[i].IdType> 0 && !this.product.Product.PropViewModel[i].Selected) {
                    this.product.Product.PropViewModel[i].HasError = true;
                    result = false;
                } else {
                    this.product.Product.PropViewModel[i].HasError = false;
                }
                if (this.product.Product.PropViewModel[i].HasActiveSize &&
                    (!this.product.Product.PropViewModel[i].SelectedSize)) {
                    this.product.Product.PropViewModel[i].HasSizeError = true;
                    result = false;
                } else {
                    this.product.Product.PropViewModel[i].HasSizeError = false;
                }
            }
            if (result == false) {
                jQuery('.sizeError').first().focus();
            }

            return result;
        }

        getSelectedProps() {
            var props: app.data.Prop[] = [];
            for (var i = 0; i < this.product.Product.PropViewModel.length; i++) {
                if (this.product.Product.PropViewModel[i].Selected) {
                    props.push(this.product.Product.PropViewModel[i].Selected);
                }

                if (this.product.Product.PropViewModel[i].HasActiveSize &&
                    this.product.Product.PropViewModel[i].SelectedSize) {
                    props.push(this.product.Product.PropViewModel[i].SelectedSize);
                }
            }

            return props;
        }

        openSizes(url) {
            var modal = this.$uibModal.open({
                animation: true,
                template: '<img src="' + url + '" />',
            });
        }

        thumbPictureClick(pictureUrl) {
            this.show360 = false;
            this.mainPictureUrl = pictureUrl;
        }

        changePath(path) {
            this.$location.path(path);
        }

        setMainPicture(idProp: number) {

            for (var i = 0; i < this.product.Product.Pictures.length; i++) {
                if (this.product.Product.Pictures[i].IdProp == idProp) {
                    this.mainPictureUrl = this.product.Product.Pictures[i].PictureUrl;
                    this.show360 = false;
                    return;
                }
            }
        }

        setProperty(prop: PropViewModel, item: any) {
            prop.DisplayValue = item.DisplayValue;
            prop.Selected = item;
            prop.HasError = false;
            this.setMainPicture(item.IdProp);
            prop.Sizes = [];
            this.productDataService.getSizes(this.product.Product.Id, item.IdProp, prop.IdType)
                .then(sizes=> {
                    prop.SelectedSize = null;
                    prop.Sizes = sizes;
                    if (prop.HasActiveSize && !prop.HasWatch) {
                        prop.HasWatch = true;
                        this.$scope.$watch(() =>
                            prop.SelectedSize,
                            (newValue: app.data.Prop, oldValue: app.data.Prop) => {
                                if (!newValue) {
                                    prop.HasSizeError = true;
                                } else {
                                    prop.HasSizeError = false;
                                }
                            });
                    }
                });
        }

        open360() {
            this.show360 = true;
            if (!this.product360) {

                this.$timeout(() => {
                    this.init360();
                }, 50);
            }
        }

        private init360() {
            if (!this.product.Product.TreeSixtyViewModel) {
                return;
            }
            this.product360 = (<any>jQuery('.product360')).ThreeSixty({
                totalFrames: this.product.Product.TreeSixtyViewModel.TotalFrames, // Total no. of image you have for 360 slider
                endFrame: this.product.Product.TreeSixtyViewModel.TotalFrames, // end frame for the auto spin animation
                currentFrame: 1, // This the start frame for auto spin
                imgList: '.threesixty_images', // selector for image list
                progress: '.spinner', // selector to show the loading progress
                imagePath: this.product.Product.TreeSixtyViewModel.ImagePath, // path of the image assets
                filePrefix: '', // file prefix if any
                ext: '.png', // extention for the assets
                height: 1000,
                width: 447,
                navigation: true,
                disableSpin: true // Default false
            });
        }

        //private initZoom() {
        //    (<any>$("#zoom01")).elevateZoom(
        //        {
        //            zoomWindowFadeIn: 500,
        //            zoomWindowFadeOut: 500,
        //            lensFadeIn: 500,
        //            lensFadeOut: 500,
        //            scrollZoom: false,
        //            containLensZoom: true,
        //            gallery: 'ProductPictures',
        //            cursor: 'pointer',
        //            galleryActiveClass: "active"
        //        });

        //    if (window.screen.availWidth < 720) {
        //        (<any>$("#zoom01")).elevateZoom({
        //            zoomType: "inner",
        //            cursor: "crosshair",
        //            gallery: 'ProductPictures',
        //            galleryActiveClass: "active"
        //        });
        //    }
        //    //(<any>$("#zoom01")).bind("click", function (e) {
        //    //    var ez = $('#zoom01').data('elevateZoom');
        //    //    $.fancybox(ez.getGalleryList());
        //    //    return false;
        //    //});
        //}
    }

    productController.$inject = [
        '$scope',
        '$timeout',
        '$location',
        '$uibModal',
        'app.services.ProductDataService',
        'app.services.ShoppingCartDataService',
        'app.services.CatalogSearchService',
        'product'];

    function productController($scope, $timeout, $location, $uibModal, productDataService, shoppingCartDataService, catalogSearchService, product): ProductController {
        return new ProductController($scope, $timeout, $location, $uibModal, productDataService, shoppingCartDataService, catalogSearchService, product);
    };

    angular.module('app.product')
        .controller('app.product.ProductController', productController);

    export interface ProductResult {
        MetaDescription: string;
        MetaKeywords: string;
        RedirectUrl: string;
        StatusCode: number;
        Title: string;
        Product: ProductViewModel;
    }

    export interface ProductViewModel {
        ActiveGift: any;
        Description: string;
        Pictures: ProductPictureViewModel[];
        PropViewModel: PropViewModel[];
        Id: number;
        Name: string;
        Price: number;
        PriceReduce: number;
        Url: string;
        AddClicked: boolean;
        TreeSixtyViewModel: any;
    }

    export interface ProductPictureViewModel {
        IdProp: number;
        IsBack: boolean;
        IsMain: boolean;
        PictureUrl: string;
    }

    export interface PropViewModel {
        IdType: number;
        Name: string;
        DisplayValue: string;
        DisplaySize: string;
        Selected: app.data.Prop;
        SelectedSize: app.data.Prop;
        Sizes: app.data.Prop[];
        Value: app.data.Prop[];
        HasActiveSize: boolean;
        HasWatch: boolean;
        SizeTableImagePath: string;
        HasError: boolean;
        HasSizeError: boolean;
    }
}