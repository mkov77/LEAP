import { type Engagement} from '../pages/sectionControls';


/**
 * export interface engagement {
    engagementID: string;
    sectionID: string;
    timeStamp: string;
    friendlyID: string;
    enemyID: string;
    isWin: string;
    friendlyHealth: number;
    enemyHealth: number;
  }
 */

// Sections dummy data
export const engagements: Engagement[] = [
  {
    engagementID: "eng001",
    sectionID: "M6A",
    timeStamp: "2024-06-06T08:30:00Z",
    friendlyID: "F1001",
    enemyID: "E1001",
    isWin: true,
    isCurrentState: true,
    friendlyHealth: 75,
    enemyHealth: 0,
  },
  {
    engagementID: "eng002",
    sectionID: "M6A",
    timeStamp: "2024-06-06T09:00:00Z",
    friendlyID: "F1002",
    enemyID: "E1002",
    isWin: false,
    isCurrentState: false,
    friendlyHealth: 0,
    enemyHealth: 30,
  },
  {
    engagementID: "eng003",
    sectionID: "M6A",
    timeStamp: "2024-06-06T09:30:00Z",
    friendlyID: "F1003",
    enemyID: "E1003",
    isWin: true,
    isCurrentState: false,
    friendlyHealth: 50,
    enemyHealth: 0,
  },
    {
      engagementID: "eng004",
      sectionID: "T4A",
      timeStamp: "2024-06-06T10:00:00Z",
      friendlyID: "F2001",
      enemyID: "E2001",
      isWin: false,
      isCurrentState: true,
      friendlyHealth: 10,
      enemyHealth: 20,
    },
    {
      engagementID: "eng005",
      sectionID: "T4A",
      timeStamp: "2024-06-06T10:30:00Z",
      friendlyID: "F2002",
      enemyID: "E2002",
      isWin: true,
      isCurrentState: false,
      friendlyHealth: 60,
      enemyHealth: 0,
    },
    {
      engagementID: "eng006",
      sectionID: "T4A",
      timeStamp: "2024-06-06T11:00:00Z",
      friendlyID: "F2003",
      enemyID: "E2003",
      isWin: true,
      isCurrentState: false,
      friendlyHealth: 80,
      enemyHealth: 0,
    },
    {
      engagementID: "eng007",
      sectionID: "Test",
      timeStamp: "2024-06-06T11:30:00Z",
      friendlyID: "F3001",
      enemyID: "E3001",
      isWin: false,
      isCurrentState: true,
      friendlyHealth: 0,
      enemyHealth: 10,
    },
    {
      engagementID: "eng008",
      sectionID: "Test",
      timeStamp: "2024-06-06T12:00:00Z",
      friendlyID: "F3002",
      enemyID: "E3002",
      isWin: true,
      isCurrentState: false,
      friendlyHealth: 90,
      enemyHealth: 0,
    },
    {
      engagementID: "eng009",
      sectionID: "Test",
      timeStamp: "2024-06-06T12:30:00Z",
      friendlyID: "F3003",
      enemyID: "E3003",
      isWin: false,
      isCurrentState: false,
      friendlyHealth: 20,
      enemyHealth: 40,
    }
];