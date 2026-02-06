export interface IProductRequest {
  code: string;
  name: string;
  price: number;
  rawMaterials: IProductRawMaterialRequest[];
}

export interface IProductRequestUpdate {
  code: string;
  name: string;
  price: number;
}

export interface IProductRawMaterialRequest {
  rawMaterialId: number;
  quantityNeeded: number;
}

export interface IProductResponse {
  id: number;
  code: string;
  name: string;
  price: number;
}

export interface IProductDetailResponse {
  id: number;
  code: string;
  name: string;
  price: number;
  rawMaterials: IProductRawMaterialResponse[];
}

export interface IProductRawMaterialResponse {
  rawMaterialId: number;
  rawMaterialName: string;
  quantityNeeded: number;
}
