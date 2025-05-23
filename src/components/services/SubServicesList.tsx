
import React from 'react';
import { Layers, Pencil, Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { SubService } from '@/types/services';

interface SubServicesListProps {
  subServices: SubService[];
  onEdit: (subService: SubService) => void;
  onStatusChange: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
}

const SubServicesList: React.FC<SubServicesListProps> = ({ 
  subServices, 
  onEdit, 
  onStatusChange,
  onDelete,
  searchTerm 
}) => {
  const filteredSubServices = subServices.filter(subService => 
    subService.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {filteredSubServices.length > 0 ? (
        filteredSubServices.map(subService => (
          <div key={subService.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Layers className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="font-medium text-gray-900">{subService.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <Switch 
                checked={subService.active} 
                onCheckedChange={(checked) => onStatusChange(subService.id, checked)} 
                className="data-[state=checked]:bg-green-500"
              />
              <button 
                onClick={() => onEdit(subService)}
                className="text-gray-500 hover:text-blue-500 transition-colors"
                aria-label="Edit sub-service"
              >
                <Pencil className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onDelete(subService.id)} 
                className="text-gray-500 hover:text-red-500 transition-colors"
                aria-label="Delete sub-service"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-600">
            {searchTerm 
              ? "No sub-services found. Try adjusting your search." 
              : "No sub-services found. Add a sub-service to get started."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubServicesList;
