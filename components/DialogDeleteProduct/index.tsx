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
import { IProductResponse } from "@/interfaces/Product";
import { DeleteProduct } from "@/services/Product";

interface DialogDeleteProductProps {
  id: number;
  name: string;
  setProducts: React.Dispatch<React.SetStateAction<IProductResponse[]>>;
}

export default function DialogDeleteProduct({
  id,
  name,
  setProducts,
}: DialogDeleteProductProps) {
  const handleDelete = async (productId: number) => {
    try {
      await DeleteProduct(productId);

      setProducts((prev) => prev.filter((p) => p.id !== productId));

      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="ml-2 cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="font-montserrat">
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Produto</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza de que deseja excluir o produto{" "}
            <strong className="text-foreground font-bold">{name}</strong>? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
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
