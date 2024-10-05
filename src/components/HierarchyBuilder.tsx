import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Tree from 'react-d3-tree';
import { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import { Unit } from './Cards';
import { SegmentedControl, Modal, Tabs, Select, TextInput, Button, Text, HoverCard, Group } from '@mantine/core';
import axios from 'axios';
import { useUserRole } from '../context/UserContext';
import getImageSRC from '../context/imageSrc';
import NodeEditModal from './NodeEditModal';

type UnitAttributes = {
  id: number;
  unit_type: string;
  is_friendly: boolean;
  unit_health: number;
  unit_role: string;
  unit_size: string;
  unit_posture: string;
  unit_mobility: string;
  unit_readiness: string;
  unit_skill: string;
};

type HierarchyProps = {
  is_friendly: boolean;
  hierarchyRefresh: Number;
  xCoord: Number;
  yCoord: Number;
};

const buildHierarchy = (units: Unit[], childrenData: { parent_id: number; child_id: number }[]): RawNodeDatum[] | null => {
  const unitMap = new Map<number, RawNodeDatum>();

  console.log("FIRST PASS");
  // First pass: Add all units to the map
  units.forEach(unit => {
    unitMap.set(unit.unit_id, {
      name: unit.unit_name,
      attributes: {
        unit_type: unit.unit_type,
        is_friendly: unit.is_friendly,
        unit_health: unit.unit_health,
        unit_role: unit.unit_role,
        unit_size: unit.unit_size,
        unit_posture: unit.unit_posture,
        unit_mobility: unit.unit_mobility,
        unit_readiness: unit.unit_readiness,
        unit_skill: unit.unit_skill,
        id: unit.unit_id,
      },
      children: []
    });
  });

  console.log("SECOND PASS");
  // Second pass: Link children to their parents based on the children table data
  // console.log("CHILDREN DATA: ", childrenData);
  // childrenData.forEach(relation => {
  //   const parent = unitMap.get(relation.parent_id);
  //   const child = unitMap.get(relation.child_id);
  //   if (parent && child) {
  //     parent.children!.push(child);
  //   } else {
  //     console.error(`Parent or child not found: ParentID = ${relation.parent_id}, ChildID = ${relation.child_id}`);
  //   }
  // });
  units.forEach(unit => {
    const parent = unitMap.get(unit.unit_id); // Get parent unit from map
    if (unit.children && unit.children.length > 0) {
      // Map child unit_id to their actual objects
      unit.children.forEach(childId => {
        const child = unitMap.get(childId);
        if (parent && child) {
          parent.children!.push(child); // Link the child object
        } else {
          console.error(`Parent or child not found: ParentID = ${unit.unit_id}, ChildID = ${childId}`);
        }
      });
    }
  });

  // Return the roots (units without a parent)
  console.log("CHECKING FOR ROOTS");
  const rootNodes = units.filter(unit => unit.is_root); // Filter units with root attribute true
  if (rootNodes.length === 0) {
    console.log("CHECKING IF ROOT");
    return null; // If no root nodes, return null
  }

  return rootNodes.map(unit => unitMap.get(unit.unit_id)!);
};

const CustomNode = ({ nodeDatum, toggleModal }: CustomNodeElementProps & { toggleModal: () => void }) => {
  const cardWidth = 140;
  const cardHeight = 110;
  const imageSize = 100;

  const {
    unit_type,
    is_friendly,
    unit_health,
    unit_role,
    unit_size,
    unit_posture,
    unit_mobility,
    unit_readiness,
    unit_skill,
  } = nodeDatum.attributes as UnitAttributes;


  return (
    <HoverCard width={280} shadow="md" openDelay={750}>
      <HoverCard.Target>
        <g onClick={toggleModal}>


          <rect
            width={cardWidth}
            height={cardHeight}
            x={-cardWidth / 2}
            y={-cardHeight / 2}
            fill="#2E2E2F"
            rx={0}
            ry={0}
            style={{
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
              zIndex: -1,  // Ensures this element is on top
            }}
            stroke="none"
          />
          <image
            href={getImageSRC(unit_type, is_friendly)}
            x={is_friendly ? -imageSize / 2 + 7.5 : -imageSize / 2.75 + 7.5}
            y={is_friendly ? -cardHeight / 2 + 10 : -cardHeight / 2 + 5}
            width={is_friendly ? 100 : 75}
          />
          <text fill="white" x={((Number(nodeDatum.name.length) / 2) * -9.5) + 7.5} y={cardHeight / 2 - 10} width={40} textAnchor="start" stroke="none">
            {nodeDatum.name}
          </text>

          <rect
            width={15}  // Width of the black rectangle
            height={cardHeight}  // Height of the card
            x={-cardWidth / 2}  // Positioning the rectangle to the left of the card
            y={-cardHeight / 2}  // Aligning the rectangle with the card height
            fill={unit_health >= 75 ? '#6aa84f' : (unit_health >= 50 ? '#f1c232' : (unit_health >= 25 ? '#e69138' : '#cc0000'))}
            rx={0}  // Optional: Rounded corner x-radius
            ry={0}  // Optional: Rounded corner y-radius
            style={{
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',  // Drop shadow effect
              zIndex: 50,  // Ensures this element is on top
            }}
            stroke="none"  // No stroke
          />
          {/* if (unit_health >= 75) {
    healthColor = '#6aa84f';
  } else if (unit_health < 75 && unit_health >= 50) {
    healthColor = '#f1c232';
  } else if (unit_health < 50 && unit_health >= 25) {
    healthColor = '#e69138';
  } else {
    healthColor = '#cc0000';
  } */}

          <rect
            width={15}  // Width of the red rectangle
            height={cardHeight - (unit_health / 100 * cardHeight)}  // Height of the card
            x={-cardWidth / 2}  // Positioning the rectangle next to the black one
            y={-cardHeight / 2}  // Aligning the rectangle with the card height
            fill="black"  // Color of the rectangle
            rx={0}  // Optional: Rounded corner x-radius
            ry={0}  // Optional: Rounded corner y-radius
            style={{
              filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',  // Drop shadow effect
              zIndex: 2,  // Ensures this element is on top of the black rectangle
            }}
            stroke="none"  // No stroke
          />
        </g>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          <strong>Unit ID:</strong> {nodeDatum.name}<br />
          <strong>Type:</strong> {unit_type}<br />
          <strong>Friendly:</strong> {is_friendly ? 'Yes' : 'No'}<br />
          <strong>Health:</strong> {unit_health}<br />
          <strong>Role Type:</strong> {unit_type}<br />
          <strong>Unit Size:</strong> {unit_size}<br />
          <strong>Force Posture:</strong> {unit_posture}<br />
          <strong>Force Mobility:</strong> {unit_mobility}<br />
          <strong>Force Readiness:</strong> {unit_readiness}<br />
          <strong>Force Skill:</strong> {unit_skill}<br />
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};



function Hierarchy({ is_friendly, hierarchyRefresh, xCoord, yCoord }: HierarchyProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  console.log("CHECKING UNITS ", units)
  const [presetUnits, setPresetUnits] = useState<Unit[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [tree, setTree] = useState<RawNodeDatum[] | null>();
  const { userRole, userSection } = useUserRole()
  const [formValues, setFormValues] = useState({
    unit_name: '',
    unit_type: '',
    unit_health: 100,
    unit_role: '',
    unit_size: '',
    unit_posture: '',
    unit_readiness: '',
    unit_skill: '',
    unit_mobility: '',
    is_friendly,
    root: false
  });
  const [selectedNode, setSelectedNode] = useState<number>();
  const [isRoot, setIsRoot] = useState(false);
  const [segmentValues, setSegmentValues] = useState({
    awareness: 1,
    logistics: 1,
    coverage: 1,
    gps: 1,
    comms: 1,
    fire: 1,
    pattern: 1
  });
  const [childrenData, setChildrenData] = useState<Array<{ parent_id: number; child_id: number }>>([]);

  useEffect(() => {
    console.log('reset');
    setTree(null); // Reset tree state to null when is_friendly changes
  }, [is_friendly, hierarchyRefresh]);

  const fetchData = async () => {
    try {
      console.log('Fetching section units for section:', userSection);
  
      const [unitResponse, childrenResponse] = await Promise.all([
        axios.get<Unit[]>(`http://localhost:5000/api/units/sectionNullandAllianceSort`, { 
          params: { sectionid: userSection, isFriendly: is_friendly } 
        }),
        axios.get<{ parent_id: number; child_id: number }[]>(`http://localhost:5000/api/units/children`)
      ]);
  
      const normalizedUnits = unitResponse.data.map(unit => ({
        ...unit,
        children: [] // Start with empty children array
      }));
  
      setUnits(normalizedUnits); // Store the units
  
      // Now fetch children for each unit based on unit_id (parent_id)
      const allChildrenPromises = normalizedUnits.map(unit => 
        axios.get<{ parent_id: number; child_id: number }[]>(`http://localhost:5000/api/units/children`, {
          params: { parent_id: unit.unit_id }
        })
      );
  
      const childrenResponses = await Promise.all(allChildrenPromises);
  
      // Process the children data by storing child unit_ids in the children field
      const updatedUnits = normalizedUnits.map(unit => {
        const unitChildren = childrenResponses
          .find(response => response.data.some(relation => relation.parent_id === unit.unit_id))?.data || [];
        
        return {
          ...unit,
          children: unitChildren.map(relation => relation.child_id) // Store only the child IDs (numbers)
        };
      });
  
      setUnits(updatedUnits); // Update state with units and their children (unit_ids only)
      console.log("Updated Units with Children:", updatedUnits);
  
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };  
  

  const fetchPresetUnits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/preset_units');

      const normalizedData = response.data.map((unit: any) => ({
        unit_name: unit.unit_name,
        unit_type: unit.unit_type,
        is_friendly: unit.is_friendly,
        unit_health: 100, // Default health
        unit_role: unit.unit_role,
        unit_size: unit.unit_size,
        unit_posture: unit.unit_posture,
        unit_mobility: unit.unit_mobility || 'Unknown',
        unit_readiness: unit.unit_readiness,
        unit_skill: unit.unit_skill
      }));

      // Filter preset units based on the is_friendly prop
      const filteredPresetUnits = normalizedData.filter((unit: { is_friendly: boolean; }) => unit.is_friendly === is_friendly);

      console.log("Fetching and filtering preset units");
      console.log(filteredPresetUnits);

      setPresetUnits(filteredPresetUnits); // Set filtered preset units
    } catch (error) {
      console.error('Error fetching preset units:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchPresetUnits();
  }, [userSection, is_friendly]);

  useEffect(() => {
    console.log("units: ", units.length, " and children: ", childrenData.length)
    console.log("HERE HERE HERE HERE HERE HERE HERE");
    if (units.length > 0) {
      console.log("Calling build hiearchy");
      const formattedData = buildHierarchy(units, childrenData);
      setTree(formattedData);
      console.log("this is THE tree: ", tree);
    }
  }, [units, childrenData]);

  const handleNodeClick = (nodeData: RawNodeDatum) => {
    console.log("Node Data:", nodeData); // Log the entire nodeData object
    const attributes = nodeData.attributes as any;

    if (attributes && attributes.id) {
      setSelectedNode(attributes.id);
    } else {
      console.error("Node attributes or ID not found.");
    }

    if (userRole === "Administrator") {
      open();
    }
  };

  const handleParentClick = () => {
    setIsRoot(true);
    open();
  }

  const updateParentNodeChildren = async (parentNodeId: number, newChildId: number) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/section_units/${parentNodeId}/addChild`, {
        childId: newChildId
      });

      if (response.status === 200) {
        console.log(`Child node with ID ${newChildId} added to parent node with ID ${parentNodeId}`);
      } else {
        console.error('Failed to update parent node:', response);
      }
    } catch (error) {
      console.error('Error updating parent node:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const requiredFields = ['unit_name', 'unit_type', 'unit_health', 'unit_role', 'unit_size', 'unit_posture', 'unit_readiness', 'unit_skill'];

    // Check required fields
    for (const field of requiredFields) {
      if (!formValues[field as keyof typeof formValues]) {
        alert(`The field "${field}" is required.`);
        return; // Stop submission if any required field is missing
      }
    }

    try {
      // Step 1: Submit the unit data to the section_units table
      const unitResponse = await axios.post(`http://localhost:5000/api/section_units`, {
        unit_name: formValues.unit_name,
        unit_health: formValues.unit_health,
        unit_type: formValues.unit_type,
        unit_role: formValues.unit_role,
        unit_size: formValues.unit_size,
        unit_posture: formValues.unit_posture,
        unit_mobility: formValues.unit_mobility,
        unit_readiness: formValues.unit_readiness,
        unit_skill: formValues.unit_skill,
        is_friendly: formValues.is_friendly,
        is_root: isRoot,
        section_id: userSection
      });

      if (unitResponse.status === 200 || unitResponse.status === 201) {
        const newNodeID = unitResponse.data.node.unit_id; // Assuming response contains the new node's ID
        console.log('New node added with ID:', newNodeID);

        // Step 2: Submit the tactics data to the section_tactics table
        const tacticsResponse = await axios.post('http://localhost:5000/api/newsectionunit/tactics', {
          awareness: segmentValues.awareness,
          logistics: segmentValues.logistics,
          coverage: segmentValues.coverage,
          gps: segmentValues.gps,
          comms: segmentValues.comms,
          fire: segmentValues.fire,
          pattern: segmentValues.pattern,
        });

        if (tacticsResponse.status === 200 || tacticsResponse.status === 201) {
          console.log('Tactics successfully added for unit ID:', newNodeID);
        } else {
          console.error('Failed to add tactics:', tacticsResponse);
        }

        // Step 3: Update parent node's children if necessary
        if (selectedNode) {
          await updateParentNodeChildren(selectedNode, newNodeID);
        }

        // Step 4: Refresh data after successful submission
        fetchData(); // Refresh the data
      } else {
        console.error('Failed to add unit:', unitResponse);
      }
    } catch (error) {
      console.error('Error adding unit and tactics:', error);
    }

    // Close the modal and reset the form
    close();
    resetForm();
  };

  const resetForm = () => {
    setIsRoot(false);
    setFormValues({
      unit_name: '',
      unit_type: '',
      unit_health: 100,
      unit_role: '',
      unit_size: '',
      unit_posture: '',
      unit_readiness: '',
      unit_skill: '',
      unit_mobility: '',
      is_friendly: is_friendly, // Reset friendly status if it's part of your form
      root: false
    });
    setSegmentValues({
      awareness: 1,
      logistics: 1,
      coverage: 1,
      gps: 1,
      comms: 1,
      fire: 1,
      pattern: 1
    });
  };

  const areRequiredFieldsFilled = () => {
    const requiredFields = ['unit_name', 'unit_type', 'unit_health', 'unit_role', 'unit_size', 'unit_posture', 'unit_readiness', 'unit_skill'];
    return requiredFields.every(field => !!formValues[field as keyof typeof formValues]);
  };

  const handleSegmentChange = (value: string, segmentName: keyof typeof segmentValues) => {
    console.log("handling segment change...?");
    const updatedSegments = { ...segmentValues };

    // Map 'Yes' to 1 and 'No' to 0
    updatedSegments[segmentName] = value === 'Yes' ? 1 : 0;

    setSegmentValues(updatedSegments);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    console.log('handling change..?');
    const { name, value } = event.currentTarget;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleSelectChange = async (value: string | null, name: string) => {
    if (name === 'ID') {
      console.log("handling select change...?");

      const selectedUnit = presetUnits.find(unit => unit.unit_name === value);

      if (selectedUnit) {
        // Auto-populate form fields with the selected unit's data
        setFormValues({
          unit_name: selectedUnit.unit_name,
          unit_type: selectedUnit.unit_type,
          unit_health: 100, // Default value, or use `selectedUnit.unit_health` if available
          unit_role: selectedUnit.unit_role,
          unit_size: selectedUnit.unit_size,
          unit_posture: selectedUnit.unit_posture,
          unit_readiness: selectedUnit.unit_readiness,
          unit_skill: selectedUnit.unit_skill,
          unit_mobility: selectedUnit.unit_mobility,
          is_friendly: is_friendly,
          root: true, // Adjust if needed based on the selected unit
        });

        try {
          // Step 1: Fetch tactics from `preset_tactics` where unit_name matches
          const tacticsResponse = await axios.get(`http://localhost:5000/api/preset_tactics`, {
            params: {
              unit_name: selectedUnit.unit_name,
            }
          });

          if (tacticsResponse.status === 200 && tacticsResponse.data) {
            const presetTactics = tacticsResponse.data.tactics; // Assuming the API response contains tactics data

            console.log("But do we get the tactics? ", tacticsResponse.data.tactics)

            // Step 2: Auto-populate segmentValues (for tactics)
            setSegmentValues({
              awareness: presetTactics.awareness,
              logistics: presetTactics.logistics,
              coverage: presetTactics.coverage,
              gps: presetTactics.gps,
              comms: presetTactics.comms,
              fire: presetTactics.fire,
              pattern: presetTactics.pattern
            });
          } else {
            console.warn("No tactics found for the selected unit.");
          }
        } catch (error) {
          console.error("Error fetching preset tactics:", error);
        }
      }
    } else {
      // Update form values for other fields
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value ?? '',
      }));
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>

      {tree ? (
        <>
          {(userRole === "Administrator" ? <h1>Select a node to edit it</h1> : <></>)}
          <Tree
            data={tree}
            orientation='vertical'
            nodeSize={{ x: 160, y: 150 }}
            translate={{ x: Number(xCoord), y: Number(yCoord) }}
            collapsible={false}
            pathFunc={'step'}
            zoom={1.2}
            scaleExtent={{ min: 0.5, max: 3 }}
            renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} toggleModal={() => handleNodeClick(rd3tProps.nodeDatum)} />}
            onNodeClick={() => handleNodeClick}
          />
        </>
      ) : (
        (userRole === "Administrator" ? <Button onClick={() => handleParentClick()} size='xl' mt='lg' left={6}>Add Parent</Button> : <></>)
      )

      }
      
      <NodeEditModal isOpen={opened} onClose={close} nodeID={Number(selectedNode)} is_friendly={is_friendly} userSection={userSection}/>

      {/* <Modal opened={opened} onClose={close} title="Add Unit">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="unit">
            <Tabs.List>
              <Tabs.Tab value="unit" >
                Unit selection
              </Tabs.Tab>
              <Tabs.Tab value="tactics" >
                Unit Tactics
              </Tabs.Tab>

            </Tabs.List>

            <Tabs.Panel value="unit">

              <Select
                label="Unit ID"
                placeholder="Pick one"
                name="unit"
                required
                searchable
                value={formValues.unit_name.toString()}
                onChange={(value) => handleSelectChange(value, 'ID')}
                data={presetUnits
                  .filter(unit => unit && unit.unit_name) // Filter out invalid units
                  .map(unit => ({
                    value: unit.unit_name, // Set unit name as `value`
                    label: unit.unit_name, // Set unit name as `label`
                  }))}
              />

              <Select
                label="Unit Type"
                placeholder="Enter unit type"
                required
                name='unit_type'
                mt="md"
                value={formValues.unit_type}
                onChange={(value) => handleSelectChange(value, 'unit_type')}
                searchable
                data={[
                  { value: 'Command and Control', label: 'Command and Control' },
                  { value: 'Infantry', label: 'Infantry' },
                  { value: 'Reconnaissance', label: 'Reconnaissance' },
                  { value: 'Armored Mechanized', label: 'Armored Mechanized' },
                  { value: 'Combined Arms', label: 'Combined Arms' },
                  { value: 'Armored Mechanized Tracked', label: 'Armored Mechanized Tracked' },
                  { value: 'Field Artillery', label: 'Field Artillery' },
                  { value: 'Self-propelled', label: 'Self-propelled' },
                  { value: 'Electronic Warfare', label: 'Electronic Warfare' },
                  { value: 'Signal', label: 'Signal' },
                  { value: 'Special Operations Forces', label: 'Special Operations Forces' },
                  { value: 'Ammunition', label: 'Ammunition' },
                  { value: 'Air Defense', label: 'Air Defense' },
                  { value: 'Engineer', label: 'Engineer' },
                  { value: 'Air Assault', label: 'Air Assault' },
                  { value: 'Medical Treatment Facility', label: 'Medical Treatment Facility' },
                  { value: 'Aviation Rotary Wing', label: 'Aviation Rotary Wing' },
                  { value: 'Combat Support', label: 'Combat Support' },
                  { value: 'Sustainment', label: 'Sustainment' },
                  { value: 'Unmanned Aerial Systems', label: 'Unmanned Aerial Systems' },
                  { value: 'Combat Service Support', label: 'Combat Service Support' },
                  { value: 'Petroleum, Oil and Lubricants', label: 'Petroleum, Oil and Lubricants' },
                  { value: 'Sea Port', label: 'Sea Port' },
                  { value: 'Railhead', label: 'Railhead' }
                ]}
              />

              <TextInput
                label="Unit Health"
                placeholder="Enter unit health"
                required
                name='unit_health'
                mt="md"
                type='number'
                value={formValues.unit_health}
                onChange={handleChange}
              />

              <Select
                label="Unit Role"
                placeholder="Enter unit role"
                required
                name='unit_role'
                mt="md"
                value={formValues.unit_role}
                onChange={(value) => handleSelectChange(value, 'unit_role')}
                searchable
                data={[
                  { value: 'Combat', label: 'Combat' },
                  { value: 'Headquarters', label: 'Headquarters' },
                  { value: 'Support', label: 'Support' },
                  { value: 'Supply Materials', label: 'Supply Materials' },
                  { value: 'Facility', label: 'Facility' }
                ]}
              />

              <Select
                label="Unit Size"
                placeholder="Enter unit size"
                required
                name='unit_size'
                mt="md"
                value={formValues.unit_size}
                onChange={(value) => handleSelectChange(value, 'unit_size')}
                searchable
                data={[
                  { value: 'Squad/Team', label: 'Squad/Team' },
                  { value: 'Platoon', label: 'Platoon' },
                  { value: 'Company/Battery', label: 'Company/Battery' },
                  { value: 'Battalion', label: 'Battalion' },
                  { value: 'Brigade/Regiment', label: 'Brigade/Regiment' },
                  { value: 'Division', label: 'Division' },
                  { value: 'Corps', label: 'Corps' },
                  { value: 'UAS (1)', label: 'UAS (1)' },
                  { value: 'Aviation Section (2)', label: 'Aviation Section (2)' },
                  { value: 'Aviation Flight (4)', label: 'Aviation Flight (4)' }
                ]}
              />

              <Select
                label="Force Posture"
                placeholder="Enter force posture"
                required
                name='unit_posture'
                mt="md"
                value={formValues.unit_posture}
                onChange={(value) => handleSelectChange(value, 'unit_posture')}
                data={[
                  { value: 'Offensive Only', label: 'Offensive Only' },
                  { value: 'Defensive Only', label: 'Defensive Only' },
                  { value: 'Offense and Defense', label: 'Offense and Defense' }
                ]}
              />

              <Select
                label="Force Mobility"
                placeholder="Enter force mobility"
                required
                name='unit_mobility'
                mt="md"
                value={formValues.unit_mobility}
                onChange={(value) => handleSelectChange(value, 'unit_mobility')}
                data={[
                  { value: 'Fixed', label: 'Fixed' },
                  { value: 'Mobile (foot)', label: 'Mobile (foot)' },
                  { value: 'Mobile (wheeled)', label: 'Mobile (wheeled)' },
                  { value: 'Mobile (track)', label: 'Mobile (track)' },
                  { value: 'Stationary', label: 'Stationary' },
                  { value: 'Flight (fixed wing)', label: 'Flight (fixed wing)' },
                  { value: 'Flight (rotary wing)', label: 'Flight (rotary wing)' }
                ]}
              />

              <Select
                label="Force Readiness"
                placeholder="Enter force readiness"
                required
                name='unit_readiness'
                mt="md"
                value={formValues.unit_readiness}
                onChange={(value) => handleSelectChange(value, 'unit_readiness')}
                data={[
                  { value: 'Low', label: 'Low' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'High', label: 'High' },
                ]}
              />

              <Select
                label="Force Skill"
                placeholder="Enter force skill"
                required
                name='unit_skill'
                mt="md"
                value={formValues.unit_skill}
                onChange={(value) => handleSelectChange(value, 'unit_skill')}
                data={[
                  { value: 'Untrained', label: 'Untrained' },
                  { value: 'Basic', label: 'Basic' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Elite', label: 'Elite' }
                ]}
              />

            </Tabs.Panel>

            <Tabs.Panel value="tactics">
              <p>Aware of OPFOR presence?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.awareness === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'awareness')}
              />
              <p>Within logistics support range?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.logistics === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'logistics')}
              />
              <p>Under ISR coverage?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.coverage === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'coverage')}
              />
              <p>Working GPS?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.gps === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'gps')}
              />
              <p>Working communications?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.comms === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'comms')}
              />
              <p>Within fire support range?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.fire === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'fire')}
              />
              <p>Accessible by pattern force?</p>
              <SegmentedControl
                size='md'
                radius='xs'
                color="gray"
                data={['Yes', 'No']}
                value={segmentValues.pattern === 1 ? 'Yes' : 'No'} // Bind value
                onChange={(value) => handleSegmentChange(value, 'pattern')}
              />
            </Tabs.Panel>
          </Tabs>
          <Group grow>
            <Button type="submit" mt="md" disabled={!areRequiredFieldsFilled()}>Submit</Button>

          </Group>
        </form>

      </Modal> */}
    </div>
  );
}

export default Hierarchy;