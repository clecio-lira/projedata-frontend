"use client";

import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { IRawMaterialResponse } from "@/interfaces/RawMaterial";
import { DeleteRawMaterial } from "@/services/RawMaterial";

interface DialogDeleteRawMaterialProps {
  id: number;
  name: string;
  setMaterials: React.Dispatch<React.SetStateAction<IRawMaterialResponse[]>>;
}

export default function DialogDeleteRawMaterial({
  id,
  name,
  setMaterials,
}: DialogDeleteRawMaterialProps) {
  const handleDelete = async (materialId: number) => {
    try {
      await DeleteRawMaterial(materialId);

      setMaterials((prev) => prev.filter((p) => p.id !== materialId));

      toast.success("Matéria-prima excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir matéria-prima");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Matéria-Prima</AlertDialogTitle>
          <AlertDialogDescription className="font-josefin">
            Tem certeza de que deseja excluir a matéria-prima{" "}
            <strong className="text-red-600">{name}</strong>? Esta ação não pode
            ser desfeita e pode afetar produtos que dependem deste material.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer font-josefin">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => handleDelete(id)}
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
