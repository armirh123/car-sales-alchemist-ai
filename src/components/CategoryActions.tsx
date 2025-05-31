
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CategoryActionsProps {
  categoryType: string;
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

const CategoryActions = ({ categoryType, onEdit, onDelete }: CategoryActionsProps) => {
  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(categoryType);
        }}
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(categoryType);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default CategoryActions;
