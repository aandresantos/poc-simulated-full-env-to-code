"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

const CodeEnvPage = () => { 
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const containerIdRef = useRef(searchParams.get('containerId'));

  
  useEffect(function start() {
    if(!containerIdRef.current){

    const startEnvironment = async () => {

      const userId = 1

      try {
        const res = await fetch('/api/start-env', {
          method: 'POST',
          body: JSON.stringify({ userId })
        });
        if (!res.ok) {
          throw new Error('Failed to start environment');
        }
        const data = await res.json();
        router.replace(`/code-env?containerId=${containerIdRef.current}`);
      } catch (err: any) {
        console.error('Error starting environment:', err);
        setError(err.message || 'Error starting environment');
       
      } finally {
        setLoading(false);
      }
    };

    startEnvironment();}
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: fileName,
          content: `console.log('teste')`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error creating file');
      }

      const data = await res.json();
      setMessage(`File ${data.filename} created successfully!`);
      setFileName('');
    } catch (err: any) {
      setError(err.message || 'Error creating file');
    }
  };
 
  if (error) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <>
    {

      loading ?
      <div style={{ padding: '2rem' }}>
        <h1>Launching your coding environment...</h1>
        <p>Please wait while we set up your container.</p>
        <div>Loading...</div>
      </div>
        : <div className="flex flex-col gap-y-2 justify-center items-center max-w-11">
          <div className="flex flex-col gap-y-4 w-full h-[100px]">
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }} className="flex flex-col gap-y-4 h-full">
            <label>
              File Name:{' '}
              <Input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="example.js"
                required
              />
            </label>
            <Button type="submit" className="flex w-full">
              Submit
            </Button>
          </form>
          
          {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}  
            </div>
        </div>
      
    }
  </>;
}

export default CodeEnvPage