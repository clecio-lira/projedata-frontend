"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

import DialogCreateProduct from "@/components/DialogCreateProduct";
import DialogDeleteProduct from "@/components/DialogDeleteProduct";
import DialogEditProduct from "@/components/DialogEditProduct";
import { IProductResponse } from "@/interfaces/Product";
import { FindAllProducts } from "@/services/Product";

export default function Products() {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await FindAllProducts();
      setProducts(res);
    } catch (err) {
      setError(true);
      toast.error("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 font-josefin">
            Gerencie o catálogo de produtos
          </p>
        </div>
        <DialogCreateProduct onCreated={fetchProducts} />
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de Sincronização</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            Não conseguimos buscar os dados no servidor.
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProducts}
              className="ml-4 bg-white hover:bg-red-100 border-red-200 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Catálogo de Produtos</CardTitle>
          <CardDescription className="font-josefin">
            Lista de produtos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-150px">Código</TableHead>
                  <TableHead>Nome do Produto</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-red-500"
                    >
                      Erro ao carregar dados.
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 || !products ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-32 text-center text-gray-500"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium text-blue-600">
                        {product.code}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <DialogEditProduct
                            id={product.id}
                            onUpdated={fetchProducts}
                          />
                          <DialogDeleteProduct
                            id={product.id}
                            name={product.name}
                            setProducts={setProducts}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
