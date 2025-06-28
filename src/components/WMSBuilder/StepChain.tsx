import React, { useState, Fragment } from 'react';
import { StepCard } from './StepCard';
import { PlusIcon, ChevronRightIcon, ArrowRightIcon, MoveIcon } from 'lucide-react';
interface Step {
  id: number;
  title: string;
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
  risks: string[];
}
interface StepChainProps {
  steps: Step[];
  selectedStep: number | null;
  onSelectStep: (id: number | null) => void;
  onAddStep: () => void;
  onUpdateStep: (step: Step) => void;
}
export const StepChain: React.FC<StepChainProps> = ({
  steps,
  selectedStep,
  onSelectStep,
  onAddStep,
  onUpdateStep
}) => {
  const [editMode, setEditMode] = useState<number | null>(null);
  const [draggedStep, setDraggedStep] = useState<number | null>(null);
  const handleDragStart = (stepId: number) => {
    setDraggedStep(stepId);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (targetStepId: number) => {
    if (draggedStep === null || draggedStep === targetStepId) {
      setDraggedStep(null);
      return;
    }
    // Reorder the steps
    const draggedStepIndex = steps.findIndex(step => step.id === draggedStep);
    const targetStepIndex = steps.findIndex(step => step.id === targetStepId);
    const newSteps = [...steps];
    const [removed] = newSteps.splice(draggedStepIndex, 1);
    newSteps.splice(targetStepIndex, 0, removed);
    // Update the steps
    // In a real app, you would need to update the step IDs to maintain the sequence
    setDraggedStep(null);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Transport Chain Steps
        </h3>
        <button onClick={onAddStep} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
          <PlusIcon size={16} />
          <span>Add Step</span>
        </button>
      </div>
      {/* Visual step chain */}
      <div className="flex items-start space-x-4 overflow-x-auto pb-4 mb-6">
        {steps.map((step, index) => <Fragment key={step.id}>
            <div className={`flex-shrink-0 w-64 border rounded-md ${selectedStep === step.id ? 'border-blue-500 ring-2 ring-blue-100' : draggedStep === step.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`} onClick={() => onSelectStep(step.id)} draggable onDragStart={() => handleDragStart(step.id)} onDragOver={handleDragOver} onDrop={() => handleDrop(step.id)}>
              <div className={`p-3 border-b ${selectedStep === step.id ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="text-gray-400 hover:text-gray-600 p-1" title="Drag to reorder">
                      <MoveIcon size={14} />
                    </button>
                    {editMode === step.id ? <button className="text-blue-600 text-sm font-medium" onClick={e => {
                  e.stopPropagation();
                  setEditMode(null);
                }}>
                        Done
                      </button> : <button className="text-gray-500 hover:text-blue-600 text-sm" onClick={e => {
                  e.stopPropagation();
                  setEditMode(step.id);
                  onSelectStep(step.id);
                }}>
                        Edit
                      </button>}
                  </div>
                </div>
              </div>
              <div className="p-3">
                {step.equipment && <div className="text-sm mb-2">
                    <span className="font-medium text-gray-700">
                      Equipment:
                    </span>{' '}
                    {step.equipment}
                  </div>}
                {step.additionalEquipment.length > 0 && <div className="text-sm mb-2">
                    <span className="font-medium text-gray-700">
                      Additional:
                    </span>
                    <ul className="mt-1 text-gray-600">
                      {step.additionalEquipment.map((item, i) => <li key={i} className="flex items-start">
                          <ChevronRightIcon size={14} className="mr-1 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>)}
                    </ul>
                  </div>}
                {step.attachments && step.attachments.length > 0 && <div className="text-sm">
                    <span className="font-medium text-gray-700">
                      Attachments:
                    </span>{' '}
                    {step.attachments.length} files
                  </div>}
                {step.risks && step.risks.length > 0 && <div className="text-sm mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Risks:</span>
                      <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                        {step.risks.length}
                      </span>
                    </div>
                  </div>}
              </div>
            </div>
            {index < steps.length - 1 && <div className="flex items-center justify-center h-full pt-10">
                <ArrowRightIcon size={20} className="text-gray-400" />
              </div>}
          </Fragment>)}
        <div className="flex-shrink-0 w-64 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-6 cursor-pointer hover:bg-gray-100" onClick={onAddStep}>
          <div className="text-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <PlusIcon size={18} className="text-gray-600" />
            </div>
            <p className="text-gray-600 text-sm">Add Next Step</p>
          </div>
        </div>
      </div>
      {/* Selected step details */}
      {selectedStep && <StepCard step={steps.find(s => s.id === selectedStep)!} isEditing={editMode === selectedStep} onUpdate={onUpdateStep} />}
    </div>;
};