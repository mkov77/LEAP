import { Box, Card, Container, Flex, Image, Text, Badge, Button, Group, Grid, Progress, HoverCard } from '@mantine/core';
import classes from './Cards.module.css'
import { useUnitProvider } from '../context/UnitContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useClickOutside } from '@mantine/hooks';
import { RawNodeDatum } from 'react-d3-tree';

// Define Unit interface
export interface Unit {
  unit_id: string;
  unit_type: string;
  unit_symbol: string;
  is_friendly: boolean;
  unit_health: number;
  role_type: string;
  unit_size: string;
  force_posture: string;
  force_mobility: string;
  force_readiness: string;
  force_skill: string;
  children: string[];
}

interface CardProps {
  unit: Unit;
}

function CardC({ unit }: CardProps) {
  const { unit_id, unit_type, unit_health, unit_symbol, is_friendly, role_type, unit_size, force_posture, force_mobility, force_readiness, force_skill } = unit;
  const { sectionID } = useParams();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const navigate = useNavigate();


  let healthColor = 'green';

  if (unit_health >= 75) {
    healthColor = '#6aa84f';
  } else if (unit_health < 75 && unit_health >= 50) {
    healthColor = '#f1c232';
  } else if (unit_health < 50 && unit_health >= 25) {
    healthColor = '#e69138';
  } else {
    healthColor = '#cc0000';
  }

  return (
    <HoverCard width={280} shadow="md" openDelay={750}>
      <HoverCard.Target>
        <Card
          shadow={unit_id === selectedUnit ? '0' : 'lg'}
          padding={0}
          radius={0}

          onClick={() => {
            if (unit_health > 0) {
              if (selectedUnit === unit_id) {
                navigate('/battlePage');
              } else {
                setSelectedUnit(unit_id);
              }
            }
          }}
          style={{
            cursor: unit_health > 0 ? 'pointer' : 'not-allowed',
            backgroundColor: selectedUnit === unit_id ? 'rgba(128, 128, 128, 0.5)' : '',
            display: 'inline-block',
            width: '250px',
            margin: '0'
          }}
          className='highlightable-card'
        >
          <Grid style={{ margin: 0 }}>
            <Grid.Col span={1} style={{ backgroundColor: 'black', position: 'relative', padding: 0 }}>
              <div className={classes.bar} style={{ height: `${unit_health}%`, width: '100%', backgroundColor: healthColor }} />
            </Grid.Col>

            <Grid.Col span={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 20px' }}>
              <Card.Section inheritPadding={true} style={{ marginRight: '10px' }}>
                <Image
                  src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
                  fit="contain"
                  height={160}
                  alt={unit_id}
                  style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Card.Section>
              <Card.Section>
                <Text size="lg" c="dimmed" style={{ textAlign: 'center', marginRight: '10px', fontWeight: 'bold', color: 'white' }}>
                  {unit_id}
                </Text>
              </Card.Section>
            </Grid.Col>
          </Grid>
        </Card>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          <strong>Unit ID:</strong> {unit_id}<br />
          <strong>Type:</strong> {unit_type}<br />
          <strong>Friendly:</strong> {is_friendly ? 'Yes' : 'No'}<br />
          <strong>Health:</strong> {unit_health}<br />
          <strong>Role Type:</strong> {role_type}<br />
          <strong>Unit Size:</strong> {unit_size}<br />
          <strong>Force Posture:</strong> {force_posture}<br />
          <strong>Force Mobility:</strong> {force_mobility}<br />
          <strong>Force Readiness:</strong> {force_readiness}<br />
          <strong>Force Skill:</strong> {force_skill}<br />
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

export function GridC({ units }: { units: Unit[] }) {
  return (
    <>
      {units.map((unit, index) => (
        <CardC key={index} unit={unit} />
      ))}
    </>
  );
}

export default CardC;
