import React, { useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import '../App.css';
import { Table, Progress, Text, AppShell, Group, Image, Stepper, Button, SegmentedControl, rem, MantineProvider, Grid, Card, Center, Tooltip, useMantineTheme, rgba } from '@mantine/core';
import { useDisclosure, useInterval } from '@mantine/hooks';
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
import { text } from 'node:stream/consumers';


export interface Form {
  ID: string;
  friendlyScore: number;
  enemyScore: number;
}

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
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const theme = useMantineTheme();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Unit[]>('http://10.0.1.226:5000/api/units/sectionSort', {
          params: {
            sectionid: userSection  // Pass userSection as a query parameter
          }
        });
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
    unit_size,
    force_mobility,
    force_readiness,
    force_skill,
    id
  } = unit || {};

  const updateUnitHealth = async (id: number, newHealth: number) => {
    const url = `http://10.0.1.226:5000/api/units/health`; // Corrected URL to point to the server running on port 5000
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, newHealth }), // Send both id and newHealth in the body
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Failed to update unit health: ${response.statusText}`);
      }
      const updatedUnit = await response.json();
      console.log('Updated unit:', updatedUnit);
      return updatedUnit;
    } catch (error) {
      console.error('Error updating unit health:', error);
    }
  };

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

  // This function handles the engagement tactics form submission
  const finalizeTactics = async () => {

    // Dummy data for enemyscore
    const enemyTotalScore = 15;
    const friendlyTotalScore = ((baseValue * .70) + (Number(realTimeScore) * .30));
    const isWin = friendlyTotalScore > enemyTotalScore;
    console.log('ID: ', id);
    updateUnitHealth(Number(id), Number(unit_health) - 10);

    // Process all phase answers here
    console.log('Phase 1 Answers:', question1, question2);
    console.log('Phase 2 Answers:', question3, question4);
    console.log('Phase 3 Answers:', question5, question6);
    console.log('Phase 4 Answers:', question7);
    console.log('RESULTS -> Enemy:', enemyTotalScore, 'Friendly:', friendlyTotalScore, 'Win?:', isWin)

    const score = calculateRealTimeScore();
    setRealTimeScore(score);
    setScoreFinalized(true); // Mark the score as finalized
    // BRING THIS BACK
    // nextStep();

    console.log(unit_id);

    // Prepare data for engagement and tactics
    const engagementData = {
      SectionID: userSection, // Replace with actual SectionID
      FriendlyID: unit_id, // Replace with actual FriendlyID
      EnemyID: unit_id, // Replace with actual EnemyID
      FriendlyBaseScore: baseValue,
      EnemyBaseScore: baseValue,
      FriendlyTacticsScore: realTimeScore,
      EnemyTacticsScore: realTimeScore,
      FriendlyTotalScore: friendlyTotalScore,
      EnemyTotalScore: enemyTotalScore,
      isWin: isWin,
    };

    const tacticsData = {
      FriendlyAwareness: question1 === "Yes" ? 1 : 0,
      EnemyAwareness: question1 === "Yes" ? 1 : 0,
      FriendlyLogistics: question2 === "Yes" ? 1 : 0,
      EnemyLogistics: question2 === "Yes" ? 1 : 0,
      FriendlyCoverage: question3 === "Yes" ? 1 : 0,
      EnemyCoverage: question3 === "Yes" ? 1 : 0,
      FriendlyGPS: question4 === "Yes" ? 1 : 0,
      EnemyGPS: question4 === "Yes" ? 1 : 0,
      FriendlyComms: question5 === "Yes" ? 1 : 0,
      EnemyComms: question5 === "Yes" ? 1 : 0,
      FriendlyFire: question6 === "Yes" ? 1 : 0,
      EnemyFire: question6 === "Yes" ? 1 : 0,
      FriendlyPattern: question7 === "Yes" ? 1 : 0,
      EnemyPattern: question7 === "Yes" ? 1 : 0,
    };

    // Submit answers to backend
    try {
      // Submit engagement data
      const engagementResponse = await fetch('http://10.0.1.226:5000/api/engagements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(engagementData),
      });

      if (!engagementResponse.ok) {
        throw new Error('Failed to create engagement');
      }

      const engagementResult = await engagementResponse.json();
      console.log('Engagement created:', engagementResult);

      // Submit tactics data
      const tacticsResponse = await fetch('http://10.0.1.226:5000/api/tactics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tacticsData),
      });

      if (!tacticsResponse.ok) {
        throw new Error('Failed to record tactics');
      }

      const tacticsResult = await tacticsResponse.json();
      console.log('Tactics recorded:', tacticsResult);

    } catch (error) {
      console.error('Error submitting data:', error);
    }

  }; // End of finalize tactics


  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        finalizeTactics();

        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

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

  let tooltipContentFriendly = 'Total Calculated Value (Friendly): ' + ((Number(realTimeScore) * .30) + (baseValue * .70)).toFixed(2) + '%';

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
  const answers: Form[] = [
    { ID: 'Aware of OPFOR?', friendlyScore: weights.awareOfPresence[question1.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Within Logistics Support Range?', friendlyScore: weights.logisticsSupportRange[question2.toLowerCase() as 'yes' | 'no'], enemyScore: 25 },
    { ID: 'Within RPA/ISR Coverage?', friendlyScore: weights.isrCoverage[question3.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Working GPS?', friendlyScore: weights.gpsWorking[question4.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Working Communications?', friendlyScore: weights.communicationsWorking[question5.toLowerCase() as 'yes' | 'no'], enemyScore: 15 },
    { ID: 'Within Fire Support Range?', friendlyScore: weights.fireSupportRange[question6.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Within Range of a Pattern Force?', friendlyScore: weights.patternForceRange[question7.toLowerCase() as 'yes' | 'no'], enemyScore: 15 }
  ]


  //maps each tactic and its corresponding blue/red score to a row
  const tacticToRow = (answers: Form[]) => (
    answers.map((tactic) => (
      <Table.Tr key={tactic.ID}>
        <Table.Td>{tactic.ID}</Table.Td>
        <Table.Td>{tactic.friendlyScore}</Table.Td>
        <Table.Td>{tactic.enemyScore}</Table.Td>
      </Table.Tr>
    ))
  );

  //sets color of readiness bar in inital display based on readiness
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


  const unitNull = () => {
    console.log("Checking for unit: ", unit_id)
    if (unit_id !== undefined) {
      console.log("Unit found: ", unit_id)
      return true;
    }
  }

  if (unitNull()) {
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
                  <SegmentedControl value={question1} onChange={setQuestion1} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                  <p>Within logistics support range?</p>
                  <SegmentedControl value={question2} onChange={setQuestion2} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
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
                  <SegmentedControl value={question3} onChange={setQuestion3} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                  <p>Working GPS?</p>
                  <SegmentedControl value={question4} onChange={setQuestion4} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
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
                  <SegmentedControl value={question5} onChange={setQuestion5} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                  <p>Within fire support range?</p>
                  <SegmentedControl value={question6} onChange={setQuestion6} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
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
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl value={question7} onChange={setQuestion7} size='xl' radius='xs' color="gray" data={['Yes', 'No']} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <h1>Enemy INF-BRIG-C</h1>
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                </Grid.Col>
              </Grid>
              <Group justify="center" mt="xl">
                <Button onClick={prevStep}>Go Back</Button>

                  <Button
                  
                  className={classes.button}
                  onClick={() => (loaded ? setLoaded(false) : !interval.active && interval.start())}
                  color={loaded ? 'teal' : theme.primaryColor}
                >
                  <div className={classes.label}>    {progress !== 0 ? 'Calculating Scores...' : loaded ? '    Complete    ' : '    Finalize Tactics    '}
                    </div>

                  {progress !== 0 && (
                      <Progress
                        style={{height: '100px', width: '130px'}}
                        value={progress}
                        className={classes.progress}
                        color={rgba(theme.colors.blue[2], 0.35)}
                        radius="xl"
                        // animated={true}
                      />
                    )}
                </Button>               

              </Group>
            </div>
          </Stepper.Step>
          <Stepper.Step allowStepSelect={false} icon={<IconHeartbeat stroke={1.5} style={{ width: rem(35), height: rem(35) }} />}>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>After-Action Review</h1>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Card shadow="sm" padding="xl" radius="md" withBorder style={{ width: '600px', marginBottom: '150px', marginTop: '200px', textAlign: 'center' }} display={'flex'}>
                  <Card.Section >
                    <div style={{ textAlign: 'center' }}>
                      <h2>Engagement Data</h2>
                    </div>
                    <Grid style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Group style={{ flex: 1, textAlign: 'center' }}>
                        <Grid.Col>
                          <Text size="lg">Friendly Baseline Score: </Text>
                          <Text>{baseValue.toFixed(2)}</Text>
                          <Text size="lg">Friendly Tactics Score:</Text>
                          <Text> {calculateRealTimeScore()}</Text>
                        </Grid.Col>
                      </Group>
                      <Group style={{ flex: 1, textAlign: 'center' }}>
                        <Grid.Col>
                          <Text size="lg">Enemy Baseline Score: </Text>
                          <Text >
                            {baseValue.toFixed(2)}
                          </Text>
                          <Text size="lg">Enemy Tactics Score:</Text>
                          <Text> {calculateRealTimeScore()}</Text>
                        </Grid.Col>
                      </Group>
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                          color="#4e87c1">
                          {Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                        </Progress.Section>
                      </Progress.Root>
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                          color="#bd3058">
                          {Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                        </Progress.Section>
                      </Progress.Root>
                    </div>
                    <Table verticalSpacing={'xs'} style={{ width: '600px', justifyContent: 'center' }}>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Tactic</Table.Th>
                          <Table.Th>Friendly Score</Table.Th>
                          <Table.Th>Enemy Score</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{tacticToRow(answers)}</Table.Tbody>
                    </Table>
                  </Card.Section>
                </Card>
              </div>
              <Group justify="center" mt="xl" display={'flex'}>
                <Button
                   onClick={() => { navigate(closeLocation); setSelectedUnit(null) }}>Done
                  {/* {progress !== 0 ? 'Loading...' : loaded ? 'Done' : 'Next Round'} */}
                </Button>
              </Group>
            </div>
          </Stepper.Step>
        </Stepper>
      </MantineProvider>
    );
  }

  else {
    navigate('/')
    return (
      <Text> Error. Rerouting. </Text>
    );
  }
}

export default BattlePage;
