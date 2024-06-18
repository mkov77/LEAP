import React, { useEffect, useState } from 'react';
import '../App.css';
import { Progress, Text, AppShell, Group, Skeleton, Image, Stepper, Button, SegmentedControl, rem, Modal, useMantineColorScheme, useComputedColorScheme, MantineProvider, Grid, Card, Center } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { IconSwords, IconHeartbeat, IconNumber1Small, IconNumber2Small, IconNumber3Small, IconNumber4Small } from '@tabler/icons-react';
import { FaSun, FaMoon } from "react-icons/fa";
import { useUserRole } from '../context/UserContext';
import { UnitProvider, useUnitProvider } from '../context/UnitContext';
import { Unit } from '../components/Cards';
import classes from './battlePage.module.css';
import { read } from 'fs';
import axios from 'axios';

function BattlePage() {
  const [mobileOpened] = useDisclosure(false);
  const [desktopOpened] = useDisclosure(false);
  const navigate = useNavigate();
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const [active, setActive] = useState(0);
  const [modalOpened, { open, close }] = useDisclosure(true);
  const closeLocation = '/studentPage/' + userSection;
  const { selectedUnit, setSelectedUnit } = useUnitProvider();


  const [units, setUnits] = useState<Unit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Unit[]>('http://10.0.1.226:5000/api/units');
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const unit = units.find((u) => u.unit_id === selectedUnit);
  const {
    unit_id,
    unit_type,
    unit_health,
    unit_symbol,
    is_friendly,
    role_type,
    unit_size,
    force_posture,
    force_mobility,
    force_readiness,
    force_skill
  } = unit || {};
  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


  let readinessColor = 'green';
  const getReadinessProgress = (force_readiness: string | undefined) => {
    switch (force_readiness) {
      case 'Untrained':
        return 0;
      case 'Low':
        return 25;
      case 'Medium':
        return 50;
      case 'High':
        return 75;
      case 'Elite':
        return 100;
      default:
        return <div>Error: Invalid Force Readiness</div>
    }
  }

  const getForceSkill = (force_skill: string | undefined) => {
    switch (force_skill) {
      case 'Untrained':
        return 0;
      case 'Basic':
        return 50;
      case 'Advanced':
        return 100;
      default:
        return <div>Error: Invalid Force Skill</div>
    }
  }

  const CustomProgressBarReadiness = ({ value }: { value: number }) => {
    let color = 'blue';

    //set color based on value for readiness
    if (value === 0) {
      color = 'red';
    }
    else if (value <= 25) {
      color = 'orange';
    }
    else if (value <= 50) {
      color = 'yellow';
    }
    else if (value <= 75) {
      color = 'lime';
    }
    else {
      color = 'green';
    }

    return (
      <Progress value={value} color={color} size={'xl'} />
    );
  };

  const CustomProgressBarSkill = ({ value }: { value: number }) => {
    let color = 'blue';

    //set color based on value for readiness
    if (value === 0) {
      color = 'red';
    }
    else if (value <= 50) {
      color = 'yellow';
    }
    else {
      color = 'green';
    }

    return (
      <Progress value={value} color={color} size={'xl'} />
    );
  };

  const CustomProgressBarHealth = ({ value }: { value: number }) => {
    let color = 'blue';

    //set color based on value for readiness
    if (value <= 25) {
      color = 'red';
    }
    else if (value <= 50) {
      color = 'orange';
    }
    else if (value <= 75) {
      color = 'yellow';
    }
    else {
      color = 'green';
    }

    return (
      <Progress value={value} color={color} size={'xl'} />
    );
  };


  return (
    <MantineProvider defaultColorScheme='dark'>

      <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} style={{ padding: '20px' }}>
        <Stepper.Step allowStepSelect={false} icon={<IconSwords stroke={1.5} style={{ width: rem(27), height: rem(27) }} />}>
          <div>
            <Grid justify='center' align='flex-start' gutter={100}>
              <Grid.Col span={4}>
                <Card withBorder radius="md" className={classes.card} >
                  <Card.Section className={classes.imageSection} mt="md" >
                    <Group>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image
                          src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
                          height={160}
                          style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </Group>
                  </Card.Section>
                  <Card.Section className={classes.section}><h2>{selectedUnit}</h2></Card.Section>
                  {unit ? (
                    <Text size="xl" style={{ whiteSpace: 'pre-line' }}>
                      <strong>Type:</strong> {unit_type}<br />
                      <strong>Unit Size:</strong> {unit_size}<br />
                      <strong>Force Mobility:</strong> {force_mobility}<br />
                      <strong>Health:</strong> {unit_health}<br />
                      <CustomProgressBarHealth value={Number(unit_health)} />

                      <strong>Force Readiness:</strong> {force_readiness}<br />
                      <CustomProgressBarReadiness value={Number(getReadinessProgress(force_readiness))} />

                      <strong>Force Skill:</strong> {force_skill}<br />
                      <CustomProgressBarReadiness value={Number(getForceSkill((force_skill)))} />
                    </Text>
                  ) : (
                    <Text size="sm">Unit not found</Text>
                  )}
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card withBorder radius="md" className={classes.card} >
                  <Card.Section className={classes.imageSection} mt="md" >
                    <Group>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image
                          src={`https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png`}
                          height={160}
                          style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    </Group>
                  </Card.Section>
                  <Card.Section className={classes.section}><h2>{selectedUnit}</h2></Card.Section>
                  {unit ? (
                    <Text size="xl">
                      <strong>Type:</strong> {unit_type}<br />
                      <strong>Unit Size:</strong> {unit_size}<br />
                      <strong>Force Mobility:</strong> {force_mobility}<br />
                      <strong>Health:</strong> {unit_health}<br />
                      <CustomProgressBarHealth value={Number(unit_health)} />

                      <strong>Force Readiness:</strong> {force_readiness}<br />
                      <CustomProgressBarReadiness value={Number(getReadinessProgress(force_readiness))} />

                      <strong>Force Skill:</strong> {force_skill}<br />
                      <CustomProgressBarSkill value={Number(getForceSkill((force_skill)))} />

                    </Text>
                  ) : (
                    <Text size="sm">Unit not found</Text>
                  )}
                </Card>
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={nextStep}>Start Engagement</Button>
            </Group>
          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} label="Force Strength" icon={<IconNumber1Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
          <div>
            <p>Phase 1: Force Strength</p>
            <Grid>
              <Grid.Col span={4}>
                <h1>Friendly {selectedUnit}</h1>
                <p>Aware of OPFOR presence?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Within logistics support range?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Aware of OPFOR presence?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Within logistics support range?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={nextStep}>Continue</Button>
            </Group>

          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} label="Tactical Advantage" icon={<IconNumber2Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
          <div>
            <p>Phase 2: Tactical Advantage</p>
            <Grid>
              <Grid.Col span={6}>
                <h1>Friendly {selectedUnit}</h1>
                <p>Under ISR coverage?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Working GPS?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Under ISR coverage?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Working GPS?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={nextStep}>Next Phase</Button>
            </Group>
          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} label="Fire Support" icon={<IconNumber3Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />} >
          <div>
            <p>Phase 3: Fire Support</p>
            <Grid>
              <Grid.Col span={6}>
                <h1>Friendly {selectedUnit}</h1>
                <p>Working communications?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Within fire support range?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Working communications?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Within fire support range?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={nextStep}>Next Phase</Button>
            </Group>
          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} label="Terrain" icon={<IconNumber4Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
          <div>
            <p>Phase 4: Terrain</p>
            <Grid>
              <Grid.Col span={6}>
                <h1>Friendly {selectedUnit}</h1>
                <p>Higher ground?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Accessible by pattern force?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Higher ground?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Accessible by pattern force?</p>
                <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={nextStep}>Next Phase</Button>
            </Group>
          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} icon={<IconHeartbeat stroke={1.5} style={{ width: rem(35), height: rem(35) }} />}>
          <div>
            <h1>After-Action Review</h1>
            <p>This is where your results will be display.</p>
            <Group justify="center" mt="xl">
              <Button onClick={() => { navigate(closeLocation); setSelectedUnit(null) }}>Done</Button>
            </Group>
          </div>
        </Stepper.Step>
      </Stepper>
    </MantineProvider>
  );
}

export default BattlePage;
