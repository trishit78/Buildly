import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StepsSidebar from './StepsSidebar';
import FileExplorer from './FileExplorer';

const GenerationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  const prompt = location.state?.prompt || '';

  useEffect(() => {
    if (!prompt) {
      navigate('/');
      return;
    }

    // Simulate generation process
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [prompt, navigate]);

  const steps = [
    { id: 1, title: 'Analyzing Requirements', description: 'Understanding your website needs', completed: true },
    { id: 2, title: 'Planning Architecture', description: 'Designing the structure and layout', completed: true },
    { id: 3, title: 'Generating Components', description: 'Creating React components', completed: isGenerating ? false : true },
    { id: 4, title: 'Styling & Design', description: 'Applying CSS and animations', completed: false },
    { id: 5, title: 'Building Pages', description: 'Assembling the final website', completed: false },
    { id: 6, title: 'Final Optimizations', description: 'Performance and accessibility checks', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <div className="h-6 border-l border-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">Website Generator</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isGenerating ? 'Generating...' : 'Ready'}
            </span>
          </div>
        </div>
      </header>

      {/* Prompt display */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Building website for:</h2>
          <p className="text-lg text-gray-900 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-gray-200">
            {prompt}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex h-screen">
        <StepsSidebar 
          steps={steps} 
          currentStep={currentStep} 
          onStepChange={setCurrentStep}
          isGenerating={isGenerating}
        />
        <FileExplorer isGenerating={isGenerating} />
      </div>
    </div>
  );
};

export default GenerationPage;