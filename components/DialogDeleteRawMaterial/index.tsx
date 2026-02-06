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
  onDeleted: () => void;
}

export default function DialogDeleteRawMaterial({
  id,
  name,
  onDeleted,
}: DialogDeleteRawMaterialProps) {
  const handleDelete = async (materialId: number) => {
    try {
      await DeleteRawMaterial(materialId);

      toast.success("Matéria-prima excluída com sucesso!");
      onDeleted();
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Erro ao excluir matéria-prima";
      toast.error(errorMessage);
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
      <AlertDialogContent className="font-montserrat">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Matéria-Prima</AlertDialogTitle>
          <AlertDialogDescription className="font-josefin">
            Tem certeza de que deseja excluir o insumo{" "}
            <strong className="text-red-600 font-bold">{name}</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita e pode afetar produtos que dependem
            deste material.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer font-josefin">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700 font-semibold"
            onClick={() => handleDelete(id)}
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
