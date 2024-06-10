import { Carousel } from '@mantine/carousel';
import { useState } from 'react';
import CardC from './Cards';
import { type Unit } from './Cards';
import { data } from '../data/units';
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import { useUnitProvider } from '../context/UnitContext';
import { useNavigate, useParams } from 'react-router-dom';

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
  const { selectedUnit, setSelectedUnit } = useUnitProvider();

  const navigate = useNavigate();
  const { sectionId } = useParams();

  return (
    <div>
      {unitTypes.map((item) => (
        <div key={item.value} style={{ marginBottom: 20 }}>
          <h2>{item.value}</h2>
          <Carousel
            withIndicators
            loop
            align="start"
            slideSize={100}
            slideGap='sm'
            controlSize={40}
            slidesToScroll={2}>
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
