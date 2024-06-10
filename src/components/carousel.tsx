import { Carousel } from '@mantine/carousel';
import CardC from './Cards';
import { type Unit } from './Cards';
import { data } from '../data/units';
import { rem } from '@mantine/core';
import classes from './carousel.module.css';

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
            <Carousel 
            slideSize={{ base: '100%', sm: '50%' }}
            slideGap={{ base: rem(2), sm: 'xl' }}
            align="start"
            slidesToScroll={1}>
              {filterUnitsByType(item.value).map((unitCard, index) =>
                <Carousel.Slide key={index}>
                  <CardC unit={unitCard} />
                </Carousel.Slide>
              )}
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
