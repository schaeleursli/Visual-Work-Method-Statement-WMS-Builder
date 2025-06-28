import React, { useState } from 'react';
import { PlusIcon, XIcon, PackageIcon } from 'lucide-react';
interface CargoItem {
  id: string;
  description: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  weightUnit: 'tonnes' | 'kg';
}
export const HeaderForm: React.FC = () => {
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([{
    id: '1',
    description: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    weightUnit: 'tonnes'
  }]);
  const addCargoItem = () => {
    const newItem: CargoItem = {
      id: Date.now().toString(),
      description: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      weightUnit: 'tonnes'
    };
    setCargoItems([...cargoItems, newItem]);
  };
  const removeCargoItem = (id: string) => {
    if (cargoItems.length > 1) {
      setCargoItems(cargoItems.filter(item => item.id !== id));
    }
  };
  const updateCargoItem = (id: string, field: keyof CargoItem, value: string) => {
    setCargoItems(cargoItems.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  };
  return <div className="p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">
        Project Information
      </h3>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter project name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter project location" />
        </div>
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Cargo Items
            </label>
            <button type="button" onClick={addCargoItem} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
              <PlusIcon size={16} className="mr-1" />
              Add Cargo
            </button>
          </div>
          {cargoItems.map((item, index) => <div key={item.id} className="mb-4 border border-gray-200 rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <PackageIcon size={18} className="text-gray-500 mr-2" />
                  <h4 className="font-medium text-gray-700">
                    Cargo {index + 1}
                  </h4>
                </div>
                {cargoItems.length > 1 && <button type="button" onClick={() => removeCargoItem(item.id)} className="text-gray-400 hover:text-red-500">
                    <XIcon size={18} />
                  </button>}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea value={item.description} onChange={e => updateCargoItem(item.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Describe cargo type and contents" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dimensions (L × W × H)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" value={item.length} onChange={e => updateCargoItem(item.id, 'length', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Length (m)" />
                    <input type="text" value={item.width} onChange={e => updateCargoItem(item.id, 'width', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Width (m)" />
                    <input type="text" value={item.height} onChange={e => updateCargoItem(item.id, 'height', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Height (m)" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <div className="flex">
                    <input type="text" value={item.weight} onChange={e => updateCargoItem(item.id, 'weight', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter cargo weight" />
                    <select value={item.weightUnit} onChange={e => updateCargoItem(item.id, 'weightUnit', e.target.value)} className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 focus:outline-none">
                      <option value="tonnes">tonnes</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>)}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Execution Window
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>
    </div>;
};