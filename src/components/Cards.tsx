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

      <Grid.Col span={11} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 20px' }}>

      <Card.Section inheritPadding={true} style={{ marginRight: '10px' }}> {/* Added padding */}
            <Image
              src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
              fit="contain"
              height={160}
              alt={unitID}
              style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} // Ensure the image fills the container width
            />
          </Card.Section>
<Card.Section>
<Text size="lg" c="dimmed" style={{textAlign: 'center', marginRight:'10px', fontWeight: 'bold', color: 'white'}}>
            {unitID}
          </Text>
</Card.Section>
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