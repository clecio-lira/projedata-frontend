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

import DialogCreateRawMaterial from "@/components/DialogCreateRawMaterial";
import DialogDeleteRawMaterial from "@/components/DialogDeleteRawMaterial";
import DialogEditRawMaterial from "@/components/DialogEditRawMaterial";
import { IRawMaterialResponse } from "@/interfaces/RawMaterial";
import { FindAllRawMaterials } from "@/services/RawMaterial";

export default function RawMaterials() {
  const [materials, setMaterials] = useState<IRawMaterialResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await FindAllRawMaterials();
      setMaterials(res);
    } catch (err) {
      setError(true);
      toast.error("Não foi possível carregar as matérias-primas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-montserrat text-gray-900">
            Matéria-Prima
          </h1>
          <p className="text-gray-600 font-josefin">
            Gerencie o catálogo de matérias-primas
          </p>
        </div>
        <DialogCreateRawMaterial onCreated={fetchMaterials} />
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
              onClick={fetchMaterials}
              className="ml-4 bg-white border-red-200"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat text-xl">
            Catálogo de Matérias-Primas
          </CardTitle>
          <CardDescription className="font-josefin">
            Lista de materiais cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto font-montserrat">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-120px">Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Quantidade em Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
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
                ) : !materials ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-gray-500"
                    >
                      Nenhuma matéria-prima encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-blue-600">
                        {item.code}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <span
                          className={
                            item.stockQuantity <= 5
                              ? "text-red-600 font-bold"
                              : ""
                          }
                        >
                          {item.stockQuantity} unidades
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <DialogEditRawMaterial
                            id={item.id}
                            onUpdated={fetchMaterials}
                          />
                          <DialogDeleteRawMaterial
                            id={item.id}
                            name={item.name}
                            setMaterials={setMaterials}
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
