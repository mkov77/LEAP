import React, { useEffect, useState } from 'react';
import '../App.css';
import { Table, Progress, Text, AppShell, Group, Skeleton, Image, Stepper, Button, SegmentedControl, rem, Modal, useMantineColorScheme, useComputedColorScheme, MantineProvider, Grid, Card, Center } from '@mantine/core';
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
import { Tactics } from './afterActionReportStorage';

function BattlePage() {
  const [mobileOpened] = useDisclosure(false);
  const [desktopOpened] = useDisclosure(false);
  const navigate = useNavigate();
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const [active, setActive] = useState(0);
  const [modalOpened, { open, close }] = useDisclosure(true);
  const closeLocation = '/studentPage/' + userSection;
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const [baseValue, setBaseValue] = useState<number>(0);
  const [realTimeScore, setRealTimeScore] = useState<number | null>(null);
  const [scoreFinalized, setScoreFinalized] = useState(false); // State to track if score has been finalized

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

  const calculateBaseValue = (unit: Unit) => {
    const unitTypeValues: Record<string, number> = {
      "Command and Control": 20, "Infantry": 30, "Reconnaissance": 10, "Armored Mechanized": 40,
      "Combined Arms": 50, "Armored Mechanized Tracked": 60, "Field Artillery": 30, "Self-propelled": 40,
      "Electronic Warfare": 10, "Signal": 5, "Special Operations Forces": 40, "Ammunition": 5,
      "Air Defense": 30, "Engineer": 5, "Air Assault": 50, "Medical Treatment Facility": 5,
      "Aviation Rotary Wing": 60, "Combat Support": 20, "Sustainment": 10, "Unmanned Aerial Systems": 10,
      "Combat Service Support": 20, "Petroleum, Oil and Lubricants": 10, "Sea Port": 5, "Railhead": 5
    };
    const roleTypeValues: Record<string, number> = { "Combat": 90, "Headquarters": 50, "Support": 30, "Supply Materials": 20, "Facility": 10 };
    const unitSizeValues: Record<string, number> = { "Squad/Team": 20, "Platoon": 40, "Company/Battery": 50, "Battalion": 60, "Brigade/Regiment": 70, "Division": 80, "Corps": 90, "UAS (1)": 30, "Aviation Section (2)": 80, "Aviation Flight (4)": 30 };
    const forcePostureValues: Record<string, number> = { "Offensive Only": 50, "Defensive Only": 70, "Offense and Defense": 90 };
    const forceMobilityValues: Record<string, number> = { "Fixed": 10, "Mobile (foot)": 30, "Mobile (wheeled)": 50, "Mobile (track)": 40, "Stationary": 20, "Flight (fixed wing)": 90, "Flight (rotary wing)": 70 };
    const forceReadinessValues: Record<string, number> = { "Low": 10, "Medium": 50, "High": 90 };
    const forceSkillValues: Record<string, number> = { "Untrained": 10, "Basic": 40, "Advanced": 70, "Elite": 90 };

    const typeValue = unitTypeValues[unit.unit_type] || 0;
    const roleValue = roleTypeValues[unit.role_type] || 0;
    const sizeValue = unitSizeValues[unit.unit_size] || 0;
    const postureValue = forcePostureValues[unit.force_posture] || 0;
    const mobilityValue = forceMobilityValues[unit.force_mobility] || 0;
    const readinessValue = forceReadinessValues[unit.force_readiness] || 0;
    const skillValue = forceSkillValues[unit.force_skill] || 0;

    const baseValue = 0.15 * typeValue + 0.02 * roleValue + 0.25 * sizeValue + 0.10 * postureValue +
      0.10 * mobilityValue + 0.04 * readinessValue + 0.04 * skillValue;

    return baseValue;
  };

  useEffect(() => {
    if (unit) {
      const calculatedValue = calculateBaseValue(unit);
      setBaseValue(calculatedValue);
    }
  }, [unit]);

  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


  const weightValues = {
    awareOfPresence: {
      yes: 20,
      no: 0
    },
    logisticsSupportRange: {
      yes: 25,
      no: 0
    },
    isrCoverage: {
      yes: 10,
      no: 0
    },
    gpsWorking: {
      yes: 10,
      no: 0
    },
    communicationsWorking: {
      yes: 10,
      no: 0
    },
    fireSupportRange: {
      yes: 15,
      no: 0
    },
    patternForceRange: {
      yes: 10,
      no: 0
    }
  };


  // Update user answers
  const [question1, setQuestion1] = useState('Yes')
  const [question2, setQuestion2] = useState('Yes')
  const [question3, setQuestion3] = useState('Yes')
  const [question4, setQuestion4] = useState('Yes')
  const [question5, setQuestion5] = useState('Yes')
  const [question6, setQuestion6] = useState('Yes')
  const [question7, setQuestion7] = useState('Yes')
  const [question8, setQuestion8] = useState('Yes')

  const finalizeTactics = () => {
    // Process all phase answers here
    console.log('Phase 1 Answers:', question1, question2);
    console.log('Phase 2 Answers:', question3, question4);
    console.log('Phase 3 Answers:', question5, question6);
    console.log('Phase 4 Answers:', question7, question8);

    const score = calculateRealTimeScore();
    setRealTimeScore(score);
    setScoreFinalized(true); // Mark the score as finalized
    nextStep();

    // Example of further actions:
    // Submit answers to backend, navigate to next step, etc.
  };

  // Variable Conditions and corresponding weights
  const weights: Record<WeightKeys, { yes: number; no: number }> = {
    awareOfPresence: { yes: 20, no: 0 },
    logisticsSupportRange: { yes: 25, no: 0 },
    isrCoverage: { yes: 10, no: 0 },
    gpsWorking: { yes: 10, no: 0 },
    communicationsWorking: { yes: 10, no: 0 },
    fireSupportRange: { yes: 15, no: 0 },
    patternForceRange: { yes: 10, no: 0 }
  };

  type WeightKeys = 'awareOfPresence' | 'logisticsSupportRange' | 'isrCoverage' | 'gpsWorking' | 'communicationsWorking' | 'fireSupportRange' | 'patternForceRange';

  const calculateRealTimeScore = () => {
    let score = 0;

    // Variable Conditions and corresponding weights
    const weights: Record<WeightKeys, { yes: number; no: number }> = {
      awareOfPresence: { yes: 20, no: 0 },
      logisticsSupportRange: { yes: 25, no: 0 },
      isrCoverage: { yes: 10, no: 0 },
      gpsWorking: { yes: 10, no: 0 },
      communicationsWorking: { yes: 10, no: 0 },
      fireSupportRange: { yes: 15, no: 0 },
      patternForceRange: { yes: 10, no: 0 }
    };

    // Calculate score based on current state values of questions
    score += weights.awareOfPresence[question1.toLowerCase() as 'yes' | 'no'];
    score += weights.logisticsSupportRange[question2.toLowerCase() as 'yes' | 'no'];
    score += weights.isrCoverage[question3.toLowerCase() as 'yes' | 'no'];
    score += weights.gpsWorking[question4.toLowerCase() as 'yes' | 'no'];
    score += weights.communicationsWorking[question5.toLowerCase() as 'yes' | 'no'];
    score += weights.fireSupportRange[question6.toLowerCase() as 'yes' | 'no'];
    score += weights.patternForceRange[question7.toLowerCase() as 'yes' | 'no'];

    return score;
  };

  //printing scores into the Engagement Data card in AAR
  const tactics: Tactics[] = [
    { ID: 'Aware of OPFOR?', blueScore: weights.awareOfPresence[question1.toLowerCase() as 'yes' | 'no'], redScore: 0 },
    { ID: 'Within Logistics Support Range?', blueScore:  weights.logisticsSupportRange[question2.toLowerCase() as 'yes' | 'no'], redScore: 25 },
    { ID: 'Within RPA/ISR Coverage?', blueScore: weights.isrCoverage[question3.toLowerCase() as 'yes' | 'no'], redScore: 0 },
    { ID: 'Working GPS?', blueScore: weights.gpsWorking[question4.toLowerCase() as 'yes' | 'no'], redScore: 0 },
    { ID: 'Working Communications?', blueScore: weights.communicationsWorking[question5.toLowerCase() as 'yes' | 'no'], redScore: 15},
    { ID: 'Within Fire Support Range?', blueScore: weights.fireSupportRange[question6.toLowerCase() as 'yes' | 'no'], redScore: 0 },
    { ID: 'Within Range of a Pattern Force?', blueScore: weights.patternForceRange[question7.toLowerCase() as 'yes' | 'no'], redScore: 15 }
  ]

  //maps each tactic and its corresponding blue/red score to a row
  const tacticToRow = (tactics: Tactics[]) => (
    tactics.map((tactic) => (
      <Table.Tr key={tactic.ID}>
        <Table.Td>{tactic.ID}</Table.Td>
        <Table.Td>{tactic.blueScore}</Table.Td>
        <Table.Td>{tactic.redScore}</Table.Td>
      </Table.Tr>
    ))
  );

  //sets color of readiness bar in inital display based on readiness value
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
                <SegmentedControl onChange={setQuestion1} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Within logistics support range?</p>
                <SegmentedControl onChange={setQuestion2} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Aware of OPFOR presence?</p>
                <SegmentedControl onChange={setQuestion3} size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Within logistics support range?</p>
                <SegmentedControl onChange={setQuestion4} size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
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
                <SegmentedControl onChange={setQuestion5} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                <p>Working GPS?</p>
                <SegmentedControl onChange={setQuestion6} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
              </Grid.Col>
              <Grid.Col span={6}>
                <h1>Enemy INF-BRIG-C</h1>
                <p>Under ISR coverage?</p>
                <SegmentedControl onChange={setQuestion7} size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                <p>Working GPS?</p>
                <SegmentedControl onChange={setQuestion8} size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
              </Grid.Col>
            </Grid>
            <Group justify="center" mt="xl">
              <Button onClick={prevStep}>Go Back</Button>
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
              <Button onClick={prevStep}>Go Back</Button>
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
              <Button onClick={prevStep}>Go Back</Button>
              <Button onClick={finalizeTactics}>Finalize Tactics</Button>
            </Group>
          </div>
        </Stepper.Step>
        <Stepper.Step allowStepSelect={false} icon={<IconHeartbeat stroke={1.5} style={{ width: rem(35), height: rem(35) }} />}>
          <div>
            <h1>After-Action Review</h1>
            <Text size="xl">Calculated Base Value: {baseValue.toFixed(2)}</Text>
            <Text size="xl">Real-Time Input Score: {calculateRealTimeScore()}</Text>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
              <Card shadow="sm" padding="xl" radius="md" withBorder style={{ width: '600px', marginBottom: '200px', marginTop: '200px' }} display={'flex'}>
                <Card.Section >
                  <div style={{ textAlign: 'center' }}>
                    <h2>Engagement Data</h2>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    Engagement ID:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
                    <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Progress.Section
                        className={classes.progressSection}
                        value={30 * .15}
                        color="#4e87c1">
                      </Progress.Section>


                    </Progress.Root>
                    <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Progress.Section
                        className={classes.progressSection}
                        value={30 * .15}
                        color="#bd3058">
                      </Progress.Section>
                    </Progress.Root>
                  </div>
                  <Table verticalSpacing={'xs'} style={{ width: '600px', justifyContent: 'center' }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Tactic</Table.Th>
                        <Table.Th>Blue Score</Table.Th>
                        <Table.Th>Red Score</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tacticToRow(tactics)}</Table.Tbody>
                  </Table>
                </Card.Section>
              </Card>
            </div>
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
