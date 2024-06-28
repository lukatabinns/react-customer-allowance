export interface StoreInfo {
    currency: string;
    domain: string;
    secure_url: string;
    name: string;
    logo: Logo;
}

export interface Props {
    message: string;
}

export interface Logo {
    url: string;
}

export interface State {
    isCatalogSummaryLoading: boolean;
    isStoreInfoLoading: boolean;
    catalogSummary: [];
    storeInfo: StoreInfo
}