import React, { useState } from 'react';
import { SmartStepBlock } from './SmartStepBlock';
import { PlusIcon, ArrowRightIcon } from 'lucide-react';
interface Risk {
  id: string;
  description: string;
  severity: number;
  likelihood: number;
  score: number;
  mitigation: string;
  mitigationType: 'Engineering' | 'Operational' | 'Routing' | 'Communication';
  residualLikelihood: number;
  residualScore: number;
  isCustom?: boolean;
}
interface Step {
  id: number;
  title: string;
  description?: string;
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
  risks?: Risk[];
  photos?: {
    id: string;
    url: string;
    caption: string;
  }[];
  comments?: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
}
interface SmartStepChainProps {
  steps: Step[];
  onUpdateStep: (step: Step) => void;
  onAddStep: () => void;
  onRemoveStep?: (stepId: number) => void;
}
export const SmartStepChain: React.FC<SmartStepChainProps> = ({
  steps,
  onUpdateStep,
  onAddStep,
  onRemoveStep
}) => {
  const [expandedSteps, setExpandedSteps] = useState<number[]>([steps[0]?.id || 0]);
  const [editingSteps, setEditingSteps] = useState<number[]>([]);
  const toggleExpandStep = (stepId: number) => {
    setExpandedSteps(prev => prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]);
  };
  const toggleEditStep = (stepId: number) => {
    setEditingSteps(prev => prev.includes(stepId) ? prev.filter(id => id !== stepId) : [...prev, stepId]);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Work Method Statement Workflow
        </h3>
        <button onClick={onAddStep} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
          <PlusIcon size={16} />
          <span>Add Step</span>
        </button>
      </div>
      {/* Step Timeline */}
      <div className="relative mb-8 pl-8 border-l-2 border-gray-200">
        {steps.map((step, index) => <div key={step.id} className="mb-6 relative">
            {/* Timeline connector */}
            <div className="absolute -left-10 top-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {index + 1}
            </div>
            {/* Step block */}
            <SmartStepBlock step={step} index={index} isExpanded={expandedSteps.includes(step.id)} onToggleExpand={() => toggleExpandStep(step.id)} onUpdateStep={onUpdateStep} onRemoveStep={onRemoveStep ? () => onRemoveStep(step.id) : undefined} isEditing={editingSteps.includes(step.id)} onToggleEdit={() => toggleEditStep(step.id)} />
            {/* Arrow to next step */}
            {index < steps.length - 1 && <div className="flex justify-center my-2">
                <ArrowRightIcon size={20} className="text-gray-400 transform rotate-90" />
              </div>}
          </div>)}
        {/* Add step button at the end of timeline */}
        <div className="absolute -left-10 bottom-0 w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-blue-100 hover:text-blue-600" onClick={onAddStep}>
          <PlusIcon size={14} />
        </div>
      </div>
      {/* Add step card at bottom */}
      <div className="flex-shrink-0 border border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center p-6 cursor-pointer hover:bg-gray-100" onClick={onAddStep}>
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <PlusIcon size={20} className="text-gray-600" />
          </div>
          <p className="text-gray-600">Add Next Step in Workflow</p>
        </div>
      </div>
    </div>;
};