
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface CategoryActionsProps {
  categoryType: string;
  onEdit: (category: string) => void;
  onDelete: (category: string) => void;
}

// Input validation for category type
const validateCategoryType = (categoryType: string): boolean => {
  return typeof categoryType === 'string' && categoryType.trim().length > 0;
};

const CategoryActions = ({ categoryType, onEdit, onDelete }: CategoryActionsProps) => {
  // Validate input parameters
  if (!validateCategoryType(categoryType)) {
    console.error('Invalid category type provided');
    return null;
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      onEdit(categoryType);
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Confirm deletion for security
    if (window.confirm(`Are you sure you want to delete the "${categoryType}" category?`)) {
      try {
        onDelete(categoryType);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
        onClick={handleEdit}
        aria-label={`Edit ${categoryType} category`}
      >
        <Edit className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
        onClick={handleDelete}
        aria-label={`Delete ${categoryType} category`}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default CategoryActions;
