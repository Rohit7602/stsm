import React from "react";
import ReactApexChart from "react-apexcharts";

function ApexBarChart() {
  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "March",
        "April",
        "June",
        "July",
        "Aug",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
          style: "dotted",
        },
      },
      yaxis: {
        lines: {
          show: true,
          style: "dotted",
        },
      },
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 20, 45, 30, 49, 60, 70, 91, 50, 80],
    },
  ];

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="220" // Set the width to 800 pixels
          />
        </div>
      </div>
    </div>
  );
}

export default ApexBarChart;
