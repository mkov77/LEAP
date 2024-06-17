import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import { RawNodeDatum, CustomNodeElementProps } from 'react-d3-tree';
import { data } from '../data/units';
import CardC, { Unit } from './Cards';
import classes from './Cards.module.css';
import { Box, Card, Container, Flex, Image, Text, Badge, Button, Group, Grid, Progress, HoverCard } from '@mantine/core';


const buildHierarchy = (units: Unit[]): RawNodeDatum[] => {
    const unitMap = new Map<string, RawNodeDatum>();
  
    // First pass: Add all units to a map
    units.forEach(unit => {
      unitMap.set(unit.unitID, {
        name: unit.unitID,
        attributes: {
           unitType: unit.unitType,
          unitSymbol: unit.unitSymbol,
           isFriendly: unit.isFriendly,
           unitHealth: unit.unitHealth,
           roleType: unit.roleType,
           unitSize: unit.unitSize,
           forcePosture: unit.forcePosture,
           forceMobility: unit.forceMobility,
           forceReadiness: unit.forceReadiness,
           forceSkill: unit.forceSkill,
        },
        children: []
      });
    });
  
    // Second pass: Link children to their parents
    units.forEach(unit => {
      if (unit.children.length > 0) {
        unit.children.forEach(childID => {
          const parent = unitMap.get(unit.unitID);
          const child = unitMap.get(childID);
          if (parent && child) {
            parent.children!.push(child);
          } else {
            console.error(`Parent or child not found: ParentID = ${unit.unitID}, ChildID = ${childID}`);
          }
        });
      }
    });
  
    // Return the roots (units without a parent)
    const rootNodes = units.filter(unit => !units.some(u => u.children.includes(unit.unitID)));
    return rootNodes.map(unit => unitMap.get(unit.unitID)!);
  };
  
  const CustomNode = ({ nodeDatum }: CustomNodeElementProps) => {
    const cardWidth = 140;
    const cardHeight = 110;
    const imageSize = 100;

    const {
      unitType,
      isFriendly,
      unitHealth,
      roleType,
      unitSize,
      forcePosture,
      forceMobility,
      forceReadiness,
      forceSkill,
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
          <strong>Type:</strong> {unitType}<br />
          <strong>Friendly:</strong> {isFriendly ? 'Yes' : 'No'}<br />
          <strong>Health:</strong> {unitHealth}<br />
          <strong>Role Type:</strong> {roleType}<br />
          <strong>Unit Size:</strong> {unitSize}<br />
          <strong>Force Posture:</strong> {forcePosture}<br />
          <strong>Force Mobility:</strong> {forceMobility}<br />
          <strong>Force Readiness:</strong> {forceReadiness}<br />
          <strong>Force Skill:</strong> {forceSkill}<br />
        </Text>
      </HoverCard.Dropdown>
      </HoverCard>
    );
  };
  
  function Hierarchy() {
    const [tree, setTree] = useState<RawNodeDatum[]>();

    useEffect(() => {
      // Convert the data to the RawNodeDatum format
      const formattedData = buildHierarchy(data);
      setTree(formattedData);
    }, []);

    

    return (
      <div style={{ width: '100%', height: '81.5vh' }}>
        {tree && 
        <Tree 
        data={tree}
        orientation='vertical'
        nodeSize={{x: 160, y: 150}}
        translate={{x:1250, y:70}}
        collapsible={false}
        pathFunc={'step'}
        zoom={1.2}
        scaleExtent={{ min: 0.5, max: 3 }}
        renderCustomNodeElement={(rd3tProps) => <CustomNode {...rd3tProps}/>}
         />}
      </div>
    );
  }
  
  export default Hierarchy;