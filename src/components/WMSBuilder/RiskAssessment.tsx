import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon, PlusIcon, XIcon, InfoIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
// Define risk types and interfaces
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
  equipment: string;
  additionalEquipment: string[];
  attachments: any[];
  risks?: Risk[];
}
interface RiskAssessmentProps {
  steps: Step[];
  onUpdateStep: (step: Step) => void;
}
// Common risks by step type
const commonRisks: {
  [key: string]: Partial<Risk>[];
} = {
  'Load on Barge': [{
    description: 'Equipment failure during loading',
    severity: 4,
    likelihood: 3,
    mitigation: 'Pre-use equipment inspection and certification',
    mitigationType: 'Operational',
    residualLikelihood: 1
  }, {
    description: 'Personnel falling from height',
    severity: 5,
    likelihood: 3,
    mitigation: 'Use of fall protection and safe access routes',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Load shifting during placement',
    severity: 4,
    likelihood: 3,
    mitigation: 'Controlled movement and tag lines',
    mitigationType: 'Operational',
    residualLikelihood: 2
  }],
  'Barge Transport': [{
    description: 'Adverse weather conditions',
    severity: 4,
    likelihood: 3,
    mitigation: 'Weather monitoring and voyage planning',
    mitigationType: 'Operational',
    residualLikelihood: 2
  }, {
    description: 'Cargo shift during transit',
    severity: 5,
    likelihood: 3,
    mitigation: 'Proper seafastening and regular checks',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Collision with other vessels',
    severity: 5,
    likelihood: 2,
    mitigation: 'Navigation protocols and communication',
    mitigationType: 'Communication',
    residualLikelihood: 1
  }],
  'Load to Trailer': [{
    description: 'Crane capacity exceeded',
    severity: 5,
    likelihood: 2,
    mitigation: 'Lift plan and crane selection verification',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Trailer structural failure',
    severity: 4,
    likelihood: 2,
    mitigation: 'Trailer capacity verification and inspection',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Improper load distribution',
    severity: 3,
    likelihood: 3,
    mitigation: 'Load plan verification before placement',
    mitigationType: 'Operational',
    residualLikelihood: 1
  }],
  'Road Convoy': [{
    description: 'Overhead obstruction collision',
    severity: 5,
    likelihood: 3,
    mitigation: 'Route survey and height monitoring',
    mitigationType: 'Routing',
    residualLikelihood: 1
  }, {
    description: 'Axle overload on road infrastructure',
    severity: 4,
    likelihood: 3,
    mitigation: 'Use of multi-axle trailer configuration',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Escort coordination failure',
    severity: 3,
    likelihood: 3,
    mitigation: 'Police escort and team briefing',
    mitigationType: 'Communication',
    residualLikelihood: 1
  }],
  'Crane Offload': [{
    description: 'Ground bearing pressure exceeded',
    severity: 4,
    likelihood: 3,
    mitigation: 'Ground survey and matting as required',
    mitigationType: 'Engineering',
    residualLikelihood: 1
  }, {
    description: 'Wind conditions affecting lift',
    severity: 4,
    likelihood: 3,
    mitigation: 'Wind monitoring and lift plan limits',
    mitigationType: 'Operational',
    residualLikelihood: 2
  }, {
    description: 'Personnel in drop zone',
    severity: 5,
    likelihood: 2,
    mitigation: 'Exclusion zone and spotter deployment',
    mitigationType: 'Operational',
    residualLikelihood: 1
  }],
  'New Step': [{
    description: 'Generic operational hazard',
    severity: 3,
    likelihood: 3,
    mitigation: 'Standard operating procedures',
    mitigationType: 'Operational',
    residualLikelihood: 2
  }]
};
export const RiskAssessment: React.FC<RiskAssessmentProps> = ({
  steps,
  onUpdateStep
}) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(steps[0]?.id || null);
  const [isAddingRisk, setIsAddingRisk] = useState<number | null>(null);
  const [newRisk, setNewRisk] = useState<Partial<Risk>>({
    description: '',
    severity: 3,
    likelihood: 3,
    mitigation: '',
    mitigationType: 'Operational',
    residualLikelihood: 2,
    isCustom: true
  });
  // Initialize steps with risks if they don't have them
  useEffect(() => {
    steps.forEach(step => {
      if (!step.risks) {
        const stepType = step.title;
        let initialRisks: Risk[] = [];
        // Find common risks for this step type
        const commonRisksForStep = commonRisks[stepType] || commonRisks['New Step'];
        // Create full risk objects with calculated scores
        initialRisks = commonRisksForStep.map(risk => {
          const severity = risk.severity || 3;
          const likelihood = risk.likelihood || 3;
          const residualLikelihood = risk.residualLikelihood || 2;
          return {
            id: Math.random().toString(36).substring(2, 11),
            description: risk.description || 'Unspecified risk',
            severity,
            likelihood,
            score: severity * likelihood,
            mitigation: risk.mitigation || '',
            mitigationType: risk.mitigationType || 'Operational',
            residualLikelihood,
            residualScore: severity * residualLikelihood,
            isCustom: false
          };
        });
        onUpdateStep({
          ...step,
          risks: initialRisks
        });
      }
    });
  }, [steps]);
  const handleAddRisk = (stepId: number) => {
    setIsAddingRisk(stepId);
    setNewRisk({
      description: '',
      severity: 3,
      likelihood: 3,
      mitigation: '',
      mitigationType: 'Operational',
      residualLikelihood: 2,
      isCustom: true
    });
  };
  const handleSaveNewRisk = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (step && newRisk.description) {
      const severity = newRisk.severity || 3;
      const likelihood = newRisk.likelihood || 3;
      const residualLikelihood = newRisk.residualLikelihood || 2;
      const risk: Risk = {
        id: Math.random().toString(36).substring(2, 11),
        description: newRisk.description,
        severity,
        likelihood,
        score: severity * likelihood,
        mitigation: newRisk.mitigation || '',
        mitigationType: newRisk.mitigationType || 'Operational',
        residualLikelihood,
        residualScore: severity * residualLikelihood,
        isCustom: true
      };
      onUpdateStep({
        ...step,
        risks: [...(step.risks || []), risk]
      });
      setIsAddingRisk(null);
    }
  };
  const handleCancelNewRisk = () => {
    setIsAddingRisk(null);
  };
  const handleUpdateRisk = (stepId: number, riskId: string, field: keyof Risk, value: any) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.risks) {
      const updatedRisks = step.risks.map(risk => {
        if (risk.id === riskId) {
          const updatedRisk = {
            ...risk,
            [field]: value
          };
          // Recalculate score if severity or likelihood changes
          if (field === 'severity' || field === 'likelihood') {
            updatedRisk.score = updatedRisk.severity * updatedRisk.likelihood;
          }
          // Recalculate residual score if severity or residual likelihood changes
          if (field === 'severity' || field === 'residualLikelihood') {
            updatedRisk.residualScore = updatedRisk.severity * updatedRisk.residualLikelihood;
          }
          return updatedRisk;
        }
        return risk;
      });
      onUpdateStep({
        ...step,
        risks: updatedRisks
      });
    }
  };
  const handleDeleteRisk = (stepId: number, riskId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && step.risks) {
      onUpdateStep({
        ...step,
        risks: step.risks.filter(risk => risk.id !== riskId)
      });
    }
  };
  const getRiskLevel = (score: number) => {
    if (score > 12) return 'high';
    if (score > 5) return 'medium';
    return 'low';
  };
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };
  const calculateStepAlarpStatus = (risks: Risk[] | undefined) => {
    if (!risks || risks.length === 0) return {
      percentage: 0,
      isCompliant: false
    };
    const totalRisks = risks.length;
    const highRisksRemaining = risks.filter(risk => risk.residualScore > 12).length;
    const mediumRisksRemaining = risks.filter(risk => risk.residualScore > 5 && risk.residualScore <= 12).length;
    const lowRisks = risks.filter(risk => risk.residualScore <= 5).length;
    // ALARP compliance means no high risks and medium risks are justified
    const isCompliant = highRisksRemaining === 0;
    // Calculate percentage based on risk reduction
    const percentage = Math.round(lowRisks / totalRisks * 100);
    return {
      percentage,
      isCompliant
    };
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Risk Assessment (ALARP)
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600 flex items-center">
              <InfoIcon size={16} className="mr-1 text-blue-500" />
              <span>ALARP: As Low As Reasonably Practicable</span>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">High Risk (&gt;12)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600">Medium Risk (6-12)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Low Risk (≤5)</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            All risks should be reduced to ALARP (As Low As Reasonably
            Practicable). High risks require immediate mitigation.
          </p>
        </div>
        <div className="space-y-4">
          {steps.map(step => {
          const alarpStatus = calculateStepAlarpStatus(step.risks);
          return <div key={step.id} className="border border-gray-200 rounded-md overflow-hidden">
                <div className={`p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer ${expandedStep === step.id ? 'bg-blue-50' : 'bg-gray-50'}`} onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                      {step.id}
                    </div>
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                    {step.risks && step.risks.length > 0 && <div className="flex items-center space-x-2">
                        <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {step.risks.length} Risks
                        </div>
                        {step.risks.filter(r => getRiskLevel(r.residualScore) === 'high').length > 0 && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {step.risks.filter(r => getRiskLevel(r.residualScore) === 'high').length}{' '}
                            High
                          </div>}
                        {step.risks.filter(r => getRiskLevel(r.residualScore) === 'medium').length > 0 && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {step.risks.filter(r => getRiskLevel(r.residualScore) === 'medium').length}{' '}
                            Medium
                          </div>}
                        {step.risks.filter(r => getRiskLevel(r.residualScore) === 'low').length > 0 && <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {step.risks.filter(r => getRiskLevel(r.residualScore) === 'low').length}{' '}
                            Low
                          </div>}
                      </div>}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div className={`h-2.5 rounded-full ${alarpStatus.isCompliant ? 'bg-green-500' : 'bg-yellow-500'}`} style={{
                      width: `${alarpStatus.percentage}%`
                    }}></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {alarpStatus.percentage}% ALARP
                      </span>
                    </div>
                    {alarpStatus.isCompliant ? <CheckCircleIcon size={20} className="text-green-500" /> : <AlertCircleIcon size={20} className="text-yellow-500" />}
                  </div>
                </div>
                {expandedStep === step.id && <div className="p-4">
                    {step.risks && step.risks.length > 0 ? <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead>
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Risk Description
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Initial Assessment
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mitigation
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Residual Risk
                              </th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {step.risks.map(risk => <tr key={risk.id} className="hover:bg-gray-50">
                                <td className="px-3 py-3">
                                  <input type="text" value={risk.description} onChange={e => handleUpdateRisk(step.id, risk.id, 'description', e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex space-x-2 items-center">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Severity
                                      </label>
                                      <select value={risk.severity} onChange={e => handleUpdateRisk(step.id, risk.id, 'severity', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value={1}>1 - Minimal</option>
                                        <option value={2}>2 - Minor</option>
                                        <option value={3}>3 - Moderate</option>
                                        <option value={4}>4 - Major</option>
                                        <option value={5}>
                                          5 - Catastrophic
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Likelihood
                                      </label>
                                      <select value={risk.likelihood} onChange={e => handleUpdateRisk(step.id, risk.id, 'likelihood', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value={1}>1 - Rare</option>
                                        <option value={2}>2 - Unlikely</option>
                                        <option value={3}>3 - Possible</option>
                                        <option value={4}>4 - Likely</option>
                                        <option value={5}>
                                          5 - Almost Certain
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Score
                                      </label>
                                      <div className={`px-3 py-1 rounded-md text-sm font-medium ${getRiskLevelColor(getRiskLevel(risk.score))}`}>
                                        {risk.score} -{' '}
                                        {getRiskLevelText(getRiskLevel(risk.score))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="space-y-2">
                                    <textarea value={risk.mitigation} onChange={e => handleUpdateRisk(step.id, risk.id, 'mitigation', e.target.value)} rows={2} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                    <select value={risk.mitigationType} onChange={e => handleUpdateRisk(step.id, risk.id, 'mitigationType', e.target.value)} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                      <option value="Engineering">
                                        Engineering
                                      </option>
                                      <option value="Operational">
                                        Operational
                                      </option>
                                      <option value="Routing">Routing</option>
                                      <option value="Communication">
                                        Communication
                                      </option>
                                    </select>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Residual Likelihood
                                      </label>
                                      <select value={risk.residualLikelihood} onChange={e => handleUpdateRisk(step.id, risk.id, 'residualLikelihood', parseInt(e.target.value))} className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                                        <option value={1}>1 - Rare</option>
                                        <option value={2}>2 - Unlikely</option>
                                        <option value={3}>3 - Possible</option>
                                        <option value={4}>4 - Likely</option>
                                        <option value={5}>
                                          5 - Almost Certain
                                        </option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">
                                        Residual Score
                                      </label>
                                      <div className={`px-3 py-1 rounded-md text-sm font-medium ${getRiskLevelColor(getRiskLevel(risk.residualScore))}`}>
                                        {risk.residualScore} -{' '}
                                        {getRiskLevelText(getRiskLevel(risk.residualScore))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  {risk.isCustom && <button onClick={() => handleDeleteRisk(step.id, risk.id)} className="text-red-500 hover:text-red-700">
                                      <XIcon size={18} />
                                    </button>}
                                </td>
                              </tr>)}
                          </tbody>
                        </table>
                      </div> : <p className="text-gray-500 text-center py-4">
                        No risks identified for this step yet.
                      </p>}
                    {isAddingRisk === step.id ? <div className="mt-4 border border-blue-200 rounded-md p-4 bg-blue-50">
                        <h5 className="font-medium text-gray-800 mb-3">
                          Add New Risk
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Risk Description
                            </label>
                            <input type="text" value={newRisk.description} onChange={e => setNewRisk({
                      ...newRisk,
                      description: e.target.value
                    })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Describe the risk..." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Initial Assessment
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Severity
                                  </label>
                                  <select value={newRisk.severity} onChange={e => setNewRisk({
                            ...newRisk,
                            severity: parseInt(e.target.value)
                          })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value={1}>1 - Minimal</option>
                                    <option value={2}>2 - Minor</option>
                                    <option value={3}>3 - Moderate</option>
                                    <option value={4}>4 - Major</option>
                                    <option value={5}>5 - Catastrophic</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Likelihood
                                  </label>
                                  <select value={newRisk.likelihood} onChange={e => setNewRisk({
                            ...newRisk,
                            likelihood: parseInt(e.target.value)
                          })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                    <option value={1}>1 - Rare</option>
                                    <option value={2}>2 - Unlikely</option>
                                    <option value={3}>3 - Possible</option>
                                    <option value={4}>4 - Likely</option>
                                    <option value={5}>
                                      5 - Almost Certain
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mitigation
                              </label>
                              <textarea value={newRisk.mitigation} onChange={e => setNewRisk({
                        ...newRisk,
                        mitigation: e.target.value
                      })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="How will this risk be mitigated?" rows={1} />
                              <div className="mt-1">
                                <select value={newRisk.mitigationType} onChange={e => setNewRisk({
                          ...newRisk,
                          mitigationType: e.target.value as any
                        })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                                  <option value="Engineering">
                                    Engineering
                                  </option>
                                  <option value="Operational">
                                    Operational
                                  </option>
                                  <option value="Routing">Routing</option>
                                  <option value="Communication">
                                    Communication
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Residual Likelihood
                            </label>
                            <select value={newRisk.residualLikelihood} onChange={e => setNewRisk({
                      ...newRisk,
                      residualLikelihood: parseInt(e.target.value)
                    })} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                              <option value={1}>1 - Rare</option>
                              <option value={2}>2 - Unlikely</option>
                              <option value={3}>3 - Possible</option>
                              <option value={4}>4 - Likely</option>
                              <option value={5}>5 - Almost Certain</option>
                            </select>
                          </div>
                          <div className="flex justify-end space-x-3 mt-2">
                            <button onClick={handleCancelNewRisk} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                              Cancel
                            </button>
                            <button onClick={() => handleSaveNewRisk(step.id)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700" disabled={!newRisk.description}>
                              Save Risk
                            </button>
                          </div>
                        </div>
                      </div> : <div className="mt-4 flex justify-center">
                        <button onClick={() => handleAddRisk(step.id)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-50">
                          <PlusIcon size={16} />
                          <span>Add Custom Risk</span>
                        </button>
                      </div>}
                  </div>}
              </div>;
        })}
        </div>
      </div>
    </div>;
};