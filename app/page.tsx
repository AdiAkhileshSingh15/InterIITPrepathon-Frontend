"use client";
import { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, TooltipProps } from 'recharts';
import Image from "next/image";
import API from "@/utils/axios";

export default function Home() {
  const [history, setHistory] = useState<{ fileName: string, lcLoad: any[], flareData: any[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [clickedPeakTime, setClickedPeakTime] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    if (uploadedFile) {
      const fileName = uploadedFile.name;
      const fileIndex = history.findIndex((item) => item.fileName === fileName);
      if (fileIndex !== -1) {
        alert("File already uploaded");
        setSelectedFile(fileIndex);
        return;
      }

      const formData = new FormData();
      formData.append('file', uploadedFile);

      setIsLoading(true);
      await API.post('upload', formData)
        .then((res) => {
          const lcLoad = res && res.detected_flares;
          const flareDatapoints = res && res.lc_data;

          const flareData = flareDatapoints.map((point: any) => ({
            time: point["time"],
            rate: point["rate"],
            status: point["status"],
          }));

          setHistory([...history, { fileName, lcLoad, flareData }]);
          setSelectedFile(history.length);
        })
        .catch((err) => { console.error(err) });
      setIsLoading(false);
    }
  };

  const handleFileDownload = async () => {
    if (selectedFile === null || history[selectedFile].lcLoad.length === 0) {
      alert("Please select a file to download data");
      return;
    }
    await API.get('result/download', { responseType: 'blob' })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'flare_data.csv');
        document.body.appendChild(link);
        link.click();

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((err) => { console.error(err) });
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isSelected = clickedPeakTime !== null && payload.time === clickedPeakTime;

    if (payload.status === 'Peak') {
      return (
        <svg onClick={() => setClickedPeakTime(payload.time)} style={{ cursor: 'pointer' }}>
          <circle
            cx={cx}
            cy={cy}
            r={6}
            fill={isSelected ? "#fb7185" : "blue"}
            stroke="white"
            strokeWidth={2}
          />
        </svg>
      );
    }

    return <></>;
  };

  const isHighlighted = (time: number) => {
    return clickedPeakTime !== null && time === clickedPeakTime;
  };

  useEffect(() => {
    if (clickedPeakTime !== null) {
      const timeout = setTimeout(() => setClickedPeakTime(null), 1000);
      return () => clearTimeout(timeout);
    }
  }, [clickedPeakTime]);

  const CustomTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length && payload[0].payload) {
      return (
        <div className="light_gradient border border-gray-300 rounded p-2 shadow-lg">
          <p className="text-rose-500">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-blue-600">{`Rate: ${payload[0].payload.rate}`}</p>
          <p className="text-green-600">{`Status: ${payload[1].payload.status}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="lg" className="flex min-h-screen flex-col items-center justify-between p-15">
      <div className="max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <section className='w-full flex-center flex-col'>
          <Typography variant="h1" className='head_text text-center'>
            Flare-Dynamics Visualizer
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
          <div className="flex w-full mt-8">
            <div className="w-1/4">
              <Typography variant="h5" className='purple_gradient'>Upload History</Typography>
              {isLoading ? (
                <div className='flex flex-col items-center'>
                  <Image
                    src='assets/icons/loader.svg'
                    width={50}
                    height={50}
                    alt='loader'
                    className='object-contain mt-6'
                  />
                </div>) :
                (<ul style={{ maxHeight: '500px', overflowY: 'scroll', overflowX: 'hidden', scrollbarWidth: 'none' }}>
                  {history.map((item, index) => (
                    <li key={index}
                      onClick={() => setSelectedFile(index)}
                      style={{
                        cursor: 'pointer',
                        fontWeight: selectedFile === index ? 'bold' : 'normal',
                        boxShadow: selectedFile === index ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                        transform: selectedFile === index ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease-in-out',
                        wordWrap: 'break-word',
                      }}
                      className='p-2 text-gray-600 border-b blue_gradient'>
                      {item.fileName}
                    </li>
                  ))}
                </ul>)
              }
            </div>

            <div className='flex flex-col items-center w-3/4 ml-4'>
              {selectedFile !== null && history[selectedFile] && (
                <>
                  <Typography variant="h6" className='dark_blue_gradient'>Flare Detection Curve</Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={history[selectedFile].flareData} margin={{ top: 10, right: 30, left: 12, bottom: 12 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time">
                        <Label value="Time (sec)" fill="#ff3967" offset={0} position="insideBottom" dy={10} />
                      </XAxis>
                      <YAxis label={{ value: 'Rate (count per sec)', fill: "blue", angle: -90, position: 'insideLeft', dy: 80, dx: -10 }} />
                      <Tooltip content={CustomTooltip} />
                      <Line type="monotone" dataKey="rate" stroke="blue" dot={CustomDot} />
                      <Line type="monotone" dataKey="status" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>

                  <div className="mt-8">
                    <div className='flex flex-col items-center'>
                      <Button
                        variant="contained"
                        component="label"
                        className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 focus:ring-gray-500 focus:ring-offset-gray-200 text-white transition ease-in duration-200 text-center text-base shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                        onClick={handleFileDownload}
                      >
                        Download CSV
                      </Button>
                      <Typography variant="h6" className='dark_blue_gradient mt-4'>Data Table</Typography>
                      <div style={{ maxHeight: '400px', overflowY: 'auto', position: 'relative', scrollbarWidth: 'none' }}>
                        <table className="min-w-full table-auto">
                          <thead className="sticky top-0 bg-gray-200">
                            <tr className="text-gray-600 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-left">Flare Type</th>
                              <th className="py-3 px-6 text-left">Start</th>
                              <th className="py-3 px-6 text-left">Precise Start</th>
                              <th className="py-3 px-6 text-left">Start Rate</th>
                              <th className="py-3 px-6 text-left">Peak</th>
                              <th className="py-3 px-6 text-left">Peak Rate</th>
                              <th className="py-3 px-6 text-left">End</th>
                              <th className="py-3 px-6 text-left">End Rate</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm font-light">
                            {Array.from({ length: history[selectedFile].lcLoad[0].length }, (_, i) => {
                              const startTime = history[selectedFile].lcLoad[1][i];
                              const peakTime = history[selectedFile].lcLoad[4][i];
                              const endTime = history[selectedFile].lcLoad[6][i];

                              const isRowHighlighted = isHighlighted(startTime) || isHighlighted(peakTime) || isHighlighted(endTime);
                              return (
                                <tr key={i} className={`border-b border-gray-200 hover:bg-gray-100 ${isRowHighlighted ? 'bg-blue-100' : ''}`} style={{ transition: 'background-color 0.5s ease' }} onClick={() => setClickedPeakTime(peakTime)}>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[0][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[1][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[2][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[3][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[4][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[5][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[6][i]}</td>
                                  <td className="py-3 px-6 text-left whitespace-nowrap">{history[selectedFile].lcLoad[7][i]}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div >
    </Container >
  );
}
