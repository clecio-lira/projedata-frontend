"use client";

import { Edit } from "lucide-react";
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
import { IRawMaterialRequest } from "@/interfaces/RawMaterial";
import { FindByIdRawMaterial, UpdateRawMaterial } from "@/services/RawMaterial";

interface DialogEditRawMaterialProps {
  id: number;
  onUpdated: () => void;
}

export default function DialogEditRawMaterial({
  id,
  onUpdated,
}: DialogEditRawMaterialProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<IRawMaterialRequest>({
    code: "",
    name: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    if (!isDialogOpen || !id) return;

    const fetchMaterial = async () => {
      try {
        const res = await FindByIdRawMaterial(id);
        if (res) {
          setFormData({
            code: res.code || "",
            name: res.name || "",
            stockQuantity: res.stockQuantity || 0,
          });
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados da matéria-prima");
      }
    };

    fetchMaterial();
  }, [id, isDialogOpen]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.code) return toast.error("Preencha o código");
    if (!formData.name) return toast.error("Preencha o nome");

    try {
      await UpdateRawMaterial(id, formData);
      setIsDialogOpen(false);
      toast.success("Matéria-prima atualizada com sucesso");
      onUpdated();
    } catch (error) {
      if (error instanceof Error && error.message.includes("409")) {
        toast.error("Já existe uma matéria-prima com este código");
        return;
      }
      toast.error("Erro ao atualizar a matéria-prima");
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
          <DialogTitle>Editar Matéria-Prima</DialogTitle>
          <DialogDescription className="font-josefin">
            Altere as informações básicas da matéria-prima abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="name">Nome da Matéria-Prima *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Quantidade em Estoque</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stockQuantity: Number(e.target.value),
                })
              }
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
      </DialogContent>
    </Dialog>
  );
}
