import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';
import { RefreshCw, AlertOctagon } from 'lucide-react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {

    console.log(files)
    console.log(webContainer)
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
useEffect(() => {
  if (!webContainer) return; // Wait until initialized
  async function startServer() {
    const installProcess = await webContainer.spawn('npm', ['install']);
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));

    await webContainer.spawn('npm', ['run', 'dev']);
    webContainer.on('server-ready', (port, url) => {
      console.log(url);
      setUrl(url);
    });
  }
  startServer();
}, [files,webContainer]); // Run only when webContainer is ready




  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-950 rounded-lg overflow-hidden border border-gray-800">
      {/* {loading && (
        <div className="text-center p-6 flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-300 font-medium">Setting up preview environment...</p>
          <p className="text-sm text-gray-500">This might take a moment</p>
        </div>
      )} */}
      
  

      
      {url && ( 
        <iframe 
          src={url} 
          className={cn(
            "w-full h-full border-0 transition-opacity duration-300",
            
          )}
          title="Site Preview"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
        />
      )}
    </div>
  );
}