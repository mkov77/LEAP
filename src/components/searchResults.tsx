import React from 'react';
import GridC from './Cards'; // Import your Card component
import { data } from '../data/units';

interface Props {
  search: string;
}

const SearchResultList: React.FC<Props> = (props) => {
  const { search } = props;
  
  // Filter units based on search term
  const filteredUnits = data.filter(unit =>
    unit.unitID.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filteredUnits.map(unitResult => (
        
            <GridC  key={unitResult.unitID} units={[unitResult]} /> // Pass array of units
        
            ))}
        </div>
    </div>
  );
};

export default SearchResultList;
