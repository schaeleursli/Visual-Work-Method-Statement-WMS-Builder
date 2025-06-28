import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon, ArrowRightIcon, InfoIcon, CheckCircleIcon, AlertCircleIcon, HelpCircleIcon } from 'lucide-react';
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
interface RiskMatrixProps {
  step: Step;
  onUpdateRisk: (riskId: string, field: keyof Risk, value: any) => void;
  onAddRisk: () => void;
  onDeleteRisk: (riskId: string) => void;
}
export const RiskMatrix: React.FC<RiskMatrixProps> = ({
  step,
  onUpdateRisk,
  onAddRisk,
  onDeleteRisk
}) => {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [showTooltip, setShowTooltip] = useState<{
    type: 'severity' | 'likelihood' | 'risk-level';
    x: number;
    y: number;
    content: React.ReactNode;
  } | null>(null);
  // Risk level colors and text
  const getRiskLevelColor = (score: number) => {
    if (score > 12) return 'bg-red-500';
    if (score > 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const getRiskLevelTextColor = (score: number) => {
    if (score > 12) return 'text-red-800';
    if (score > 5) return 'text-yellow-800';
    return 'text-green-800';
  };
  const getRiskLevelBgColor = (score: number) => {
    if (score > 12) return 'bg-red-100';
    if (score > 5) return 'bg-yellow-100';
    return 'bg-green-100';
  };
  const getRiskLevelText = (score: number) => {
    if (score > 12) return 'High';
    if (score > 5) return 'Medium';
    return 'Low';
  };
  // Get cell background color based on risk level
  const getCellColor = (severity: number, likelihood: number) => {
    const score = severity * likelihood;
    if (score > 12) return 'bg-red-100';
    if (score > 5) return 'bg-yellow-100';
    return 'bg-green-100';
  };
  // Calculate ALARP status
  const calculateAlarpStatus = (risks: Risk[] | undefined) => {
    if (!risks || risks.length === 0) return {
      percentage: 0,
      isCompliant: false
    };
    const totalRisks = risks.length;
    const highRisksRemaining = risks.filter(risk => risk.residualScore > 12).length;
    const mediumRisksRemaining = risks.filter(risk => risk.residualScore > 5 && risk.residualScore <= 12).length;
    const lowRisks = risks.filter(risk => risk.residualScore <= 5).length;
    // ALARP compliance means no high risks
    const isCompliant = highRisksRemaining === 0;
    // Calculate percentage based on risk reduction
    const percentage = Math.round(lowRisks / totalRisks * 100);
    return {
      percentage,
      isCompliant
    };
  };
  const alarpStatus = calculateAlarpStatus(step.risks);
  // Tooltip content
  const severityTooltip = <div className="p-2">
      <h4 className="font-medium mb-1">Severity Levels</h4>
      <ul className="text-xs space-y-1">
        <li>
          <span className="font-medium">1 - Minimal:</span> Minor injury, no
          lost time
        </li>
        <li>
          <span className="font-medium">2 - Minor:</span> Injury with short
          recovery
        </li>
        <li>
          <span className="font-medium">3 - Moderate:</span> Injury requiring
          medical treatment
        </li>
        <li>
          <span className="font-medium">4 - Major:</span> Serious injury,
          long-term effect
        </li>
        <li>
          <span className="font-medium">5 - Catastrophic:</span> Fatality or
          multiple serious injuries
        </li>
      </ul>
    </div>;
  const likelihoodTooltip = <div className="p-2">
      <h4 className="font-medium mb-1">Likelihood Levels</h4>
      <ul className="text-xs space-y-1">
        <li>
          <span className="font-medium">1 - Rare:</span> May occur only in
          exceptional circumstances
        </li>
        <li>
          <span className="font-medium">2 - Unlikely:</span> Could occur at some
          time
        </li>
        <li>
          <span className="font-medium">3 - Possible:</span> Might occur at some
          time
        </li>
        <li>
          <span className="font-medium">4 - Likely:</span> Will probably occur
          in most circumstances
        </li>
        <li>
          <span className="font-medium">5 - Almost Certain:</span> Expected to
          occur in most circumstances
        </li>
      </ul>
    </div>;
  const riskLevelTooltip = <div className="p-2">
      <h4 className="font-medium mb-1">Risk Levels</h4>
      <ul className="text-xs space-y-1">
        <li className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>{' '}
          <span className="font-medium">Low (≤5):</span> Acceptable risk, manage
          by routine procedures
        </li>
        <li className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>{' '}
          <span className="font-medium">Medium (6-12):</span> Attention needed,
          specific monitoring required
        </li>
        <li className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>{' '}
          <span className="font-medium">High (≥13):</span> Immediate action
          required, detailed planning needed
        </li>
      </ul>
    </div>;
  return <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800">
          Risk Assessment Matrix - {step.title}
        </h3>
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
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">High Risk (≥13)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Medium Risk (6-12)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Low Risk (≤5)</span>
          </div>
          <div className="ml-auto flex items-center text-sm text-gray-600">
            <InfoIcon size={16} className="mr-1 text-blue-500" />
            <span>ALARP: As Low As Reasonably Practicable</span>
          </div>
        </div>
      </div>
      {/* Risk Matrix Grid */}
      <div className="mb-8 relative">
        <div className="flex">
          {/* Left axis label - Likelihood */}
          <div className="flex flex-col items-center justify-center mr-2 w-28">
            <div className="transform -rotate-90 text-sm font-medium text-gray-700 whitespace-nowrap">
              Likelihood
              <button className="inline-block ml-1 text-gray-400 hover:text-gray-600" onClick={e => {
              setShowTooltip({
                type: 'likelihood',
                x: e.currentTarget.getBoundingClientRect().right,
                y: e.currentTarget.getBoundingClientRect().top,
                content: likelihoodTooltip
              });
            }} onMouseLeave={() => setShowTooltip(null)}>
                <HelpCircleIcon size={14} />
              </button>
            </div>
          </div>
          <div>
            {/* Top row - Severity labels */}
            <div className="flex mb-1 ml-8">
              <div className="w-24 text-center text-sm font-medium text-gray-700">
                Severity
                <button className="inline-block ml-1 text-gray-400 hover:text-gray-600" onClick={e => {
                setShowTooltip({
                  type: 'severity',
                  x: e.currentTarget.getBoundingClientRect().right,
                  y: e.currentTarget.getBoundingClientRect().top,
                  content: severityTooltip
                });
              }} onMouseLeave={() => setShowTooltip(null)}>
                  <HelpCircleIcon size={14} />
                </button>
              </div>
              {[1, 2, 3, 4, 5].map(severity => <div key={severity} className="w-16 text-center text-sm font-medium text-gray-700">
                  {severity}
                </div>)}
            </div>
            {/* Matrix rows */}
            {[5, 4, 3, 2, 1].map(likelihood => <div key={likelihood} className="flex items-center mb-1">
                {/* Row label */}
                <div className="w-8 text-center text-sm font-medium text-gray-700 mr-1">
                  {likelihood}
                </div>
                {/* Matrix cells */}
                {[1, 2, 3, 4, 5].map(severity => {
              const cellScore = severity * likelihood;
              const cellRisks = step.risks?.filter(risk => risk.severity === severity && risk.likelihood === likelihood) || [];
              const residualRisks = step.risks?.filter(risk => risk.severity === severity && risk.residualLikelihood === likelihood) || [];
              return <div key={`${likelihood}-${severity}`} className={`w-16 h-16 border border-gray-300 flex items-center justify-center relative ${getCellColor(severity, likelihood)}`} onMouseEnter={() => setHoveredCell({
                row: likelihood,
                col: severity
              })} onMouseLeave={() => setHoveredCell(null)}>
                      <div className="absolute top-1 left-1 text-xs font-medium text-gray-600">
                        {cellScore}
                      </div>
                      {/* Risk dots */}
                      <div className="flex flex-wrap items-center justify-center gap-1 max-w-full">
                        {cellRisks.map(risk => <div key={risk.id} className={`w-4 h-4 rounded-full ${getRiskLevelColor(risk.score)} cursor-pointer relative z-10 border-2 border-white`} onClick={() => setSelectedRisk(risk.id === selectedRisk ? null : risk.id)} title={risk.description} />)}
                        {residualRisks.map(risk => <div key={`residual-${risk.id}`} className={`w-4 h-4 rounded-full ${getRiskLevelColor(risk.residualScore)} cursor-pointer relative z-10 border-2 border-white border-dashed`} onClick={() => setSelectedRisk(risk.id === selectedRisk ? null : risk.id)} title={`${risk.description} (Residual)`} />)}
                      </div>
                      {/* Risk arrows */}
                      {step.risks?.filter(risk => risk.severity === severity && risk.likelihood === likelihood && risk.residualLikelihood !== likelihood).map(risk => {
                  // Draw arrow to residual risk position
                  return <div key={`arrow-${risk.id}`} className="absolute inset-0 pointer-events-none">
                              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <marker id={`arrowhead-${risk.id}`} markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto">
                                    <polygon points="0 0, 5 2.5, 0 5" fill="#4B5563" />
                                  </marker>
                                </defs>
                                <line x1="50%" y1="50%" x2="50%" y2={`${risk.residualLikelihood > likelihood ? '100%' : '0%'}`} stroke="#4B5563" strokeWidth="1.5" strokeDasharray="4" markerEnd={`url(#arrowhead-${risk.id})`} />
                              </svg>
                            </div>;
                })}
                    </div>;
            })}
              </div>)}
          </div>
        </div>
        {/* Risk level tooltip button */}
        <button className="absolute top-0 right-0 text-gray-400 hover:text-gray-600" onClick={e => {
        setShowTooltip({
          type: 'risk-level',
          x: e.currentTarget.getBoundingClientRect().right,
          y: e.currentTarget.getBoundingClientRect().top,
          content: riskLevelTooltip
        });
      }} onMouseLeave={() => setShowTooltip(null)}>
          <HelpCircleIcon size={16} />
        </button>
        {/* Tooltip */}
        {showTooltip && <div className="absolute bg-white border border-gray-200 rounded-md shadow-md z-50 max-w-xs" style={{
        top: showTooltip.y + 20,
        left: showTooltip.x - 150
      }}>
            {showTooltip.content}
          </div>}
      </div>
      {/* Risk Table */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-gray-800">Risk Register</h4>
          <button onClick={onAddRisk} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center space-x-1 text-sm">
            <span>Add Risk</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Description
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initial Risk
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mitigation
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Residual Risk
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ALARP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {step.risks?.map(risk => <tr key={risk.id} className={`hover:bg-gray-50 ${selectedRisk === risk.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedRisk(risk.id === selectedRisk ? null : risk.id)}>
                  <td className="px-3 py-3">
                    <div className="font-medium text-gray-800">
                      {risk.description}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(risk.score)}`}></div>
                      <div className={`px-2 py-1 rounded-md text-sm font-medium ${getRiskLevelBgColor(risk.score)} ${getRiskLevelTextColor(risk.score)}`}>
                        {risk.score} - {getRiskLevelText(risk.score)}
                      </div>
                      <div className="text-xs text-gray-500">
                        (S:{risk.severity} × L:{risk.likelihood})
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm text-gray-800">
                      {risk.mitigation || 'No mitigation defined'}
                    </div>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {risk.mitigationType}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(risk.residualScore)}`}></div>
                      <div className={`px-2 py-1 rounded-md text-sm font-medium ${getRiskLevelBgColor(risk.residualScore)} ${getRiskLevelTextColor(risk.residualScore)}`}>
                        {risk.residualScore} -{' '}
                        {getRiskLevelText(risk.residualScore)}
                      </div>
                      <div className="text-xs text-gray-500">
                        (S:{risk.severity} × L:{risk.residualLikelihood})
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {risk.residualScore <= 5 ? <div className="flex items-center text-green-600">
                        <CheckCircleIcon size={16} className="mr-1" />
                        <span>Yes</span>
                      </div> : risk.residualScore <= 12 ? <div className="flex items-center text-yellow-600">
                        <AlertCircleIcon size={16} className="mr-1" />
                        <span>Justified</span>
                      </div> : <div className="flex items-center text-red-600">
                        <AlertTriangleIcon size={16} className="mr-1" />
                        <span>No</span>
                      </div>}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        {selectedRisk && step.risks && <div className="mt-4 border border-blue-200 rounded-md p-4 bg-blue-50">
            <h5 className="font-medium text-gray-800 mb-3">Edit Risk</h5>
            {(() => {
          const risk = step.risks?.find(r => r.id === selectedRisk);
          if (!risk) return null;
          return <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Description
                    </label>
                    <input type="text" value={risk.description} onChange={e => onUpdateRisk(risk.id, 'description', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
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
                          <select value={risk.severity} onChange={e => onUpdateRisk(risk.id, 'severity', parseInt(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
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
                          <select value={risk.likelihood} onChange={e => onUpdateRisk(risk.id, 'likelihood', parseInt(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value={1}>1 - Rare</option>
                            <option value={2}>2 - Unlikely</option>
                            <option value={3}>3 - Possible</option>
                            <option value={4}>4 - Likely</option>
                            <option value={5}>5 - Almost Certain</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mitigation
                      </label>
                      <textarea value={risk.mitigation} onChange={e => onUpdateRisk(risk.id, 'mitigation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="How will this risk be mitigated?" rows={1} />
                      <div className="mt-1">
                        <select value={risk.mitigationType} onChange={e => onUpdateRisk(risk.id, 'mitigationType', e.target.value as any)} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="Engineering">Engineering</option>
                          <option value="Operational">Operational</option>
                          <option value="Routing">Routing</option>
                          <option value="Communication">Communication</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Residual Likelihood
                    </label>
                    <select value={risk.residualLikelihood} onChange={e => onUpdateRisk(risk.id, 'residualLikelihood', parseInt(e.target.value))} className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option value={1}>1 - Rare</option>
                      <option value={2}>2 - Unlikely</option>
                      <option value={3}>3 - Possible</option>
                      <option value={4}>4 - Likely</option>
                      <option value={5}>5 - Almost Certain</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-2">
                    <button onClick={() => setSelectedRisk(null)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 text-sm hover:bg-gray-50">
                      Close
                    </button>
                    {risk.isCustom && <button onClick={() => {
                onDeleteRisk(risk.id);
                setSelectedRisk(null);
              }} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">
                        Delete Risk
                      </button>}
                  </div>
                </div>;
        })()}
          </div>}
        {step.risks?.length === 0 && <div className="text-center py-8 border border-gray-200 rounded-md">
            <AlertTriangleIcon size={36} className="mx-auto text-gray-300 mb-3" />
            <h4 className="text-gray-700 font-medium mb-1">
              No risks identified
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              You haven't added any risks to this step yet.
            </p>
            <button onClick={onAddRisk} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
              Add Risk
            </button>
          </div>}
      </div>
    </div>;
};