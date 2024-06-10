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

  
    let color = 'green';
    if(unitHealth >= 66){
      color = 'green';
    }
    else if(unitHealth < 66 && unitHealth >= 33){
      color = 'orange';
    }
    else{
      color = 'red'
    }

  

  return (

    <Card shadow="sm" padding={0} radius={0} withBorder style={{ display: 'inline-block',  width: '300px' }}>
      <Grid>
        <Grid.Col  span={1} style={{backgroundColor: color}}>
          <div className={classes.bar} style={{ height: `${100 - unitHealth}%` }}/>
        </Grid.Col>

        <Grid.Col span={11} >
      <Card.Section component="a">
        <Image
          src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
          fit='contain'
          height={160}
          alt={unitID}
        />
      </Card.Section>

      <Text size="sm" c="dimmed" style={{ margin: '10px 0' }}>
        {unitID}
      </Text>

      <Text size="sm" c="dimmed">
        {unitType}
      </Text>

      <Text size="sm" c="dimmed">
        Health: {unitHealth}
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