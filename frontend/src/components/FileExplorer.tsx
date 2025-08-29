import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, File, Code, Image, FileText, Download, Eye, Loader2 } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: string;
  extension?: string;
  content?: string;
}

interface FileExplorerProps {
  isGenerating: boolean;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ isGenerating }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string | null>('src/App.tsx');
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');

  const mockFileContent: Record<string, string> = {
    'src/App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <Hero />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;`,
    'src/components/Header.tsx': `import React, { useState } from 'react';
import { Menu, X, Camera } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-800/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold">PhotoStudio</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;`,
    'src/components/Hero.tsx': `import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Capturing Life's
            <span className="block">Beautiful Moments</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professional photography services that tell your story through stunning visuals. 
            From portraits to events, we create memories that last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105">
              <span>View Portfolio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 hover:bg-gray-800">
              <Play className="w-5 h-5" />
              <span>Watch Reel</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;`,
    'package.json': `{
  "name": "photographer-portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}`
  };

  const mockFileStructure: FileNode[] = [
    {
      name: 'public',
      type: 'folder',
      children: [
        { name: 'favicon.ico', type: 'file', size: '4.2 KB', extension: 'ico' },
        { name: 'logo.png', type: 'file', size: '12.8 KB', extension: 'png' },
        { name: 'robots.txt', type: 'file', size: '0.2 KB', extension: 'txt' }
      ]
    },
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.tsx', type: 'file', size: '2.1 KB', extension: 'tsx', content: mockFileContent['src/components/Header.tsx'] },
            { name: 'Hero.tsx', type: 'file', size: '3.4 KB', extension: 'tsx', content: mockFileContent['src/components/Hero.tsx'] },
            { name: 'Gallery.tsx', type: 'file', size: '4.2 KB', extension: 'tsx' },
            { name: 'Contact.tsx', type: 'file', size: '2.8 KB', extension: 'tsx' },
            { name: 'Footer.tsx', type: 'file', size: '1.9 KB', extension: 'tsx' }
          ]
        },
        {
          name: 'styles',
          type: 'folder',
          children: [
            { name: 'globals.css', type: 'file', size: '1.2 KB', extension: 'css' },
            { name: 'components.css', type: 'file', size: '3.6 KB', extension: 'css' }
          ]
        },
        {
          name: 'utils',
          type: 'folder',
          children: [
            { name: 'helpers.ts', type: 'file', size: '0.8 KB', extension: 'ts' },
            { name: 'constants.ts', type: 'file', size: '0.4 KB', extension: 'ts' }
          ]
        },
        { name: 'App.tsx', type: 'file', size: '2.7 KB', extension: 'tsx', content: mockFileContent['src/App.tsx'] },
        { name: 'main.tsx', type: 'file', size: '0.6 KB', extension: 'tsx' },
        { name: 'index.css', type: 'file', size: '0.9 KB', extension: 'css' }
      ]
    },
    { name: 'package.json', type: 'file', size: '1.1 KB', extension: 'json', content: mockFileContent['package.json'] },
    { name: 'tsconfig.json', type: 'file', size: '0.7 KB', extension: 'json' },
    { name: 'tailwind.config.js', type: 'file', size: '0.3 KB', extension: 'js' },
    { name: 'vite.config.ts', type: 'file', size: '0.4 KB', extension: 'ts' },
    { name: 'README.md', type: 'file', size: '1.8 KB', extension: 'md' }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setFileStructure(mockFileStructure);
    }
  }, [isGenerating]);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (file: FileNode) => {
    if (file.type === 'folder') {
      return expandedFolders.has(file.name) ? 
        <FolderOpen className="w-4 h-4 text-blue-600" /> : 
        <Folder className="w-4 h-4 text-blue-600" />;
    }

    switch (file.extension) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'css':
        return <FileText className="w-4 h-4 text-purple-500" />;
      case 'png':
      case 'jpg':
      case 'ico':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'json':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLanguageFromExtension = (extension?: string) => {
    switch (extension) {
      case 'tsx':
      case 'jsx':
        return 'typescript';
      case 'ts':
        return 'typescript';
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  const findFileContent = (nodes: FileNode[], targetPath: string, currentPath = ''): string | null => {
    for (const node of nodes) {
      const nodePath = currentPath ? `${currentPath}/${node.name}` : node.name;
      
      if (nodePath === targetPath && node.type === 'file') {
        return node.content || `// Content for ${node.name}\n// This file would contain the actual implementation`;
      }
      
      if (node.type === 'folder' && node.children) {
        const result = findFileContent(node.children, targetPath, nodePath);
        if (result) return result;
      }
    }
    return null;
  };

  const renderFileTree = (nodes: FileNode[], parentPath = '', depth = 0) => {
    return nodes.map((node, index) => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(currentPath);
      const isSelected = selectedFile === currentPath;

      return (
        <div key={index}>
          <div
            className={`flex items-center space-x-2 py-2 px-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ${
              isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
            }`}
            style={{ paddingLeft: `${depth * 20 + 12}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(currentPath);
              } else {
                setSelectedFile(isSelected ? null : currentPath);
              }
            }}
          >
            {getFileIcon(node)}
            <span className={`text-sm flex-1 ${
              isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'
            }`}>
              {node.name}
            </span>
            {node.type === 'file' && node.size && (
              <span className="text-xs text-gray-400">{node.size}</span>
            )}
          </div>
          
          {node.type === 'folder' && isExpanded && node.children && (
            <div>
              {renderFileTree(node.children, currentPath, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const PreviewComponent = () => (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <header className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PhotoStudio</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Capturing Life's
            <span className="block">Beautiful Moments</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Professional photography services that tell your story through stunning visuals. 
            From portraits to events, we create memories that last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
              View Portfolio
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-800">
              Watch Reel
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-700 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="aspect-square bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Image className="w-12 h-12 text-white/50" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">Photo {i}</h3>
                  <p className="text-gray-400 text-sm">Professional shoot</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Let's Create Something Amazing</h2>
          <p className="text-gray-300 mb-8">Ready to capture your special moments? Get in touch and let's discuss your vision.</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
            Contact Me
          </button>
        </div>
      </section>
    </div>
  );

  const selectedFileContent = selectedFile ? findFileContent(fileStructure, selectedFile) : null;
  const selectedFileExtension = selectedFile ? selectedFile.split('.').pop() : undefined;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* File explorer sidebar */}
      <div className="flex h-full">
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* File explorer header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Files</h3>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {isGenerating ? 'Generating files...' : `${fileStructure.length} items`}
            </p>
          </div>

          {/* File tree */}
          <div className="flex-1 overflow-y-auto">
            {isGenerating ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center space-x-3 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Generating your website files...</span>
                </div>
                <div className="mt-4 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-3 p-3">
                      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className={`h-3 bg-gray-200 rounded animate-pulse`} style={{ width: `${60 + Math.random() * 40}%` }}></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-2">
                {renderFileTree(fileStructure)}
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'code'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === 'preview'
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1">
            {activeTab === 'code' ? (
              selectedFile && selectedFileContent && !isGenerating ? (
                <div className="h-full">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm text-gray-600">{selectedFile}</span>
                  </div>
                  <Editor
                    height="100%"
                    language={getLanguageFromExtension(selectedFileExtension)}
                    value={selectedFileContent}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on'
                    }}
                  />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    {isGenerating ? (
                      <div className="inline-flex items-center space-x-3 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Generating code...</span>
                      </div>
                    ) : (
                      <>
                        <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Select a file to view its contents</p>
                      </>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div className="h-full">
                {isGenerating ? (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-3 text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Building preview...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <PreviewComponent />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;