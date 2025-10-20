
import React from 'react';
import { Cell as RechartCell } from 'recharts';

const Cell = ({ key, fill }) => {
  return <RechartCell key={key} fill={fill} />;
};

export default Cell;
