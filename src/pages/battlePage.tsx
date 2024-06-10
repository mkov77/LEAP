import React, { useState } from 'react';
import '../App.css';
import { AppShell, Group, Skeleton, Image, Stepper, Button, SegmentedControl, rem, Modal, useMantineColorScheme, useComputedColorScheme, MantineProvider, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { IconSwords, IconHeartbeat, IconNumber1Small, IconNumber2Small, IconNumber3Small, IconNumber4Small } from '@tabler/icons-react';
import { FaSun, FaMoon } from "react-icons/fa";

function BattlePage() {
  const [mobileOpened] = useDisclosure(false);
  const [desktopOpened] = useDisclosure(false);
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const [active, setActive] = useState(0);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const closeLocation = '/studentPage/' + sectionId;
  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  const nextStep = () => setActive((current) => (current < 6 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <MantineProvider defaultColorScheme='dark'>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Image
              src={null}
              radius="md"
              h={50}
              fallbackSrc="https://placehold.co/600x400?text=Placeholder"
              onClick={handleLogoClick} // Add onClick handler here
              style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
            />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="sm">
          Navbar
          {Array(15)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} h={28} mt="sm" animate={false} />
            ))}
        </AppShell.Navbar>
        <AppShell.Main>
          <div>
            <h1>Welcome to the Battle Page</h1>
            {sectionId && (
              <p>
                You are observing section: <strong>{sectionId}</strong>
              </p>
            )}
          </div>
          <Button onClick={open}>Start Engagement</Button>

          <Modal
            opened={modalOpened}
            onClose={close}
            title="Engagement"
            fullScreen
            withCloseButton={false}
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
            size="lg"
          >
            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
              <Stepper.Step allowStepSelect={false} icon={<IconSwords stroke={1.5} style={{ width: rem(27), height: rem(27) }} />}>
                <div>
                  <p>This is where you'll learn about your friendly and enemy units before they start</p>
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Start Engagement</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Detection" icon={<IconNumber1Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 1: Detection/Target ID</p>
                  <p>Question 1: What is your name?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 2: Are you above 18?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 3: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Question 4: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Continue</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Target Engagement" icon={<IconNumber2Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 2: Target Engagement</p>
                  <p>Question 1: What is your email?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 2: Do you prefer email contact?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 3: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Question 4: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Next Phase</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Damage Assessment" icon={<IconNumber3Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />} >
                <div>
                  <p>Phase 3: Damage Assessment</p>
                  <p>Question 1: How did you hear about us?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 2: Have you used our services before?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 3: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Question 4: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <Group justify="center" mt="xl">
                    <Button onClick={nextStep}>Next Phase</Button>
                  </Group>
                </div>
              </Stepper.Step>
              <Stepper.Step allowStepSelect={false} label="Attrition" icon={<IconNumber4Small stroke={1.5} style={{ width: rem(80), height: rem(80) }} />}>
                <div>
                  <p>Phase 4: Attrition</p>
                  <p>Question 1: Do you agree with the terms and conditions?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 2: Will you recommend us?</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} />
                  <p>Question 3: Pre-populated question (Yes/No)</p>
                  <SegmentedControl color="gray" data={['Yes', 'No']} disabled />
                  <p>Question 4: Pre-populated question (Yes/No)</p>
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
          </Modal>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

      export default BattlePage;
