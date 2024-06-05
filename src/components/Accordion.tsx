import { Accordion } from '@mantine/core';
import GridC from './Cards';
import { type Unit } from '../components/Cards';
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

function AccordionC() {
  return (
    <Accordion variant="filled" defaultValue="Infantry">
      {unitTypes.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>{item.value}</Accordion.Control>
          <Accordion.Panel>
            <GridC units={filterUnitsByType(item.value)} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

// Function to filter units by type
function filterUnitsByType(type: string): Unit[] {
  return data.filter((unit) => unit.unitType === type);
}

export default AccordionC;
