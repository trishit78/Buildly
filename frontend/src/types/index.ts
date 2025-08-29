export enum StepType {
    CreateFile,
    CreateFolder,
    EditFile,
    DeleteFile,
    RunScript
}

export interface Step {
    id: number; 
    title: string;
    description: string;
    type?: StepType;
    status?: 'pending' | 'in-progress' | 'completed' | 'failed';
    code?:string;
    completed?: boolean;
    path?: string;
}

 export interface FileItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    content?: string;
    path: string;
  }