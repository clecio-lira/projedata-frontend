export interface IProductionReport {
  totalProductionValue: number;
  produced: Array<{
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
  }>;
  notProduced: Array<{
    productId: number;
    productName: string;
    reason: string;
  }>;
}
