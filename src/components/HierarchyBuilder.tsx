import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';
import { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import CardC, { Unit } from './Cards';
import classes from './Cards.module.css';
import { Box, Card, Container, Flex, Image, Text, Badge, Button, Group, Grid, Progress, HoverCard } from '@mantine/core';
import axios from 'axios';


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

const CustomNode = ({ nodeDatum }: CustomNodeElementProps) => {
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
    <g>
      <rect
        width={cardWidth}
        height={cardHeight}
        x={-cardWidth / 2}
        y={-cardHeight / 2}
        fill="#2E2E2F"
        rx={0} // Square corners
        ry={0}
        style={{
          filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
        }}
        stroke="none" // Remove the border
      />
      <image
        href='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png' // Replace with the actual image URL from attributes
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
    const [tree, setTree] = useState<RawNodeDatum[]>();
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get<Unit[]>('http://10.0.1.226:5000/api/units');
          const normalizedData = response.data.map(unit => ({
            ...unit,
            children: unit.children || [] // Ensure children is an array
          }));
          console.log('Normalized Data:', normalizedData);
          setUnits(normalizedData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, []);

    useEffect(() => {
      // Convert the data to the RawNodeDatum format
      if(units.length <= 0){
        console.log("waiting");
      }
      else{
      const formattedData = buildHierarchy(units);
      setTree(formattedData);
      }
    }, [units]);


  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {tree &&
        <Tree
          data={tree}
          orientation='vertical'
          nodeSize={{ x: 160, y: 150 }}
          translate={{ x: 1250, y: 70 }}
          collapsible={false}
          pathFunc={'step'}
          zoom={1.2}
          scaleExtent={{ min: 0.5, max: 3 }}
          renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps} />}
        />}
    </div>
  );
}

export default Hierarchy;
