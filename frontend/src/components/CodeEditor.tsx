import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { FileItem } from "../types";

interface CodeEditorProps {
  selectedFile: FileItem | null;
  onChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ selectedFile, onChange }) => {
   
  const editorRef = useRef<any>(null);

  const getLanguage = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "json":
        return "json";
      case "css":
        return "css";
      case "html":
        return "html";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  return (
    <div className="h-full">
      {selectedFile ? (
        <Editor
          height="100%"
          defaultLanguage={getLanguage(selectedFile.name)}
          value={selectedFile.content || ""}
          onChange={onChange}
          theme="vs-dark"
        />
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a file to start editing
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
