"use client";

import { Plus, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { toast } from "sonner";
import { IProductRequest } from "@/interfaces/Product";

export default function DialogCreateProduct({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Estado inicial baseado no ProductRequestDTO
  const [formData, setFormData] = useState<IProductRequest>({
    code: "",
    name: "",
    price: 0,
    rawMaterials: [],
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      price: 0,
      rawMaterials: [],
    });
  };

  const addRawMaterial = () => {
    setFormData({
      ...formData,
      rawMaterials: [
        ...formData.rawMaterials,
        { rawMaterialId: 0, quantityNeeded: 1 },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code) return toast.error("Preencha o código do produto");
    if (!formData.name) return toast.error("Preencha o nome do produto");
    if (formData.price <= 0)
      return toast.error("O preço deve ser maior que zero");

    try {
      // Substitua pelo seu método real de API (ex: productService.create)
      // await api.post('/products', formData);

      console.log("Enviando dados:", formData);

      resetForm();
      setIsDialogOpen(false);
      toast.success("Produto criado com sucesso");
      onCreated();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar produto");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={resetForm}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 shadow-lg cursor-pointer"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Produto</DialogTitle>
          <DialogDescription>
            Cadastre um produto e suas necessidades de matéria-prima.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base">Matérias-Primas</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRawMaterial}
              >
                + Adicionar Item
              </Button>
            </div>

            {formData.rawMaterials.map((item, index) => (
              <div key={index} className="flex gap-4 mb-2 items-end">
                <div className="flex-1">
                  <Label className="text-xs">ID Matéria-Prima</Label>
                  <Input
                    type="number"
                    value={item.rawMaterialId}
                    onChange={(e) => {
                      const newMaterials = [...formData.rawMaterials];
                      newMaterials[index].rawMaterialId = Number(
                        e.target.value,
                      );
                      setFormData({ ...formData, rawMaterials: newMaterials });
                    }}
                  />
                </div>
                <div className="w-32">
                  <Label className="text-xs">Qtd Necessária</Label>
                  <Input
                    type="number"
                    value={item.quantityNeeded}
                    onChange={(e) => {
                      const newMaterials = [...formData.rawMaterials];
                      newMaterials[index].quantityNeeded = Number(
                        e.target.value,
                      );
                      setFormData({ ...formData, rawMaterials: newMaterials });
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500"
                  onClick={() => {
                    const newMaterials = formData.rawMaterials.filter(
                      (_, i) => i !== index,
                    );
                    setFormData({ ...formData, rawMaterials: newMaterials });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Criar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
