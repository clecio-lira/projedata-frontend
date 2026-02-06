"use client";

import { Edit, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IProductRequestUpdate } from "@/interfaces/Product";
import { FindByIdProduct, UpdateProduct } from "@/services/Product";

interface DialogEditProductProps {
  id: number;
  onUpdated: () => void;
}

export default function DialogEditProduct({
  id,
  onUpdated,
}: DialogEditProductProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<IProductRequestUpdate>({
    code: "",
    name: "",
    price: 0,
  });

  useEffect(() => {
    if (isDialogOpen && id) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await FindByIdProduct(id);
          if (res) {
            setFormData({
              code: res.code || "",
              name: res.name || "",
              price: res.price || 0,
            });
          }
        } catch (error) {
          toast.error("Erro ao carregar os dados do produto");
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isDialogOpen]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.code) return toast.error("Preencha o código do produto");
    if (!formData.name) return toast.error("Preencha o nome do produto");
    if (formData.price <= 0)
      return toast.error("O preço deve ser maior que zero");

    try {
      await UpdateProduct(id, formData as IProductRequestUpdate);

      setIsDialogOpen(false);
      toast.success("Produto atualizado com sucesso");
      onUpdated();
    } catch (error) {
      toast.error("Erro ao atualizar o produto");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="cursor-pointer border-blue-600 text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Altere as informações básicas do produto abaixo.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="Ex: PROD-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Cadeira Ergonômica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço de Venda (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
