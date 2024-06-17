import React from 'react';
import { GridC }  from './Cards'; // Import your Card component
import { data } from '../data/units';

interface Props {
  search: string;
}

const SearchResultList: React.FC<Props> = (props) => {
  const { search } = props;
  
  // Filter units based on search term
  const filteredUnits = data.filter(unit =>
    unit.unit_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {filteredUnits.map(unitResult => (
        
            <GridC  key={unitResult.unit_id} units={[unitResult]} /> // Pass array of units
        
            ))}
        </div>
    </div>
  );
};

export default SearchResultList;
