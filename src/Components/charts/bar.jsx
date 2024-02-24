import React from "react";
import ReactApexChart from "react-apexcharts";

function ApexBarChart({ orderData }) {
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
        "May",
        "June",
        "July",
        "Aug",
        "Sep",
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

  // Initialize series with 0 values for each month
  const initialSeriesData = Array.from({ length: 12 }, () => 0);

  const series = [
    {
      name: "Orders",
      data: initialSeriesData,
    },
  ];

  // Update the series data based on the orderData prop
  if (orderData) {
    orderData.forEach((order) => {
      const monthIndex = new Date(order.created_at).getMonth();
      series[0].data[monthIndex]++;
    });
  }

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="220"
          />
        </div>
      </div>
    </div>
  );
}

export default ApexBarChart;