import React, { useState } from 'react';
import '../App.css';
import { AppShell, Group, Skeleton, Image, Stepper, Button, SegmentedControl, rem, Modal, useMantineColorScheme, useComputedColorScheme, MantineProvider, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { IconSwords, IconHeartbeat, IconNumber1Small, IconNumber2Small, IconNumber3Small, IconNumber4Small } from '@tabler/icons-react';
import { FaSun, FaMoon } from "react-icons/fa";
import { useUserRole } from '../context/UserContext';

function BattlePage() {
  const [mobileOpened] = useDisclosure(false);
  const [desktopOpened] = useDisclosure(false);
  const navigate = useNavigate();
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const [active, setActive] = useState(0);
  const [modalOpened, { open, close }] = useDisclosure(true);
  const closeLocation = '/studentPage/' + userSection;


  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <MantineProvider defaultColorScheme='dark'>

            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} style={{padding: '20px'}}>
              <Stepper.Step allowStepSelect={false} icon={<IconSwords stroke={1.5} style={{ width: rem(27), height: rem(27) }} />}>
                <div>
                  <p>This is where you'll learn about your friendly and enemy units before they start</p>
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Start Engagement</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Force Strength" icon={<IconNumber1Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 1: Force Strength</p>
                  <p>Aware of OPFOR presence?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Within logistics support range?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Aware of OPFOR presence?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Within logistics support range?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Continue</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Tactical Advantage" icon={<IconNumber2Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 2: Tactical Advantage</p>
                  <p>Under ISR coverage?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Working GPS?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Under ISR coverage?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Working GPS?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Next Phase</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Fire Support" icon={<IconNumber3Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />} >
                <div>
                  <p>Phase 3: Fire Support</p>
                  <p>Working communications?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Within fire support range?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Working communications?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Within fire support range?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Next Phase</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Terrain" icon={<IconNumber4Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 4: Terrain</p>
                  <p>Higher ground?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Higher ground?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Accessible by pattern force?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Next Phase</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} icon={<IconHeartbeat stroke={1.5} style={{ width: rem(35), height: rem(35) }} />}>
                <div>
                  <p>This is where your results will be display.</p>
                  <Group justify="center" mt="xl">
                    <Button onClick={() => { navigate(closeLocation) }}>Done</Button>
                  </Group>
                </div>
              </Stepper.Step>
            </Stepper>
        </MantineProvider>
  );
}

      export default BattlePage;
