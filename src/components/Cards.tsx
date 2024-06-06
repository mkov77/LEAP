import { Card, Image, Text, Badge, Button, Group, Grid, GridCol } from '@mantine/core';

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

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component="a">
        <Image
          src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
          height={160}
          alt={unitID}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{unitID}</Text>
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
        <Grid.Col key={index} span={2}>
          <CardC unit={unit} />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default GridC;



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