import { Carousel } from '@mantine/carousel';
import { useEffect, useState } from 'react';
import CardC from './Cards';
import { type Unit } from './Cards';
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import { useUnitProvider } from '../context/UnitContext';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './carousel.module.css';
import axios from 'axios';

const unitTypes = [
  {
    value: 'Infantry',
    description: '...',
  },
  {
    value: 'Special Operations Forces',
    description: '...',
  },
  {
    value: 'Other',
    description: '...',
  },
];

function CarouselC() {
  const { selectedUnit, setSelectedUnit } = useUnitProvider();

  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Unit[]>('http://10.0.1.226:5000/api/units');
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const { sectionId } = useParams();

  return (
    <div>
      {unitTypes.map((item) => (
        <div key={item.value} style={{ marginBottom: 20 }}>
          <h2>{item.value}</h2>
          <Carousel
            classNames={{ controls: classes.controls, root: classes.root }}
              align="start"
              slideSize={100}
              slideGap='md'
              controlsOffset={0}
              controlSize={50}
              containScroll='trimSnaps'
              slidesToScroll={3}>
              {filterUnitsByType(item.value, units).map((unitCard, index) =>
                <Carousel.Slide key={index}>
                  <CardC unit={unitCard} />
                </Carousel.Slide>
              )}
            </Carousel>
        </div>
      ))}
    </div>
  );

}

// Function to filter units by type
function filterUnitsByType(type: string, units: Unit[]): Unit[] {
  if (type === 'Other') {
    return units.filter(
      (unit) => unit.unit_type !== 'Infantry' && unit.unit_type !== 'Special Operations Forces'
    );
  } else {
    return units.filter((unit) => unit.unit_type === type);
  }
}

export default CarouselC;
