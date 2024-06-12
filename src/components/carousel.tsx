import { Carousel } from '@mantine/carousel';
import { useState } from 'react';
import CardC from './Cards';
import { type Unit } from './Cards';
import { data } from '../data/units';
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import { useUnitProvider } from '../context/UnitContext';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './carousel.module.css';

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
  if (type === 'Other') {
    return data.filter(
      (unit) => unit.unitType !== 'Infantry' && unit.unitType !== 'Special Operations Forces'
    );
  } else {
    return data.filter((unit) => unit.unitType === type);
  }
}

export default CarouselC;
