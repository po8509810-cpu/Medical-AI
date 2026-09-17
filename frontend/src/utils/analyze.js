import { referenceRanges } from './referenceRanges';

export const analyzeReport = (data) => {
  const analysis = [];
  
  for (const [key, value] of Object.entries(data)) {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || !referenceRanges[key]) {
      continue;
    }
    
    const range = referenceRanges[key];
    let status = 'normal';
    
    if (numValue < range.min) {
      status = 'low';
    } else if (numValue > range.max) {
      status = 'high';
    }
    
    analysis.push({
      id: key,
      name: range.name,
      value: numValue,
      unit: range.unit,
      min: range.min,
      max: range.max,
      status: status
    });
  }
  
  return analysis;
};
