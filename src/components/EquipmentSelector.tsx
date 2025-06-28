import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, CheckIcon, PlusIcon } from 'lucide-react';
import { Equipment, EquipmentLibrary } from './EquipmentLibrary/EquipmentLibrary';
// Mock equipment data
const mockEquipment = [{
  id: 1,
  name: 'Barge ABC-21',
  category: 'vessel',
  capacity: '500t',
  dimensions: '50m × 15m'
}, {
  id: 2,
  name: 'Crane LTM 11200',
  category: 'crane',
  capacity: '200t',
  dimensions: 'Boom: 100m'
}, {
  id: 3,
  name: '4-leg chain sling (8t)',
  category: 'rigging',
  capacity: '8t',
  dimensions: 'Length: 6m'
}, {
  id: 4,
  name: 'SPMT Scheuerle 4x6',
  category: 'trailer',
  capacity: '240t',
  dimensions: '24 axle lines'
}, {
  id: 5,
  name: 'Nylon slings 12t',
  category: 'rigging',
  capacity: '12t',
  dimensions: 'Length: 8m'
}, {
  id: 6,
  name: 'Goldhofer 2+4',
  category: 'trailer',
  capacity: '120t',
  dimensions: '6 axle lines'
}, {
  id: 7,
  name: 'Custom lifting beam',
  category: 'rigging',
  capacity: '150t',
  dimensions: 'Length: 12m'
}, {
  id: 8,
  name: 'Lashing chains 10mm',
  category: 'lashing',
  capacity: '10t',
  dimensions: 'Length: 8m'
}, {
  id: 9,
  name: 'Crawler 600t',
  category: 'crane',
  capacity: '600t',
  dimensions: 'Boom: 120m'
}];
interface EquipmentSelectorProps {
  onSelectEquipment: (equipment: string) => void;
}
export const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  onSelectEquipment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const categories = ['vessel', 'crane', 'rigging', 'trailer', 'lashing'];
  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  // Handle equipment selection from the library
  const handleEquipmentFromLibrary = (equipment: Equipment) => {
    onSelectEquipment(equipment.name);
    setShowLibrary(false);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {showLibrary ? <EquipmentLibrary onSelectEquipment={handleEquipmentFromLibrary} /> : <>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Equipment Selector
              </h3>
              <button onClick={() => setShowLibrary(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
                <PlusIcon size={16} />
                <span>Open Equipment Library</span>
              </button>
            </div>
            <div className="flex space-x-4 mb-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={18} className="text-gray-400" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search equipment..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="relative">
                <select className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedCategory || ''} onChange={e => setSelectedCategory(e.target.value || null)}>
                  <option value="">All Categories</option>
                  {categories.map(category => <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FilterIcon size={18} className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 rounded-md">
              <div className="flex bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="w-2/5 font-medium text-gray-700">Equipment</div>
                <div className="w-1/5 font-medium text-gray-700">Category</div>
                <div className="w-1/5 font-medium text-gray-700">Capacity</div>
                <div className="w-1/5 font-medium text-gray-700">
                  Dimensions
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {filteredEquipment.map(item => <div key={item.id} className="flex items-center px-6 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer" onClick={() => onSelectEquipment(item.name)}>
                    <div className="w-2/5 font-medium text-gray-800">
                      {item.name}
                    </div>
                    <div className="w-1/5 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${item.category === 'crane' ? 'bg-yellow-100 text-yellow-800' : item.category === 'vessel' ? 'bg-blue-100 text-blue-800' : item.category === 'rigging' ? 'bg-green-100 text-green-800' : item.category === 'trailer' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.category}
                      </span>
                    </div>
                    <div className="w-1/5 text-sm text-gray-600">
                      {item.capacity}
                    </div>
                    <div className="w-1/5 text-sm text-gray-600">
                      {item.dimensions}
                    </div>
                  </div>)}
                {filteredEquipment.length === 0 && <div className="p-6 text-center text-gray-500">
                    No equipment found matching your criteria
                  </div>}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {filteredEquipment.length} items found
            </span>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2" onClick={() => {
          if (filteredEquipment.length > 0) {
            onSelectEquipment(filteredEquipment[0].name);
          }
        }}>
              <CheckIcon size={18} />
              <span>Select Equipment</span>
            </button>
          </div>
        </>}
    </div>;
};