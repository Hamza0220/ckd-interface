import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { database } from './firebaseconfig';
import { ref, onValue } from 'firebase/database';
import './ecgdata.scss';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function EcgData() {
  const [visibleData, setVisibleData] = useState([]);
  const maxDisplayPoints = 100;

  useEffect(() => {
    const sensorValueRef = ref(database, 'sensorValue');

    const unsubscribe = onValue(sensorValueRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Raw data from Firebase:", data);

      if (data !== null && data !== undefined) {
        setVisibleData(currentData => {
          const newData = [...currentData, data];
          return newData.slice(-maxDisplayPoints);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const chartData = {
    labels: Array.from({ length: visibleData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Sensor Data',
        data: visibleData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4, // Increased tension for smoother interpolation
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
        suggestedMax: 3000,  // Adjust this value based on your expected maximum data value
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
    <div style={{ height: '75vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
