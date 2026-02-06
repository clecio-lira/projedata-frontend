"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  PackageX,
  TrendingUp,
} from "lucide-react";
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
import { GetSuggestions } from "@/services/Production";
import { IProductionReport } from "@/interfaces/Production";

export default function ProductionReport() {
  const [data, setData] = useState<IProductionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProduction = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await GetSuggestions();

      setData(res);
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error("Não foi possível carregar o relatório de produção.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProduction();
  }, [fetchProduction]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Relatório de Produção
          </h1>
          <p className="text-gray-600 font-josefin">
            Acompanhe o status dos itens processados e pendências de
            matéria-prima.
          </p>
        </div>
        <Button
          onClick={fetchProduction}
          variant="outline"
          className="cursor-pointer"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Atualizar Dados
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Valor Total Produzido
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                formatCurrency(data?.totalProductionValue || 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {!loading && data?.notProduced && data.notProduced.length > 0 && (
        <Alert
          variant="destructive"
          className="bg-amber-50 border-amber-200 text-amber-900"
        >
          <PackageX className="h-5 w-5 text-amber-600" />
          <AlertTitle className="font-bold">
            Atenção: Itens não produzidos
          </AlertTitle>
          <AlertDescription>
            {data.notProduced.map((item, idx) => (
              <p key={idx}>
                • <strong>{item.productName}</strong>:{" "}
                {item.reason.includes(":") ? (
                  <>
                    matéria-prima insuficiente:{" "}
                    <span className="font-medium text-amber-600">
                      {item.reason.split(":")[1]?.trim()}
                    </span>
                  </>
                ) : (
                  <span className="text-red-500 italic">
                    Este produto não possui matérias-primas vinculadas.
                  </span>
                )}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de sistema</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            Falha ao processar dados de produção.
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProduction}
              className="ml-4 bg-white border-red-200 cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <CheckCircle2 className="text-green-600" /> Itens Produzidos
          </CardTitle>
          <CardDescription className="font-josefin">
            Produtos finalizados com sucesso na última operação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Qtd.</TableHead>
                  <TableHead>Unitário</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-12" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data?.produced.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      Nenhuma produção registrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.produced.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell className="text-gray-500">
                        #{item.productId}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.productName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-bold text-green-700">
                        {formatCurrency(item.totalValue)}
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
