import React, {useState, useEffect} from 'react';
import Tree from 'react-d3-tree';
import { RawNodeDatum } from 'react-d3-tree';
import { data } from '../data/units';
import CardC, { Unit } from './Cards';
import classes from './Tree.module.css';



const buildHierarchy = (units: Unit[]): RawNodeDatum[] => {
    const unitMap = new Map<string, RawNodeDatum>();
  
    // First pass: Add all units to a map
    units.forEach(unit => {
      unitMap.set(unit.unitID, {
        name: unit.unitID,
        attributes: {
        //   unitType: unit.unitType,
        //   unitSymbol: unit.unitSymbol,
        //   isFriendly: unit.isFriendly,
        //   unitHealth: unit.unitHealth,
        //   roleType: unit.roleType,
        //   unitSize: unit.unitSize,
        //   forcePosture: unit.forcePosture,
        //   forceMobility: unit.forceMobility,
        //   forceReadiness: unit.forceReadiness,
        //   forceSkill: unit.forceSkill,
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
  

  
  function Hierarchy() {
    const [tree, setTree] = useState<RawNodeDatum[]>();

    useEffect(() => {
      // Convert the data to the RawNodeDatum format
      const formattedData = buildHierarchy(data);
      setTree(formattedData);
    }, []);
  
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        {tree && 
        <Tree 
        data={tree}
        orientation='vertical'
        collapsible={false}
        
         />}
      </div>
    );
  }
  
  export default Hierarchy;