import React, { useState } from "react";
import Chart from "react-apexcharts";

function Donut() {
  const [options] = useState({
    dataLabels: {
      enabled: false, // Hide data labels (sales numbers)
    },
    legend: {
      show: false, // Hide legend (labels on the right side)
    },
  });
  const [series] = useState([44, 55, 41, 17, 15]);

  return (
    <div className="donut ">
      <Chart options={options} series={series} type="donut" width="100%" />
    </div>
  );
}

export default Donut;
