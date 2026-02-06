"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
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
import {
  IProductRawMaterialRequest,
  IProductRequest,
} from "@/interfaces/Product";
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
  const [formData, setFormData] = useState<IProductRequest>({
    code: "",
    name: "",
    price: 0,
    rawMaterials: [],
  });

  useEffect(() => {
    if (!isDialogOpen || !id) return;

    const fetchProduct = async () => {
      try {
        const res = await FindByIdProduct(id);

        if (res) {
          setFormData({
            code: res.code || "",
            name: res.name || "",
            price: res.price || 0,
            rawMaterials: Array.isArray(res.rawMaterials)
              ? res.rawMaterials.map((rm: any) => ({
                  rawMaterialId: rm.rawMaterialId || 0,
                  quantityNeeded: rm.quantityNeeded || 0,
                }))
              : [],
          });
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados do produto");
      }
    };

    fetchProduct();
  }, [id, isDialogOpen]);

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

    if (!formData.code) return toast.error("Preencha o código");
    if (!formData.name) return toast.error("Preencha o nome");
    if (formData.price <= 0)
      return toast.error("O preço deve ser maior que zero");

    try {
      await UpdateProduct(id, formData);
      setIsDialogOpen(false);
      toast.success("Produto atualizado com sucesso");
      onUpdated();
    } catch (error) {
      console.error(error);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-montserrat">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Atualize as informações do produto e suas matérias-primas.
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-base font-semibold">
                Composição de Matérias-Primas
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRawMaterial}
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Matéria
              </Button>
            </div>

            {formData.rawMaterials.map(
              (item: IProductRawMaterialRequest, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 mb-3 items-end bg-slate-50 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <Label className="text-xs">ID da Matéria-Prima</Label>
                    <Input
                      type="number"
                      value={item.rawMaterialId}
                      onChange={(e) => {
                        const newMaterials = [...formData.rawMaterials];
                        newMaterials[index].rawMaterialId = Number(
                          e.target.value,
                        );
                        setFormData({
                          ...formData,
                          rawMaterials: newMaterials,
                        });
                      }}
                    />
                  </div>
                  <div className="w-32">
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      value={item.quantityNeeded}
                      onChange={(e) => {
                        const newMaterials = [...formData.rawMaterials];
                        newMaterials[index].quantityNeeded = Number(
                          e.target.value,
                        );
                        setFormData({
                          ...formData,
                          rawMaterials: newMaterials,
                        });
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50"
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
              ),
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="font-josefin text-gray-500 cursor-pointer"
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
      </DialogContent>
    </Dialog>
  );
}
