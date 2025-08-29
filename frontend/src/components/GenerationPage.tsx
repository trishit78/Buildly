import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StepsSidebar from './StepsSidebar';
//import FileExplorer from './FileExplorer';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { FileItem, Step, StepType } from '../types';
import { parseXml } from '../steps';
import {FileExplorer}  from './FileExplorer';

const GenerationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);

  const [steps,setSteps]= useState<Step[]>([]);
  const prompt = location.state?.prompt || '';
const [files, setFiles] = useState<FileItem[]>([]);
const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

type StepStatus = 'pending' | 'in-progress' | 'completed';
useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    steps
      .filter(({ status }) => status === 'pending')
      .forEach((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split('/') ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = '';
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'file',
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: 'folder',
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
     // console.log(originalFiles)
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: 'completed' as StepStatus,
          };
        })
      );
    }
  }, [steps]);



async function init(): Promise<void> {
  try {
    // Step 1: Call templates endpoint
    const templateResponse = await axios.post(`${BACKEND_URL}/templates`, {
  prompt: prompt.trim()
}, {
  headers: { "Content-Type": "application/json" }
});
    
    const {prompts,uiPrompts} = templateResponse.data;
    setSteps(parseXml(uiPrompts[0]));

    //console.log(steps)
    // Step 2: Call chat endpoint with proper body
    // const chatResponse = await axios.post(`${BACKEND_URL}/chat`, {
    //   messages: prompts
    // });
    // console.log("Chat response:", chatResponse.data);
  
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Unexpected Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
  }
}


  useEffect(() => {
    
    init();
  }, [])
  //console.log(files)


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
      
        <FileExplorer files={files} onFileSelect={setSelectedFile}   />
      </div>
    </div>
  );
};

export default GenerationPage;