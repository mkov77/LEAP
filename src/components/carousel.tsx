import { Carousel } from '@mantine/carousel';
import GridC from './Cards';
import { type Unit } from './Cards';
import { data } from '../data/units';

const unitTypes = [
  {
    value: 'Infantry',
    description: '...',
  },
  {
    value: 'Special Operations',
    description: '...',
  },
  {
    value: 'Armor',
    description: '...',
  },
];

function CarouselC() {

  return (
    <div>
      {unitTypes.map((item) => (
        <div key={item.value} style={{ marginBottom: 20 }}>
          <h2>{item.value}</h2>
          <div style={{ overflowX: 'auto' }}>
            <Carousel>
              <Carousel.Slide>
                  <GridC units={filterUnitsByType(item.value)} />
              </Carousel.Slide>
            </Carousel>
          </div>
        </div>
      ))}
    </div>
  );

}

// Function to filter units by type
function filterUnitsByType(type: string): Unit[] {
  return data.filter((unit) => unit.unitType === type);
}

export default CarouselC;
