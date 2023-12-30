import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { db } from './firebaseconfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './ecgdata.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function EcgData() {
  const [ecgData, setEcgData] = useState([]);
  console.log('ecgData',ecgData)
  const [visibleData, setVisibleData] = useState([]);
  // const maxDisplayPoints = 50;
  // const updateInterval = 4000; // 4 seconds
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const maxDisplayPoints = 1000; // Increased number of points displayed
  const updateInterval = 100; // Slower update interval, 10 seconds
  const getNextDataPoint = () => {
    if (currentDataIndex < ecgData.length) {
      const nextDataPoint = ecgData[currentDataIndex];
      setCurrentDataIndex(currentDataIndex + 1);
      return nextDataPoint;
    } else {
      // Reset the index to loop the data or handle it as needed
      setCurrentDataIndex(0);
      return ecgData[0]; // Loop back to the first data point
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'ecg_values2'), orderBy('timestamp', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setEcgData(doc.data().values);
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new data point
      const nextDataPoint = getNextDataPoint();
      if (nextDataPoint !== undefined) {
        setVisibleData((currentVisibleData) => {
          const newData = [...currentVisibleData, nextDataPoint];
          // Keep only the latest 'maxDisplayPoints' data points
          return newData.slice(-maxDisplayPoints);
        });
      }
    }, 10); // Add new point every 3 seconds
  
    return () => clearInterval(interval);
  }, [currentDataIndex, ecgData]);
  
  const chartData = {
    labels: Array.from({ length: maxDisplayPoints }, (_, i) => i + 1),
    datasets: [
      {
        label: 'ECG Data',
        data: visibleData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };
  const options = {
    scales: {
      x: {
        type: 'linear',
        display: true,
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20, // Adjusted for better readability
        },
      },
      y: {
        type: 'linear',
        beginAtZero: false,
        suggestedMin: -0.5, // Adjust this value based on your expected minimum data value
        suggestedMax: 1,  // Adjust this value based on your expected maximum data value
        grid: {
          drawOnChartArea: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value.toFixed(2);
          }
        }
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0 // Turn off animation effects to update the chart instantly
    },
    elements: {
      point: {
        radius: 0 // Points are not displayed
      }
    },
    plugins: {
      legend: {
        display: false, // No legend displayed
      },
      title: {
        display: false, // No title displayed
      },
    },
  };
  
  return (
   
    <div 
    style={{ height: '75vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       
      <div style={{ height: '50vh', width: '95vw', border: '1px solid black', overflowX: 'auto' }}>
        <div className='canvas' style={{ minWidth: '1860px' }}>
          <Line data={chartData} options={options} />
        </div>
     
      </div>
      <style>
        {`
          ::-webkit-scrollbar {
            height: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 5px;
          }
          ::-webkit-scrollbar-track {
            background-color: rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
}

export default EcgData;
