import React, { useEffect, useState } from 'react';
import { Modal, Container, Center, Button, Grid, UnstyledButton, TextInput, Select, Box, Loader, Text, Tabs, SegmentedControl, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { Unit } from './Cards';
import { IconEdit, IconSquarePlus, IconSquareX } from '@tabler/icons-react';

interface NodeEditProps {
    isOpen: boolean;
    onClose: () => void;
    nodeID: number;
    is_friendly: boolean;
    userSection: string;
}



export default function NodeEditModal({ isOpen, onClose, nodeID, is_friendly, userSection }: NodeEditProps) {
    console.log("WE ARE SO OUT HERE. HERE BEING NODE EDIT MODAL.")

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
    const [presetUnits, setPresetUnits] = useState<Unit[]>([]);
    const [segmentValues, setSegmentValues] = useState({
        awareness: 1,
        logistics: 1,
        coverage: 1,
        gps: 1,
        comms: 1,
        fire: 1,
        pattern: 1
    });
    const [addNodeOpened, { open, close }] = useDisclosure(false);
    const [unit, setUnit] = useState<Unit>();
    const [isRoot, setIsRoot] = useState(false);
    const [deleteConfirmOpened, { open: openDeleteConfirm, close: closeDeleteConfirm }] = useDisclosure(false);
    const [editNodeOpened, { open: openEditNode, close: closeEditNode }] = useDisclosure(false);




    useEffect(() => {
        const fetchUnitData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/unit/${nodeID}`);
                console.log("Retrieving unit: ", nodeID);
                const data = response.data[0]; // Accessing data directly from response
                setUnit(data); // Set the fetched data to the unit state
                console.log("Unit updated: ", unit); // Log the new unit data
                console.log("UNIT IS: ", unit?.unit_name)
            } catch (error) {
                console.error('Error fetching unit data:', error);
            }
        };

        // Fetch data when the page is rendered
        fetchUnitData();
    }, [nodeID]); // Optionally include nodeID as a dependency to refetch when it changes  

    // FUNCTION: FETCH PRESET UNITS
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


    // FUNCTION: HANDLE DELETE NODE
    const handleDeleteNode = async () => {
        // try {
        //   const response = await axios.delete(`http://localhost:5000/api/unit/${nodeID}`);
        //   if (response.status === 200) {
        //     console.log('Node deleted successfully');
        //     closeDeleteConfirm(); // Close the confirmation modal
        //     onClose(); // Close the main modal
        //   }
        // } catch (error) {
        //   console.error('Error deleting node:', error);
        // }

        console.log("hmmm yeah this will delete one of these days")
        closeDeleteConfirm();
        onClose();
    };


    // FUNCTION HANDLE SELECT CHANGE
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

    //   FUNCTION: HANDLE SUBMIT
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
                if (nodeID) {
                    await updateParentNodeChildren(nodeID, newNodeID);
                }
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

    // FUNCTION: UPDATE PARENT NODE CHILDREN
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

    // FUNCTION: RESET FORM
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

    // FUNCTION: HANDLE CHANGE
    const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        console.log('handling change..?');
        const { name, value } = event.currentTarget;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    };

    // FUNCTION: HANDLE SEGMENT CHANGE
    const handleSegmentChange = (value: string, segmentName: keyof typeof segmentValues) => {
        console.log("handling segment change...?");
        const updatedSegments = { ...segmentValues };

        // Map 'Yes' to 1 and 'No' to 0
        updatedSegments[segmentName] = value === 'Yes' ? 1 : 0;

        setSegmentValues(updatedSegments);
    };


    return (
        <>
            <Modal opened={isOpen} onClose={onClose} title={unit?.unit_name + " Options"} centered>
                <Container mt={10}>
                    <Grid grow justify="space-around" align="stretch" mb={20} mt={20} >
                        {/* <Card><IconSquarePlus /><Text>Add Child</Text></Card>
                <Card><IconEdit /><Text>Edit Node</Text></Card>

                <Card><IconSquareX /><Text>Delete Node</Text></Card> */}

                        {/* Add Node */}
                        <UnstyledButton onClick={open} p={10} style={{ borderRadius: 5, backgroundColor: '#3b3b3b' }}>
                            <Center>
                                <IconSquarePlus size="50" strokeWidth="1.5" />
                            </Center>

                            <Text size="lg" m={5}>
                                Add Child
                            </Text>
                        </UnstyledButton>
                        
                        {/* Edit Node */}
                        <UnstyledButton onClick={openEditNode} p={10} style={{ borderRadius: 5, backgroundColor: '#3b3b3b' }} >
                            <Center>
                                <IconEdit size="50" strokeWidth="1.5" />
                            </Center>

                            <Text size="lg" m={5}>
                                Edit Node
                            </Text>
                        </UnstyledButton>

                        {/* Delete Node */}
                        <UnstyledButton
                            onClick={openDeleteConfirm}
                            p={10}
                            style={{ borderRadius: 5, backgroundColor: '#e03131' }}
                        >
                            <Center>
                                <IconSquareX size="50" strokeWidth="1.5" />
                            </Center>
                            <Text size="lg" m={5}>
                                Delete Node
                            </Text>
                        </UnstyledButton>



                    </Grid>
                </Container>

            </Modal>

            <Modal opened={addNodeOpened} onClose={close} title={"Add child to " + unit?.unit_name}>
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
                        {/* <Button type="submit" mt="md" disabled={!areRequiredFieldsFilled()}>Submit</Button> */}

                    </Group>
                </form>

            </Modal>


            <Modal opened={deleteConfirmOpened} onClose={closeDeleteConfirm} title="Confirm Deletion" centered>
                <Box>
                    <Text>This action will delete {unit?.unit_name} and all of its children.</Text>
                    <Group mt="md">
                        <Button color="gray" onClick={closeDeleteConfirm}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={handleDeleteNode}>
                            Delete
                        </Button>
                    </Group>
                </Box>
            </Modal>

            <Modal opened={editNodeOpened} onClose={closeEditNode} title={"Edit " + unit?.unit_name}>
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
                        {/* <Button type="submit" mt="md" disabled={!areRequiredFieldsFilled()}>Submit</Button> */}

                    </Group>
                </form>
            </Modal>

        </>

    );
}
