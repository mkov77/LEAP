import { Carousel } from '@mantine/carousel';
import CardC from './Cards';
import { type Unit } from './Cards';
import { data } from '../data/units';
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
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
            <Carousel
            classNames={{ controls: classes.controls, root: classes.root }}
              align="start"
              slideSize={100}
              slideGap='md'
              controlsOffset={0}
              controlSize={50}
              containScroll='trimSnaps'
              slidesToScroll={3}>
              {filterUnitsByType(item.value).map((unitCard, index) =>
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
function filterUnitsByType(type: string): Unit[] {
  return data.filter((unit) => unit.unitType === type);
}

export default CarouselC;
