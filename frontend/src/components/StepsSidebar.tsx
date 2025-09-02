import React from 'react';
import { Check, Clock } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
  code?:string;
  status?:string;
}

interface StepsSidebarProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  isGenerating: boolean;
}

const StepsSidebar: React.FC<StepsSidebarProps> = ({ 
  steps, 
  currentStep, 
  onStepChange, 
  isGenerating 
}) => {
//  console.log(steps)
  const getStepIcon = (step: Step, _index: number) => {
    //console.log(step.status)
    if (step.status === "completed") {
      return <Check className="w-5 h-5 text-white" />;
    }  else {
      return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepStatus = (step: Step, index: number) => {
    if (step.status === "completed") return 'completed';
    if (isGenerating && index === 2) return 'active';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Generation Steps</h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            
            return (
              <div
                key={index}
                className={`relative flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                    : status === 'active'
                    ? 'bg-orange-50 border border-orange-200'
                    : status === 'current'
                    ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => !isGenerating && onStepChange(index)}
              >
                {/* Step indicator */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  status === 'completed' 
                    ? 'bg-green-500' 
                    : status === 'active'
                    ? 'bg-orange-500'
                    : status === 'current'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`}>
                  {getStepIcon(step, index)}
                </div>
                
                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${
                    status === 'completed' ? 'text-green-900' :
                    status === 'active' ? 'text-orange-900' :
                    status === 'current' ? 'text-blue-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs mt-1 ${
                    status === 'completed' ? 'text-green-700' :
                    status === 'active' ? 'text-orange-700' :
                    status === 'current' ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>

                {/* Status indicator */}
                {status === 'active' && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress summary */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {steps.filter(s => s.completed).length}/{steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsSidebar;