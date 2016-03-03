module app.data {
    export interface BaseJsonResult {
        StatusCode: number;
        ErrorList: string[];
    }

    export interface ShoppingCartViewModel {
        Name: string;
        PicPath: string;
        IdProduct: number;
        Quantity: number;
        Price: number;
        PriceReduce: number;
        Prop: Prop[];
    }


    export interface Response {
        ErrorList: string[];
        MetaDescription: string;
        MetaKeywords: string;
        RedirectUrl: string;
        Result: any;
        StatusCode: number;
        Title: string;
    }

    export enum OrderType {
        QuickOrder = 1,
        ShoppingCart = 2
    }

    export interface OrderModelRequest {
        OrderType: OrderType;
        PaymentType: number;
        GiftId: number;
        PromoCode: string;
        Products: OrderedProduct[];

        Name: string;
        City: string;
        Phone: string;
        Email: string;
        Address: string;
    }

    export interface OrderedProduct {
        IdProduct: number;
        Quantity: number;
        Price: number;
        Prop: Prop[];
    }

    //export interface OrderProp {
    //    IdProp: number;
    //    Value: string;
    //}

    export interface EmpaioDataSourceRequest {
        Page: number;
        PageSize: number;
        Sorts: EmpaioSortDescriptor;
        SelectedFilters: number[];
    }

    export interface EmpaioSortDescriptor {
        Member: string;
        Dir: string;//asc%desc
    }

    export interface EmpaioFilterDescriptor {
        Member: string;
        Value: string;
    }

    export interface EmpaioDataSource extends EmpaioDataSourceRequest {
        TotalCount: number;
        Data: ProductsViewModel[];
        Filters: FilterViewModel[];
    }

    export interface FilterViewModel {
        IdType: number;
        IsColor: boolean;
        Name: string;
        Value: Prop[];
    }

    export interface Prop {
        DisplayValue?: string;
        IdProp: number;
        Value: string;
        IsSelected?: boolean;
        IsColor: boolean;
    }

    export interface ProductsViewModel {
        IdCategory: number;
        Name: string;
        PicPathBack: string;
        PicPathMain: string;
        Price: number;
        PriceReduce: number;
        PromoLabel: PromoLabel;
        Alt: string;
        LabelPath: string;
        Props: PropViewModel[];
        Url: string;
    }

    export interface PromoLabel {
        Alt: string;
        LabelPath: string;
    }

    export interface PropViewModel {
        IdType: number;
        IsPrimary: boolean;
        Values: string[];
        HasActiveSize: boolean;
        SizeTableImagePath: string;
    }
}