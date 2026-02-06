"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IProductRequest } from "@/interfaces/Product";
import { InsertProduct } from "@/services/Product";
import { IRawMaterialResponse } from "@/interfaces/RawMaterial";
import { FindAllRawMaterials } from "@/services/RawMaterial";

export default function DialogCreateProduct({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rawMaterialsList, setRawMaterialsList] = useState<
    IRawMaterialResponse[]
  >([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

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

  useEffect(() => {
    if (isDialogOpen) {
      const loadData = async () => {
        setLoadingMaterials(true);
        try {
          const data = await FindAllRawMaterials();
          setRawMaterialsList(data);
        } catch (error) {
          toast.error("Erro ao carregar lista de matérias-primas");
        } finally {
          setLoadingMaterials(false);
        }
      };
      loadData();
    }
  }, [isDialogOpen]);

  const addRawMaterialRow = () => {
    setFormData({
      ...formData,
      rawMaterials: [
        ...formData.rawMaterials,
        { rawMaterialId: 0, quantityNeeded: 1 },
      ],
    });
  };

  const updateRawMaterialRow = (
    index: number,
    field: string,
    value: number,
  ) => {
    const newRows = [...formData.rawMaterials];
    newRows[index] = { ...newRows[index], [field]: value };
    setFormData({ ...formData, rawMaterials: newRows });
  };

  const removeRawMaterialRow = (index: number) => {
    setFormData({
      ...formData,
      rawMaterials: formData.rawMaterials.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code) return toast.error("Preencha o código do produto");
    if (!formData.name) return toast.error("Preencha o nome do produto");
    if (formData.price <= 0)
      return toast.error("O preço deve ser maior que zero");
    if (formData.rawMaterials.some((rm) => rm.rawMaterialId === 0)) {
      return toast.error("Selecione um insumo para cada linha adicionada");
    }

    try {
      await InsertProduct(formData);

      resetForm();
      setIsDialogOpen(false);
      toast.success("Produto criado com sucesso");
      onCreated();
    } catch (error) {
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

          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <Label>Composição (Receita)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRawMaterialRow}
                className="text-olive-700 border-olive-200 hover:bg-olive-50"
              >
                + Adicionar Matéria Prima
              </Button>
            </div>

            <div className="space-y-3">
              {formData.rawMaterials.map((item, index) => (
                <div
                  key={index}
                  className="flex items-end gap-3 p-3 rounded-sm border"
                >
                  <div className="flex-1">
                    <Label className="text-[10px] uppercase font-bold">
                      Matéria Prima
                    </Label>
                    <Select
                      value={
                        item.rawMaterialId === 0
                          ? ""
                          : item.rawMaterialId.toString()
                      }
                      onValueChange={(val) =>
                        updateRawMaterialRow(
                          index,
                          "rawMaterialId",
                          Number(val),
                        )
                      }
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecione o material..." />
                      </SelectTrigger>
                      <SelectContent>
                        {loadingMaterials ? (
                          <div className="p-2 flex items-center justify-center">
                            <Loader2 className="animate-spin h-4 w-4" />
                          </div>
                        ) : (
                          rawMaterialsList.map((rm) => (
                            <SelectItem key={rm.id} value={rm.id.toString()}>
                              {rm.name}{" "}
                              <span className="text-gray-400 text-xs ml-2">
                                ({rm.code})
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32">
                    <Label className="text-[10px]">Qtd. Necessária</Label>
                    <Input
                      type="number"
                      min="1"
                      className="bg-white"
                      value={item.quantityNeeded}
                      onChange={(e) =>
                        updateRawMaterialRow(
                          index,
                          "quantityNeeded",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeRawMaterialRow(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {formData.rawMaterials.length === 0 && (
                <p className="text-center text-sm text-slate-400 py-4 italic">
                  Nenhum insumo adicionado ainda.
                </p>
              )}
            </div>
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
