import { Box, Card, Container, Flex, Image, Text, Badge, Button, Group, Grid, Progress, HoverCard } from '@mantine/core';
import classes from './Cards.module.css'
import { useUnitProvider } from '../context/UnitContext';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import BattleComponent from '../pages/battlePage';

// Define Unit interface
export interface Unit {
  unitID: string;
  unitType: string;
  unitSymbol: string;
  isFriendly: boolean;
  unitHealth: number;
  roleType: string;
  unitSize: string;
  forcePosture: string;
  forceMobility: string;
  forceReadiness: string;
  forceSkill: string;
}

interface CardProps {
  unit: Unit;
}

function CardC({ unit }: CardProps) {
  const { unitID, unitType, unitHealth, unitSymbol, isFriendly, roleType, unitSize, forcePosture, forceMobility, forceReadiness, forceSkill } = unit;
  const { sectionID } = useParams();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const navigate = useNavigate();
  let healthColor = 'green';

  if (unitHealth >= 75) {
    healthColor = '#6aa84f';
  } else if (unitHealth < 75 && unitHealth >= 50) {
    healthColor = '#f1c232';
  } else if (unitHealth < 50 && unitHealth >= 25) {
    healthColor = '#e69138';
  } else {
    healthColor = '#cc0000';
  }

  return (
    <HoverCard width={280} shadow="md">
      <HoverCard.Target>
        <Card
          shadow={unitID === selectedUnit ? '0' : 'lg'}
          padding={0}
          radius={0}
          onClick={() => {
            if (unitHealth > 0) {
              if (selectedUnit === unitID) {
                navigate('/battlePage');
              } else {
                setSelectedUnit(unitID);
              }
            }
          }}
          style={{
            cursor: unitHealth > 0 ? 'pointer' : 'not-allowed',
            backgroundColor: selectedUnit === unitID ? 'rgba(128, 128, 128, 0.5)' : '',
            display: 'inline-block',
            width: '250px',
            margin: '0'
          }}
          className='highlightable-card'
        >
          <Grid style={{ margin: 0 }}>
            <Grid.Col span={1} style={{ backgroundColor: 'black', position: 'relative', padding: 0 }}>
              <div className={classes.bar} style={{ height: `${unitHealth}%`, width: '100%', backgroundColor: healthColor }} />
            </Grid.Col>

            <Grid.Col span={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 20px' }}>
              <Card.Section inheritPadding={true} style={{ marginRight: '10px' }}>
                <Image
                  src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
                  fit="contain"
                  height={160}
                  alt={unitID}
                  style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Card.Section>
              <Card.Section>
                <Text size="lg" c="dimmed" style={{ textAlign: 'center', marginRight: '10px', fontWeight: 'bold', color: 'white' }}>
                  {unitID}
                </Text>
              </Card.Section>
            </Grid.Col>
          </Grid>
        </Card>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          <strong>Unit ID:</strong> {unitID}<br />
          <strong>Type:</strong> {unitType}<br />
          <strong>Friendly:</strong> {isFriendly ? 'Yes' : 'No'}<br />
          <strong>Health:</strong> {unitHealth}<br />
          <strong>Role Type:</strong> {roleType}<br />
          <strong>Unit Size:</strong> {unitSize}<br />
          <strong>Force Posture:</strong> {forcePosture}<br />
          <strong>Force Mobility:</strong> {forceMobility}<br />
          <strong>Force Readiness:</strong> {forceReadiness}<br />
          <strong>Force Skill:</strong> {forceSkill}<br />
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
