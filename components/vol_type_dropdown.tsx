// app/dropdown/DropdownClientComponent.tsx

"use client"; // Mark this component as a client component

import { useState } from 'react';

interface VolatilityMeasure {
  id: string;
  [key: string]: any;
}

interface DropdownClientComponentProps {
  data: VolatilityMeasure[];
}

const DropdownClientComponent: React.FC<DropdownClientComponentProps> = ({ data }) => {
  const [selectedPrefix, setSelectedPrefix] = useState<string | undefined>(undefined);
  const options: string[] = ['simple', 'exponential', 'parkinson', 'garman_klass', 'rogers_satchell'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefix(event.target.value);
  };

  const filteredData = data.map((item) => {
    const filteredItem: VolatilityMeasure = { id: item.id };
    Object.keys(item).forEach((key) => {
      if (selectedPrefix && key.startsWith(selectedPrefix)) {
        filteredItem[key] = item[key];
      }
    });
    return filteredItem;
  }).filter(item => Object.keys(item).length > 1);

  return (
    <div>
      <label htmlFor="volatility-method" style={{ marginRight: '10px' }}>Select Volatility Method:</label>
      <select id="volatility-method" value={selectedPrefix || ''} onChange={handleChange}>
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
          </option>
        ))}
      </select>

      <h3>Filtered Data:</h3>
      {filteredData.length > 0 ? (
        <pre>{JSON.stringify(filteredData, null, 2)}</pre>
      ) : (
        <p>No data matching the selected method.</p>
      )}
    </div>
  );
};

export default DropdownClientComponent;
