// import '../App.css';
// import React, { useEffect } from 'react';
// import CarouselC from '../components/carousel'; // Remove the '.tsx' extension
// import { AppShell, Burger, Group, Skeleton, Image, useMantineColorScheme, useComputedColorScheme, Button, MantineProvider, } from '@mantine/core';
// import { useDisclosure } from '@mantine/hooks';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useUserRole } from '../context/UserContext';
// import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
// import Hierarchy from '../components/HierarchyBuilder';

// function ObserverPage() {
//   const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
//   const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
//   const navigate = useNavigate();
//   const { sectionId } = useParams(); // Retrieve sectionId from route parameters
//   const { userRole, setUserRole, userSection, setUserSection } = useUserRole();

//   useEffect(() => {
//     if (userRole !== 'Observer' || userSection !== userSection) {
//       navigate('/');
//     }
//   }, [navigate, userRole]);

//   const handleLogoClick = () => {
//     navigate('/'); // Navigate to the main login page
//   };


//   const handleArrowClick = () => {
//     navigate('/');
//   };

//   return (
//     <MantineProvider defaultColorScheme='dark'>
//       <AppShell
//         header={{ height: 60 }}
//         navbar={{
//           width: 300,
//           breakpoint: 'sm',
//           collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
//         }}
//         padding="md"
//       >
//         <AppShell.Header>
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//           <Button size='sm' variant='link' onClick={handleArrowClick} style={{ margin: '10px' }}>
//             <FaArrowAltCircleLeft />
//           </Button>
//           <Image
//             src='https://github.com/mkov77/LEAP/blob/main/Tr_FullColor_NoSlogan.png?raw=true'
//             radius="md"
//             h={50}
//             fallbackSrc="https://placehold.co/600x400?text=Placeholder"
//             onClick={handleLogoClick}
//             style={{ cursor: 'pointer', scale: '1', padding:'8px' }}
//           />
//           </div>
//         </AppShell.Header>
//         <AppShell.Main>
//           <div>
//             {sectionId && (
//               <p>
//                 You are observing section: <strong>{sectionId}</strong>
//               </p>
//             )}
//           </div>
//           <div className="App">
//             <Hierarchy is_friendly={true} hierarchyRefresh={0} />
//           </div>
//         </AppShell.Main>
//       </AppShell>
//     </MantineProvider>
//   );
// }

// export default ObserverPage;

/**
 * studentPage.tsx renders the student page where the students can view and start engagements with their units
 */
import '../App.css';
import { AppShell, Image, Button, MantineProvider, Grid } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserRole } from '../context/UserContext';
import { useUnitProvider } from '../context/UnitContext';
import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
import Hierarchy from '../components/HierarchyBuilder';
import Tree from 'react-d3-tree';

// Function where the page renders
function ObserverPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const [hierarchyToggle, setHierarchyToggle] = useState(false);

  // Redirects to the home page if the user is not a 'Student' or if their section ID does not match the current section ID.
  useEffect(() => {
    if (userRole !== 'Observer' || userSection !== sectionId) {
      console.log(`user Role: ${userRole}`);
      console.log(`user section: ${sectionId}`);
      navigate('/');
    }
  }, [navigate, userRole]);

  // Updates the search state with the value from the input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  }

  // Navigate to the main login page
  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  // Navigate to the main login page
  const handleArrowClick = () => {
    navigate('/');
  };

  // Navigate to the After Action Reports page for the current section
  const handleAARClick = () => {
    navigate(`/AAR/${sectionId}`)
  }

  // Where student page renders
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
        {/* Header / Nav bar  */}
        <AppShell.Header>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Back button */}
              <Button size='sm' variant='link' onClick={handleArrowClick} style={{ margin: '10px' }}>
                <FaArrowAltCircleLeft />
              </Button>
              {/* Clickable logo that takes user back to homepage */}
              <Image
                src='https://github.com/mkov77/LEAP/blob/main/Tr_FullColor_NoSlogan.png?raw=true'
                radius="md"
                h={50}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer', scale: '1', padding: '8px' }}
              />
            </div>
          </div>
        </AppShell.Header>

        {/* Everything that isn't the header / nav bar */}
        <AppShell.Main>
          <div style={{ justifyContent: 'right', display: 'flex' }}>
            {/* After action report Button where user can switch views */}
            <Button size='sm' variant='link' onClick={handleAARClick} style={{ margin: '10px ' }}>After Action Reports</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

              {sectionId && (
                <p>
                  You are observing: <strong>{sectionId}</strong>
                </p>
              )}

            </div>

          </div>
          <Grid>
            <Grid.Col span={6} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="App">
                <Hierarchy is_friendly={true} hierarchyRefresh={0} xCoord={650} yCoord={70}/>
              </div>
            </Grid.Col>
            <Grid.Col span={6} style={{justifyContent: 'center', alignItems: 'center' }}>
              <div className="App">
                <Hierarchy is_friendly={false} hierarchyRefresh={0} xCoord={650} yCoord={70} />
              </div>
            </Grid.Col>
          </Grid>
        </AppShell.Main>
      </AppShell>
    </MantineProvider >
  ); // End of return statement
}

export default ObserverPage;
