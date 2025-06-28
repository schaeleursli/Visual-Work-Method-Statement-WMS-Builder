import React, { useEffect, useState } from 'react';
import { PlusIcon, XIcon, FileIcon } from 'lucide-react';
interface Step {
  id: number;
  title: string;
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
}
interface StepCardProps {
  step: Step;
  isEditing: boolean;
  onUpdate: (step: Step) => void;
}
export const StepCard: React.FC<StepCardProps> = ({
  step,
  isEditing,
  onUpdate
}) => {
  const [formData, setFormData] = useState<Step>({
    ...step
  });
  // Update formData when step prop changes
  useEffect(() => {
    setFormData({
      ...step
    });
  }, [step]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleAddEquipment = () => {
    setFormData({
      ...formData,
      additionalEquipment: [...formData.additionalEquipment, '']
    });
  };
  const handleEquipmentChange = (index: number, value: string) => {
    const newEquipment = [...formData.additionalEquipment];
    newEquipment[index] = value;
    setFormData({
      ...formData,
      additionalEquipment: newEquipment
    });
  };
  const handleRemoveEquipment = (index: number) => {
    const newEquipment = [...formData.additionalEquipment];
    newEquipment.splice(index, 1);
    setFormData({
      ...formData,
      additionalEquipment: newEquipment
    });
  };
  const handleSave = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Step title is required');
      return;
    }
    // Make a clean copy of the data to avoid reference issues
    const updatedStep = {
      ...formData,
      title: formData.title.trim(),
      equipment: formData.equipment.trim(),
      additionalEquipment: formData.additionalEquipment.filter(item => item.trim() !== '')
    };
    // Call the onUpdate prop with the updated step data
    onUpdate(updatedStep);
    // Log for debugging
    console.log('Saving step:', updatedStep);
  };
  // Mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newAttachments = [...formData.attachments];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        newAttachments.push({
          name: file.name,
          type: file.type,
          size: file.size
        });
      }
      const updatedFormData = {
        ...formData,
        attachments: newAttachments
      };
      setFormData(updatedFormData);
      onUpdate(updatedFormData);
    }
  };
  return <div className="border border-gray-200 rounded-md">
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
        <h3 className="font-medium text-gray-800">
          {isEditing ? 'Edit Step' : 'Step Details'}
        </h3>
      </div>
      <div className="p-4">
        {isEditing ? <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Step Title
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Equipment
              </label>
              <input type="text" name="equipment" value={formData.equipment} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Barge ABC-21, Crane LTM 11200" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Equipment
                </label>
                <button type="button" onClick={handleAddEquipment} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <PlusIcon size={14} className="mr-1" />
                  Add Item
                </button>
              </div>
              {formData.additionalEquipment.map((item, index) => <div key={index} className="flex items-center space-x-2 mb-2">
                  <input type="text" value={item} onChange={e => handleEquipmentChange(index, e.target.value)} className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Rigging: 4-leg chain sling (8t)" />
                  <button type="button" onClick={() => handleRemoveEquipment(index)} className="text-gray-500 hover:text-red-600">
                    <XIcon size={18} />
                  </button>
                </div>)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachments
              </label>
              <div className="border border-dashed border-gray-300 rounded-md p-4 bg-gray-50">
                <div className="text-center">
                  <FileIcon size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload PDF documents for this step
                  </p>
                  <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    Select Files
                    <input type="file" className="hidden" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
              {formData.attachments.length > 0 && <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Files:
                  </p>
                  <ul className="space-y-1">
                    {formData.attachments.map((file, index) => <li key={index} className="text-sm flex items-center space-x-2 text-gray-600">
                        <FileIcon size={14} />
                        <span>{file.name}</span>
                      </li>)}
                  </ul>
                </div>}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div> : <div className="space-y-4">
            <div>
              <h4 className="text-lg font-medium text-gray-800 mb-1">
                {step.title}
              </h4>
              <p className="text-gray-600">
                Step {step.id} in the transport chain
              </p>
            </div>
            {step.equipment && <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">
                  Primary Equipment
                </h5>
                <p className="text-gray-800">{step.equipment}</p>
              </div>}
            {step.additionalEquipment.length > 0 && <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">
                  Additional Equipment
                </h5>
                <ul className="space-y-1">
                  {step.additionalEquipment.map((item, index) => <li key={index} className="text-gray-800">
                      {item}
                    </li>)}
                </ul>
              </div>}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">
                Attachments
              </h5>
              {step.attachments.length > 0 ? <ul className="space-y-1">
                  {step.attachments.map((file, index) => <li key={index} className="text-sm flex items-center space-x-2 text-gray-600">
                      <FileIcon size={14} />
                      <span>{file.name}</span>
                    </li>)}
                </ul> : <p className="text-gray-500 text-sm">No attachments added</p>}
            </div>
          </div>}
      </div>
    </div>;
};