import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';



function RechartsComponent({data = [], dataKey = 'chartData', stroke = "rgba(0,0,0,0.7)", strokeWidth = 2 }) {  
  return (
    <ResponsiveContainer width="100%" height="100%">
    <LineChart width="100%" height="100%" data={data}>
      <Tooltip />
      <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={strokeWidth} />
    </LineChart>
  </ResponsiveContainer>
  );

}

RechartsComponent.propTypes = {
    data: PropTypes.array,
    dataKey: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number
}

export default RechartsComponent;