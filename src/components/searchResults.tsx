import React, { useState, useEffect } from 'react';
import { GridC } from './Cards'; // Import your Card component
import axios from 'axios';
import { Unit } from '../components/Cards';

interface Props {
  search: string;
}

const SearchResultList: React.FC<Props> = (props) => {

  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Unit[]>('http://10.0.1.226:5000/api/units/sectionSort');
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const { search } = props;

  // Filter units based on search term
  const filteredUnits = units.filter(unit =>
    unit.unit_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{}}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {filteredUnits.map(unitResult => (

          <GridC key={unitResult.unit_id} units={[unitResult]} /> // Pass array of units

        ))}
      </div>
    </div>
  );
};

export default SearchResultList;
