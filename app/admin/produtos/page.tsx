"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
import { Search, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Importações dos novos componentes de Produto
import DialogCreateProduct from "@/components/DialogCreateProduct";
import DialogDeleteProduct from "@/components/DialogDeleteProduct";
import DialogEditProduct from "@/components/DialogEditProduct";
import { IProductResponse } from "@/interfaces/Product";
import { FindAllProducts } from "@/services/Product";
// import { ProductDetailDialog } from "@/components/ProductDetailDialog";

export default function Products() {
  const [products, setProducts] = useState<IProductResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Paginação
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Controle do modal de detalhes
  const [selectedProduct, setSelectedProduct] =
    useState<IProductResponse | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await FindAllProducts();
      setProducts(res);
      // setTotal(res.total);

      console.log("Buscando produtos...");
    } catch (error) {
      toast.error("Erro ao buscar os produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-gray-900">
            Produtos
          </h1>
          <p className="text-gray-600 font-josefin">
            Gerencie o catálogo de produtos e matérias-primas
          </p>
        </div>

        <DialogCreateProduct onCreated={fetchProducts} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => {
              setPage(1);
              setSearchTerm(e.target.value);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm font-montserrat text-gray-600">
          {loading
            ? "Carregando..."
            : `Exibindo ${products} de ${total} produtos`}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat text-xl">
            Catálogo de Produtos
          </CardTitle>
          <CardDescription className="font-josefin">
            Lista de produtos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto font-montserrat">
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
                {loading
                  ? [...Array(5)].map((_, i) => (
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
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  : products.map((product) => (
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
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsDetailOpen(true);
                              }}
                              title="Visualizar Detalhes"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>

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
                    ))}
              </TableBody>
            </Table>

            {!loading && products.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                Nenhum produto encontrado.
              </div>
            )}
          </div>

          {/* Paginação */}
          <div className="flex justify-center gap-2 font-montserrat mt-6">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              Anterior
            </Button>

            <span className="px-4 text-sm flex items-center bg-slate-100 rounded-md">
              Página {page} de {Math.ceil(total / limit) || 1}
            </span>

            <Button
              variant="outline"
              onClick={() =>
                setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))
              }
              disabled={page >= Math.ceil(total / limit) || loading}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <ProductDetailDialog
        productId={selectedProduct?.id}
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      /> */}
    </div>
  );
}
