"use client"
import { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import Image from "next/image";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    if (uploadedFile) {
      setFile(uploadedFile);
      const fileName = uploadedFile.name;
      setHistory([...history, fileName]);
      // logic to handle the file upload and api call
      setDownloadLink('/path/to/generated/file'); // dummy link
    }
  };

  const handleFileDownload = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    } else {
      alert('No file available for download.');
    }
  };

  return (
    <Container maxWidth="md" className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <section className='w-full flex-center flex-col'>
          <Typography variant="h1" className='head_text text-center'>
            Flare Dynamics Visualizer
            <br className='max-md:hidden' />
            <span className='blue_gradient text-center mt-8'>
              Analyze Solar Flare Data
            </span>
          </Typography>

          <form className="flex flex-col items-center w-full mt-8">
            <Button
              variant="contained"
              component="label"
              className="px-5 py-1.5 bg-primary-orange hover:bg-orange-400 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Upload File
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </form>

          {file && (
            <Typography variant="body1" className="mt-4">
              Uploaded File: {file.name}
            </Typography>
          )}

          {history.length > 0 && (
            <div className="w-full mt-8">
              <Typography variant="h5" className='green_gradient'>
                Upload History
              </Typography>
              <ul>
                {history.map((item, index) => (
                  <li key={index} className='text-gray-600'>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex mt-8 space-x-4">
            <Button
              variant="contained"
              onClick={handleFileDownload}
              disabled={!file}
              className="px-5 py-1.5 bg-primary-orange hover:bg-orange-400 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Download CSV
            </Button>
          </div>

          {isLoading && (
            <Image
              src='assets/icons/loader.svg'
              width={50}
              height={50}
              alt='loader'
              className='object-contain mt-6'
            />
          )}
        </section>
      </div>
    </Container>
  );
}
