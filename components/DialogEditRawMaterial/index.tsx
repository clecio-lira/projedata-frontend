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
        console.error(error);
        toast.error("Erro ao carregar os dados da matéria-prima");
      }
    };

    fetchMaterial();
  }, [id, isDialogOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code) return toast.error("Preencha o código");
    if (!formData.name) return toast.error("Preencha o nome");

    try {
      await UpdateRawMaterial(id, formData);
      setIsDialogOpen(false);
      toast.success("Matéria-prima atualizada com sucesso");
      onUpdated();
    } catch (error) {
      console.error(error);
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
      <DialogContent className="max-w-md font-montserrat">
        <DialogHeader>
          <DialogTitle>Editar Matéria-Prima</DialogTitle>
          <DialogDescription className="font-josefin">
            Atualize o código, nome ou saldo em estoque do insumo.
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
            <Label htmlFor="stockQuantity">Quantidade em Estoque</Label>
            <Input
              id="stockQuantity"
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
