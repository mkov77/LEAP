import { Box, Card, Container, Flex, Image, Text, Badge, Button, Group, Grid, GridCol, Progress } from '@mantine/core';
import classes from './Cards.module.css'
// Define Unit interface
export interface Unit {
  unitID: string;
  unitType: string;
  unitSymbol: string;
  isFriendly: boolean;
  unitHealth: number;
}

interface CardProps {
  unit: Unit;
}

function CardC({ unit }: CardProps) {
  const { unitID, unitType, unitHealth } = unit;

  
    let healthColor = 'green';
    if(unitHealth >= 66){
      healthColor = '#6aa84f';
    }
    else if(unitHealth < 66 && unitHealth >= 33){
      healthColor = '	#e69138';
    }
    else{
      healthColor = '#cc0000'
    }
  

  return (

    <Card shadow="sm" padding={0} radius={0} style={{ display: 'inline-block', width: '250px', margin: '0' }}> 
      <Grid style={{ margin: 0 }}>
      <Grid.Col span={1} style={{ backgroundColor: 'black', position: 'relative', padding: 0 }}>
      <div className={classes.bar} style={{ height: `${unitHealth}%`, width: '100%', backgroundColor: healthColor }} />
      </Grid.Col>

      <Grid.Col span={11} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 0 }}>

      <Card.Section component="a">
        <Image
              src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
              fit="contain"
              height={160}
              alt={unitID}
              style={{ margin: 'auto' }} /* Center the image */
            />
      </Card.Section>

      <Text size="sm" c="dimmed" style={{ margin: '10px 0' }}>
        {unitID}
      </Text>
      </Grid.Col>
      </Grid>
    </Card>

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



// Example card
/**
 * return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component="a" href={`https://mantine.dev/${unitID}`}>
        <Image
          src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
          height={160}
          alt={unitID}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{unitID}</Text>
        <Badge color="pink">On Sale</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {unitType}
      </Text>

      <Text size="sm" c="dimmed">
        Health: {unitHealth}
      </Text>

      <Button color="blue" fullWidth mt="md" radius="md">
        Select for battle
      </Button>
    </Card>
  );
}

function GridC({ units }: { units: Unit[] }) {
  return (
    <Grid>
      {units.map((unit, index) => (
        <Grid.Col key={index} span={3}>
          <CardC unit={unit} />
        </Grid.Col>
      ))}
    </Grid>
  );
 */