import React, { useState, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Tree from 'react-d3-tree';
import { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import CardC, { Unit } from './Cards';
import classes from './Cards.module.css';
import { Modal, Select, TextInput, Button, Text, HoverCard } from '@mantine/core';
import axios from 'axios';
import { useUserRole } from '../context/UserContext';
 
const buildHierarchy = (units: Unit[]): RawNodeDatum[] => {
  const unitMap = new Map<string, RawNodeDatum>();
 
  // First pass: Add all units to a map
  units.forEach(unit => {
    unitMap.set(unit.unit_id, {
      name: unit.unit_id,
      attributes: {
        unit_type: unit.unit_type,
        unit_symbol: unit.unit_symbol,
        is_friendly: unit.is_friendly,
        unit_health: unit.unit_health,
        role_type: unit.role_type,
        unit_size: unit.unit_size,
        force_posture: unit.force_posture,
        force_mobility: unit.force_mobility,
        force_readiness: unit.force_readiness,
        force_skill: unit.force_skill,
      },
      children: []
    });
  });
 
  // Second pass: Link children to their parents
  units.forEach(unit => {
    if (unit.children.length > 0) {
      unit.children.forEach(childID => {
        const parent = unitMap.get(unit.unit_id);
        const child = unitMap.get(childID);
        if (parent && child) {
          parent.children!.push(child);
        } else {
          console.error(`Parent or child not found: ParentID = ${unit.unit_id}, ChildID = ${childID}`);
        }
      });
    }
  });
 
  // Return the roots (units without a parent)
  const rootNodes = units.filter(unit => !units.some(u => u.children.includes(unit.unit_id)));
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
    role_type,
    unit_size,
    force_posture,
    force_mobility,
    force_readiness,
    force_skill,
  } = nodeDatum.attributes as any;
 
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
            }}
            stroke="none"
          />
          <image
            href='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png'
            x={-imageSize / 2}
            y={-cardHeight / 2 + 10}
            width={100}
          />
          <text fill="white" x={-cardWidth / 2 + 10} y={cardHeight / 2 - 10} textAnchor="start" stroke="none">
            {nodeDatum.name}
          </text>
        </g>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="sm">
          <strong>Unit ID:</strong> {nodeDatum.name}<br />
          <strong>Type:</strong> {unit_type}<br />
          <strong>Friendly:</strong> {is_friendly ? 'Yes' : 'No'}<br />
          <strong>Health:</strong> {unit_health}<br />
          <strong>Role Type:</strong> {role_type}<br />
          <strong>Unit Size:</strong> {unit_size}<br />
          <strong>Force Posture:</strong> {force_posture}<br />
          <strong>Force Mobility:</strong> {force_mobility}<br />
          <strong>Force Readiness:</strong> {force_readiness}<br />
          <strong>Force Skill:</strong> {force_skill}<br />
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
 
 
 
function Hierarchy() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [tree, setTree] = useState<RawNodeDatum[]>();
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const [formValues, setFormValues] = useState({
    unitName: '',
    unitType: '',
    unitHealth: 100,
    unitRole: '',
    unitSize: '',
    forcePosture: '',
    forceReadiness: '',
    forceSkill: ''
  });
  const [selectedNode, setSelectedNode] = useState('');
 
 
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for section:', userSection);
        const response = await axios.get<Unit[]>(`http://10.0.1.226:5000/api/units/sectionSort`, {
          params: {
            sectionid: userSection,
          }
        });
        const normalizedData = response.data.map(unit => ({
          ...unit,
          children: unit.children || [] // Ensure children is an array
        }));
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [userSection]);
 
  useEffect(() => {
    // Convert the data to the RawNodeDatum format
    if (units.length <= 0) {
      console.log("waiting");
    }
    else {
      const formattedData = buildHierarchy(units);
      setTree(formattedData);
    }
  }, [units]);
 
 
  const handleNodeClick = (nodeData: RawNodeDatum) => {
    setSelectedNode(nodeData.name);
    if (userRole === "Administrator") {
      open();
    }
    else {
 
    }
 
  };
 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    


    try {
      const response = await axios.put(`http://10.0.1.226:5000/api/units/update`, {
        parent_id: selectedNode,
        unit_id: formValues.unitName,
        unit_type: formValues.unitType,
        unit_health: formValues.unitHealth,
        role_type: formValues.unitRole,
        unit_size: formValues.unitSize,
        force_posture: formValues.forcePosture,
        force_readiness: formValues.forceReadiness,
        force_skill: formValues.forceSkill,
      });
  
      if (response.status === 200) {
        // Successfully updated the unit, update the state to reflect the changes
        setUnits(prevUnits => prevUnits.map(unit => unit.unit_id === formValues.unitName ? response.data : unit));
      } else {
        console.error('Failed to update unit:', response);
      }
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  
    // Close the modal
    close();
  };
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.currentTarget;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  };
 
  const handleSelectChange = (value: string | null) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      unitName: value ?? ''
    }));
  };
 
  return (
    <div style={{ width: '100%', height: '100vh' }}>
 
      {tree ? (
        <Tree
          data={tree}
          orientation='vertical'
          nodeSize={{ x: 160, y: 150 }}
          translate={{ x: 1250, y: 70 }}
          collapsible={false}
          pathFunc={'step'}
          zoom={1.2}
          scaleExtent={{ min: 0.5, max: 3 }}
          renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} toggleModal={() => handleNodeClick(rd3tProps.nodeDatum)} />}
          onNodeClick={() => handleNodeClick}
 
 
        />) : (
        <Button onClick={() => handleNodeClick}>Add Parent</Button>
      )
 
      }
 
      <Modal opened={opened} onClose={close} title="Add unit">
        <form onSubmit={handleSubmit}>
          <Select
            label="Unit"
            placeholder="Pick one"
            name='unitName'
            value={formValues.unitName}
            onChange={handleSelectChange}
            data={units.map((unit) => ({ value: unit.unit_id, label: unit.unit_id }))}
          />
 
          <TextInput
            label="Unit Type"
            placeholder="Enter unit type"
            required
            name='unitType'
            mt="md"
            value={formValues.unitType}
            onChange={handleChange}
          />
 
          <TextInput
            label="Unit Health"
            placeholder="Enter unit health"
            required
            name='unitHealth'
            mt="md"
            type='number'
            value={formValues.unitHealth}
            onChange={handleChange}
          />
 
          <TextInput
            label="Unit Role"
            placeholder="Enter unit role"
            required
            name='unitRole'
            mt="md"
            value={formValues.unitRole}
            onChange={handleChange}
          />
 
          <TextInput
            label="Unit size"
            placeholder="Enter unit size"
            required
            name='unitSize'
            mt="md"
            value={formValues.unitSize}
            onChange={handleChange}
          />
 
          <TextInput
            label="Force Posture"
            placeholder="Enter force posture"
            required
            name='forcePosture'
            mt="md"
            value={formValues.forcePosture}
            onChange={handleChange}
          />
 
          <TextInput
            label="Force Readiness"
            placeholder="Enter force readiness"
            required
            name='forceReadiness'
            mt="md"
            value={formValues.forceReadiness}
            onChange={handleChange}
          />
 
          <TextInput
            label="Force Skill"
            placeholder="Enter force skill"
            required
            name='forceSkill'
            mt="md"
            value={formValues.forceSkill}
            onChange={handleChange}
          />
 
          <Button type="submit" mt="md">Submit</Button>
        </form>
      </Modal>
    </div>
  );
}
 
export default Hierarchy;