"use client";

import { Plus } from "lucide-react";
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
import { IRawMaterialRequest } from "@/interfaces/RawMaterial";
import { InsertRawMaterial } from "@/services/RawMaterial";

export default function DialogCreateRawMaterial({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<IRawMaterialRequest>({
    code: "",
    name: "",
    stockQuantity: 0,
  });

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      stockQuantity: 0,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!formData.code)
      return toast.error("Preencha o código da matéria-prima");
    if (!formData.name) return toast.error("Preencha o nome da matéria-prima");
    if (formData.stockQuantity < 0)
      return toast.error("A quantidade em estoque não pode ser menor que zero");

    try {
      await InsertRawMaterial(formData);

      resetForm();
      setIsDialogOpen(false);
      toast.success("Matéria-prima criada com sucesso!");
      onCreated();
    } catch (error) {
      if (error instanceof Error && error.message.includes("409")) {
        toast.error("Já existe uma matéria-prima com este código");
        return;
      }
      toast.error("Erro ao criar matéria-prima");
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
          Criar Matéria-Prima
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Matéria-Prima</DialogTitle>
          <DialogDescription className="font-josefin">
            Cadastre as matérias-primas que serão utilizadas na sua produção.
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
              placeholder="Ex: MP-LEITE-01"
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
              placeholder="Ex: Leite Integral"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Quantidade Inicial em Estoque</Label>
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
              placeholder="0"
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
              className="bg-green-700 hover:bg-green-800 text-white cursor-pointer"
            >
              Criar Matéria-Prima
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
