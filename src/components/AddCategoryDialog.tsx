
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

interface AddCategoryDialogProps {
  onAddCategory: (categoryName: string) => void;
}

// Input validation for category names
const validateCategoryName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Category name is required' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length === 0) {
    return { isValid: false, error: 'Category name cannot be empty' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Category name must be 50 characters or less' };
  }

  // Check for potentially dangerous characters
  if (/<script|javascript:|data:/i.test(trimmedName)) {
    return { isValid: false, error: 'Category name contains invalid characters' };
  }

  return { isValid: true };
};

// Sanitize category name
const sanitizeCategoryName = (name: string): string => {
  return name.trim().replace(/[<>]/g, '');
};

const AddCategoryDialog = ({ onAddCategory }: AddCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCategoryName(value);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateCategoryName(categoryName);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid category name');
      return;
    }

    const sanitizedName = sanitizeCategoryName(categoryName);
    
    try {
      onAddCategory(sanitizedName);
      setCategoryName("");
      setError(null);
      setOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    }
  };

  const handleCancel = () => {
    setCategoryName("");
    setError(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new vehicle category for your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                Name
              </Label>
              <div className="col-span-3">
                <Input
                  id="categoryName"
                  value={categoryName}
                  onChange={handleInputChange}
                  placeholder="e.g., Motorcycles, Vans"
                  maxLength={50}
                  required
                  aria-describedby={error ? "category-error" : undefined}
                />
                {error && (
                  <p id="category-error" className="text-sm text-red-600 mt-1">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!categoryName.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
