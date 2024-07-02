/** BattlePage.tsx takes in a unit from the studentPage.tsx and conducts an engagement with an enemy unit that a cadet selects
The engagement continues until either the friendly or enemy unit dies and the information is logged in the After Action Reviews Page **/

import React, { useEffect, useState } from 'react';
import '@mantine/core/styles.css';
import '../App.css';
import { Table, Progress, Text, AppShell, Group, Image, Stepper, Button, SegmentedControl, rem, MantineProvider, Grid, Card, Center, Select, useMantineTheme, rgba, Tooltip } from '@mantine/core';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { IconSwords, IconHeartbeat, IconNumber1Small, IconNumber2Small, IconNumber3Small, IconNumber4Small } from '@tabler/icons-react';
import { FaSun, FaMoon } from "react-icons/fa";
import { useUserRole } from '../context/UserContext';
import { UnitProvider, useUnitProvider } from '../context/UnitContext';
import { Unit } from '../components/Cards';
import classes from './battlePage.module.css';
import axios from 'axios';
import getImageSRC from '../context/imageSrc';


// The interface that is used to take in and send variables for the tactics tables
export interface Form {
  ID: string;
  friendlyScore: number;
  enemyScore: number;
}

function BattlePage() {
  //Initializes global variables
  const navigate = useNavigate(); // A way to navigate to different pages
  const { userSection } = useUserRole(); // Tracks the class section
  const [active, setActive] = useState(0);
  const closeLocation = '/studentPage/' + userSection; // A way to navigate back to the correct section of the student page
  const { selectedUnit, setSelectedUnit } = useUnitProvider(); // Tracks the selected unit for an engagement
  const [baseValue, setBaseValue] = useState<number>(0); // State to track the base value (based on characteristics of each individual unit) of a unit
  const [realTimeScore, setRealTimeScore] = useState<number | null>(null); // State to track the real time (tactics) score of a unit
  const [scoreFinalized, setScoreFinalized] = useState(false); // State to track if score has been finalized

  const [units, setUnits] = useState<Unit[]>([]);
  const [progress, setProgress] = useState(0); // Used to calculate the progress of the animation for the finalize tactics button
  const [loaded, setLoaded] = useState(false);
  const theme = useMantineTheme();
  const [friendlyHealth, setFriendlyHealth] = useState<number>(0); // Variables for setting and getting the friendly unit health
  const [enemyHealth, setEnemyHealth] = useState<number>(0); // Variables for setting and getting the enemy unit health
  const [enemyUnit, setEnemyUnit] = useState<Unit | null>(null); // Variables for setting and getting the enemy unit
  const [inEngagement, setInEngagement] = useState<Boolean>(false); // Used to track whether a unit is in an engagement or not
  const [round, setRound] = useState<number>(1); // Sets the round number for each round of the engagement
  const [totalEnemyDamage, setTotalEnemyDamage] = useState<number>(0);
  const [totalFriendlyDamage, setTotalFriendlyDamage] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);


  // Fetches data of the units based on class section
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


  // initializes the characteristics of each unit
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


  // function to update unit health after each round of an engagement
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

  // function for the button (either 'Next Round' or 'Done') that moves an engagement from one round to another based on health of both the enemy and friendly units
  const handleNextRound = (currentFriendlyHealth: number, currentEnemyHealth: number) => {
    console.log("Handling Next Round");
    console.log("1-- Friendly Health: ", friendlyHealth, " Enemy Health: ", enemyHealth)
    if (currentEnemyHealth > 0 && currentFriendlyHealth > 0) {
      setActive(0);
      setLoaded(false);
    } else {
      updateUnitHealth(Number(id), 0);
      console.log("Current unit health:", unit_health);
      console.log("2-- Friendly Health: ", friendlyHealth, " Enemy Health: ", enemyHealth);
      setSelectedUnit(null);
      navigate(closeLocation);
    }
  }

  //function that selects an enemy unit when it is clicked on to start an engagement
  const handleSelectEnemy = () => {
    if (enemyUnit === null) {
      setEnemyUnit(selectedUnit);
    } else {
      //sets the enemy unit to null after an engagement is done to avoid a glitch that allowed a dead unit to participate in an engagement
      setEnemyUnit(null);
    }
  }

  //handler function to start an engagement and move into the yes/no question pages
  const handleStartEngagement = () => {
    setInEngagement(true);
    nextStep();
  }

  //function that calculates the base value based on the overall characteristics of a unit
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

    // Overall equation to calculate the base score based on different weight values
    const baseValue = 0.15 * typeValue + 0.02 * roleValue + 0.25 * sizeValue + 0.10 * postureValue +
      0.10 * mobilityValue + 0.04 * readinessValue + 0.04 * skillValue;

    return baseValue;
  };

  //calls the calculateBaseValue() equation and initializes health variables for each unit and ensures that each unit is not currently in an engagement
  useEffect(() => {
    if (unit) {
      const calculatedValue = calculateBaseValue(unit);
      setBaseValue(calculatedValue);

      // Set initial friendlyHealth based on unit_health
      setFriendlyHealth(unit.unit_health ?? 0);
      // Set initial enemyHealth based on enemy unit health
      setEnemyHealth(unit.unit_health ?? 0);
      // Set initial inEngagement to false
      setInEngagement(false);

    }
  }, [unit]);

  //function to move to the next set of questions or backwards in the yes/no questions sections
  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));


  //sets the values for each of the tactics
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

    console.log("total friendly damage: ", totalFriendlyDamage);

    // Dummy data for enemyscore
    const enemyTotalScore = 15;

    // Calculates the total friendly score which is 70% of the base value plue 30% of the tactics value
    const friendlyTotalScore = ((baseValue * .70) + (Number(realTimeScore) * .30));

    // Checks whether the friendly unit won the engagement or not
    const isWin = friendlyTotalScore > enemyTotalScore;

    // 'r' generates a random number 
    let r = Math.floor(Math.random() * (5 - 0 + 1)) + 0;

    console.log("R: ", r);

    // Initializes 'b' to zero. 'b' is the variable for the range of weapons given for each unit type
    let b = 0;

    console.log("Unit Type: ", unit_type);

    // These are based on values given by Lt. Col. Rayl
    if (unit_type === 'Armored Mechanized' || unit_type === 'Armored Mechanized Tracked' || unit_type === 'Field Artillery') {
      b = 20;
    }
    else if (unit_type === 'Air Defense') {
      b = 50;
    }
    else if (unit_type === 'Infantry') {
      b = 3;
      console.log('we are here!')
    }
    else if (unit_type === 'Reconnaissance' || unit_type === 'Unmanned Aerial Systems') {
      b = 5;
    }
    else if (unit_type === 'Combined Arms') {
      b = 30;
    }
    else if (unit_type === 'Self-propelled' || unit_type === 'Electronic Warfare' || unit_type === 'Air Assault' || unit_type === 'Aviation Rotary Wing') {
      b = 15;
    }
    else if (unit_type === 'Signal' || unit_type === 'Special Operations Forces') {
      b = 10;
    }
    else {
      b = 0;
    }

    // Calculates the damage previously done to the friendly unit
    let prevFriendlyDamage = Math.exp(-((r ^ 2) / (2 * (b ^ 2))));

    console.log("prev damage: ", prevFriendlyDamage);

    // Calculates the maximum damage that the friendly striking unit can inflict in a particular engagement
    let maxFriendlyDamage = .5 * Number(unit_health);

    console.log("max friendly damage: ", maxFriendlyDamage);

    // Calculates the overall damage to the friendly unit
    setTotalFriendlyDamage(maxFriendlyDamage * prevFriendlyDamage);

    console.log("total friendly damage: ", totalFriendlyDamage);

    // Subtracts the total damage from the previous friendly health in order to set a new health for the friendly unit
    setFriendlyHealth(Math.round((Number(friendlyHealth)) - (maxFriendlyDamage * prevFriendlyDamage)));

    // Calculates the maximum damage that the enemy striking unit can inflict in a particular engagement
    let maxEnemyDamage = .5 * Number(unit_health);

    // Calculates the damage previously done to the enemy unit
    let prevEnemyDamage = Math.exp(-((r ^ 2) / (2 * (b ^ 2))));

    // Calculates the overall damage to the enemy unit and sets it to the totalEnemyDamage variable
    setTotalEnemyDamage(25);
    // maxEnemyDamage * prevEnemyDamage
    console.log("ENEMY DAMAGE TOTAL: ", totalEnemyDamage);

    // Subtracts the total damage from the previous enemy health in order to set a new health for the enemy unit
    setEnemyHealth(Math.round((Number(enemyHealth)) - totalEnemyDamage));

    console.log("Total friendly damage: ", totalFriendlyDamage, " Total enemy damage: ", totalEnemyDamage)
    console.log("TESTING HERE! Friendly Health: ", friendlyHealth, " Enemy Health: ", enemyHealth)
  

    // Calls the function that calculates the score for each unit and sets the score as finalized
    const score = calculateRealTimeScore();
    setRealTimeScore(score);
    setScoreFinalized(true); // Mark the score as finalized

    setRound(round + 1); // Updates the round as the scores are finalized

   console.log(unit_id);

    // Prepare data for engagement and tactics
    const engagementData = {
      SectionID: userSection,
      FriendlyID: unit_id,
      EnemyID: unit_id,
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


  const friendlyTooltip = (
    <div>
      <Text>Damage to Friendly Health: {Number(totalFriendlyDamage).toFixed(0)}</Text>
    </div>
  );

  const enemyTooltip = (
    <div>
      <Text>Damage to Enemy Health: {totalEnemyDamage.toFixed(0)}</Text>
    </div>
  );

  // This is the intervale for the Finalize Tactics button animation
  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);

        nextStep();

        return 0;
      }),
    40
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

  // Defines the keys for the different tactics to assign to different weights
  type WeightKeys = 'awareOfPresence' | 'logisticsSupportRange' | 'isrCoverage' | 'gpsWorking' | 'communicationsWorking' | 'fireSupportRange' | 'patternForceRange';

  // Calculates the score based on different tactics for each engagement
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


  // Printing scores into the Engagement Data card in AAR
  const answers: Form[] = [
    { ID: 'Aware of OPFOR?', friendlyScore: weights.awareOfPresence[question1.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Within Logistics Support Range?', friendlyScore: weights.logisticsSupportRange[question2.toLowerCase() as 'yes' | 'no'], enemyScore: 25 },
    { ID: 'Within RPA/ISR Coverage?', friendlyScore: weights.isrCoverage[question3.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Working GPS?', friendlyScore: weights.gpsWorking[question4.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Working Communications?', friendlyScore: weights.communicationsWorking[question5.toLowerCase() as 'yes' | 'no'], enemyScore: 15 },
    { ID: 'Within Fire Support Range?', friendlyScore: weights.fireSupportRange[question6.toLowerCase() as 'yes' | 'no'], enemyScore: 0 },
    { ID: 'Within Range of a Pattern Force?', friendlyScore: weights.patternForceRange[question7.toLowerCase() as 'yes' | 'no'], enemyScore: 15 }
  ]


  // Maps each tactic and its corresponding blue/red score to a row
  const tacticToRow = (answers: Form[]) => (
    answers.map((tactic) => (
      <Table.Tr key={tactic.ID}>
        <Table.Td>{tactic.ID}</Table.Td>
        <Table.Td>{tactic.friendlyScore}</Table.Td>
        <Table.Td>{tactic.enemyScore}</Table.Td>
      </Table.Tr>
    ))
  );

  // Sets value of readiness bar in inital display based on readiness level that is initialized
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

  // Sets value of skill bar in intial display based on skill level thtat is intialized
  const getForceSkill = (force_skill: string | undefined) => {
    switch (force_skill) {
      case 'Untrained':
        return 0;
      case 'Basic':
        return 33;
      case 'Advanced':
        return 66;
      case 'Elite':
        return 100;
      default:
        return <div>Error: Invalid Force Skill</div>
    }
  }


  // Sets color of Force Readiness bar on the initial engagement page based on initialized readiness value
  const CustomProgressBarReadiness = ({ value }: { value: number }) => {
    let color = 'blue';

    // Set color based on value for readiness
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

  // Sets color of the Force Skill bar on the initial engagement page based on initialized skill value
  const CustomProgressBarSkill = ({ value }: { value: number }) => {
    let color = 'blue';

    // Set color based on value for readiness
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

  // Sets color of the Unit Health bar on the initial engagement page based on the initialized health value
  // Color may change after each round as each unit's health decreases
  const CustomProgressBarHealth = ({ value }: { value: number }) => {
    let color = 'blue';

    // Set color based on value for readiness
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

  const displayWinner = (friendlyHealth: number, enemyHealth: number): string => {
    if (friendlyHealth <= 0 || enemyHealth <= 0) {
      return friendlyHealth > enemyHealth ? 'Friendly Won' : 'Enemy Won';
    }
    return 'Round Summary';
  };


  // Checks that there is a unit to run an engagement
  const unitNull = () => {
    if (unit_id !== undefined) {
      // console.log("Unit found: ", unit_id)
      return true;
    }
  }

  // Starts the battle page if a unit has been selected
  if (unitNull()) {
    return (
      <MantineProvider defaultColorScheme='dark'>
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} style={{ padding: '20px' }}>
          <Stepper.Step allowStepSelect={false} icon={<IconSwords stroke={1.5} style={{ width: rem(27), height: rem(27) }} />}>
            <h1 style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>Round: {round} {totalFriendlyDamage}</h1>
            <div>
              <Grid justify='center' align='flex-start' gutter={100}>
                <Grid.Col span={4}>
                  <Card withBorder radius="md" className={classes.card} >
                    <Card.Section className={classes.imageSection} mt="md" >
                      {/* Military icon for the selected friendly unit */}
                      <Group>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                          <Image
                            src={getImageSRC((unit_type ?? '').toString(), true)}
                            height={160}
                            style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>
                      </Group>
                    </Card.Section>

                    {/* Displays a card that contains pertinent information about the selected friendly unit */}
                    <Card.Section className={classes.section}><h2>{selectedUnit}</h2></Card.Section>
                    {unit ? (
                      <Text size="xl" style={{ whiteSpace: 'pre-line' }}>
                        <strong>Type:</strong> {unit_type}<br />
                        <strong>Unit Size:</strong> {unit_size}<br />
                        <strong>Force Mobility:</strong> {force_mobility}<br />
                        <strong>Health:</strong> {friendlyHealth}<br />
                        <CustomProgressBarHealth value={Number(friendlyHealth)} />

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


                {/* Displays a card that contains pertinent information about the selected enemy unit */}
                <Grid.Col span={4}>
                  {enemyUnit ? (
                    <Card withBorder radius="md" className={classes.card} >
                      <Card.Section className={classes.imageSection} mt="md" >
                        {/* Military icon for the selected enemy unit */}
                        <Group>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Image
                              src={getImageSRC((unit_type ?? '').toString(), false)}
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
                          <strong>Health:</strong> {enemyHealth}<br />
                          <CustomProgressBarHealth value={Number(enemyHealth)} />

                          <strong>Force Readiness:</strong> {force_readiness}<br />
                          <CustomProgressBarReadiness value={Number(getReadinessProgress(force_readiness))} />

                          <strong>Force Skill:</strong> {force_skill}<br />
                          <CustomProgressBarSkill value={Number(getForceSkill((force_skill)))} />

                        </Text>
                      ) : (
                        <Text size="sm">Unit not found</Text>
                      )}
                    </Card>
                  )
                    :
                    // Drop down menu to select the proper enemy unit to begin an engagement with
                    (<Select
                      label="Select Enemy Unit"
                      placeholder='Select Enemy Unit'
                      data={['INF-BRIG-B', 'ARTY-PLT-C', 'INF-PLT-G', 'INF-BRIG-A']}
                      searchable
                      onChange={handleSelectEnemy}
                    >
                    </Select>
                    )
                  }
                </Grid.Col>
              </Grid>

              {/* Buttons to start and engagement or deselect the previously selected enemy unit */}
              <Group justify="center" mt="xl">
                {(!inEngagement && enemyUnit) ?
                  (<Button onClick={handleSelectEnemy} disabled={enemyUnit ? false : true} color='red'>Deselect Enemy Unit</Button>) :
                  (<></>)
                }
                <Button onClick={handleStartEngagement} disabled={enemyUnit ? false : true}>{inEngagement ? 'Start Round' : 'Start Engagement'}</Button>
              </Group>
            </div>
          </Stepper.Step>

          {/* This begins the yes/no pages for the students to answer about individual tactics*/}
          {/* Phase 1 questions about OPFOR and logistics support */}
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

              {/* Button to continue to the next page */}
              <Group justify="center" mt="xl">
                <Button onClick={nextStep}>Continue</Button>
              </Group>

            </div>
          </Stepper.Step>

          {/* Phase 2 questions about ISR coverage and GPS*/}
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

              {/* Separate buttons to continue or return to previous page */}
              <Group justify="center" mt="xl">
                <Button onClick={prevStep}>Go Back</Button>
                <Button onClick={nextStep}>Next Phase</Button>
              </Group>
            </div>
          </Stepper.Step>

          {/* Phase 3 questions about communications and fire support range */}
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

              {/* Separate buttons to go back or continue to the next page */}
              <Group justify="center" mt="xl">
                <Button onClick={prevStep}>Go Back</Button>
                <Button onClick={nextStep}>Next Phase</Button>
              </Group>
            </div>
          </Stepper.Step>

          {/* Phase 4 question about the unit being accessible by a pattern force */}
          <Stepper.Step allowStepSelect={false} label="Terrain" icon={<IconNumber4Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
            <div>
              <p>Phase 4: Terrain</p>
              <Grid>
                <Grid.Col span={6}>
                  <h1>Friendly {selectedUnit}</h1>
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl value={question7} onChange={setQuestion7} size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled={progress !== 0} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <h1>Enemy INF-BRIG-C</h1>
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl size='xl' radius='xs' color="gray" data={['Yes', 'No']} disabled />
                </Grid.Col>
              </Grid>
              <Group justify="center" mt="xl">

                {/* Button to go back */}
                <Button onClick={prevStep} disabled={progress !== 0}>Go Back</Button>

                {/* Finalize Score button that includes a animated progress bar to visually slow down the calculations to the cadet*/}
                <Button
                  className={classes.button}
                  onClick={() => {
                    if (!interval.active) {
                      interval.start();
                    }
                    console.log("Trying this out pls pls: ", totalFriendlyDamage);
                    finalizeTactics();
                    console.log("total friendly damage: ", totalFriendlyDamage);
                  }}
                  color={theme.primaryColor}
                >
                  <div className={classes.label}>    {progress !== 0 ? 'Calculating Scores...' : loaded ? 'Complete' : 'Finalize Tactics'}</div>
                  {progress !== 0 && (
                    <Progress
                      style={{ height: '100px', width: '200px' }}
                      value={progress}
                      className={classes.progress}
                      color={rgba(theme.colors.blue[2], 0.35)}
                      radius="0px"
                    />
                  )}
                </Button>
              </Group>
            </div>
          </Stepper.Step>
          {/* Dnd of yes/no questions for cadets */}


          {/* Displays the round summary page with comparisons between friendly and enemy units */}
          <Stepper.Step allowStepSelect={false} icon={<IconHeartbeat stroke={1.5} style={{ width: rem(35), height: rem(35) }} />}>
            <div>
              <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{((Number(friendlyHealth) <= 0) || (Number(enemyHealth) <= 0)) ? displayWinner(Number(friendlyHealth), Number(enemyHealth)) : 'Round '+ (round - 1) + ' After-Action Report'}</h1>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Card shadow="sm" padding="xl" radius="md" withBorder style={{ width: '600px', marginBottom: '200px', marginTop: '200px', textAlign: 'center' }} display={'flex'}>
                  <Card.Section >
                    <div style={{ textAlign: 'center' }}>
                      <h2>{((Number(friendlyHealth) <= 0) || (Number(enemyHealth) <= 0)) ? 'Final Round' : 'Round Summary'}</h2>
                    </div>

                    {/* This displays the round summary based on calculations for tactics and overall unit characteristics for the friendly units */}
                    <Grid style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Group style={{ flex: 1, textAlign: 'center' }}>
                        <Grid.Col>
                          <Text size="lg">Friendly Baseline Score: </Text>
                          <Text>{baseValue.toFixed(2)}</Text>
                          <Text size="lg">Friendly Tactics Score:</Text>
                          <Text> {calculateRealTimeScore()}</Text>
                          <Text size="lg">Friendly Damage Taken:</Text>
                          <Text> {Number(totalFriendlyDamage).toFixed(0)}</Text>
                        </Grid.Col>
                      </Group>

                      {/* This displays the round summary based on calculations for tactics and overall unit characteristics for the enemy units */}
                      <Group style={{ flex: 1, textAlign: 'center' }}>
                        <Grid.Col>
                          <Text size="lg">Enemy Baseline Score: </Text>
                          <Text >
                            {baseValue.toFixed(2)}
                          </Text>
                          <Text size="lg">Enemy Tactics Score:</Text>
                          <Text> {calculateRealTimeScore()}</Text>
                          <Text size="lg">Enemy Damage Taken:</Text>
                          <Text> {totalEnemyDamage.toFixed(0)}</Text>
                        </Grid.Col>
                      </Group>
                    </Grid>

                    {/* Displays a progress bar with the total score (overall characteristics and tactics) for the friendly unit */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                        <Tooltip
                          position="top"
                          transitionProps={{ transition: 'fade-up', duration: 300 }}
                          label="Overall Score Out of 100"
                        >
                          <Progress.Section
                            className={classes.progressSection}
                            value={Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                            color="#4e87c1">
                            {Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                          </Progress.Section>
                        </Tooltip>
                      </Progress.Root>

                      {/* Displays a progress bar with the total score (overall characteristics and tactics) for the enemy unit */}
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Tooltip
                          position="top"
                          transitionProps={{ transition: 'fade-up', duration: 300 }}
                          label="Overall Score Out of 100"
                        >
                          <Progress.Section
                            className={classes.progressSection}
                            value={Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                            color="#bd3058">
                            {Math.round((baseValue * .70) + (Number(realTimeScore) * .30))}
                          </Progress.Section>
                        </Tooltip>
                      </Progress.Root>
                    </div>

                    {/* Displays a table with the scoring of each tactic of both friendly and enemy units */}
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

              {/* Button that either moves the engagement to the next round or ends the engagement based off of friendly and enemy health */}
              <Group justify="center" mt="xl" display={'flex'}>
                <Button display='flex' onClick={() => handleNextRound(Number(friendlyHealth), Number(enemyHealth))}>
                  {((Number(friendlyHealth) <= 0) || (Number(enemyHealth) <= 0)) ? 'Done' : 'Continue Enagement'}
                </Button>
              </Group>
            </div>
          </Stepper.Step>
        </Stepper>
      </MantineProvider>
    );
  }
  // End of the rendering of the battle page

  // If there is no selected unit, navigate back to the home page
  // Deals with an issue with the refresh button
  else {
    navigate('/')
    return (
      <Text> Error. Rerouting. </Text>
    );
  }
}

export default BattlePage;

