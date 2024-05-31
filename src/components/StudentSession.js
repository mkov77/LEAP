import React from 'react';
import { useParams } from 'react-router-dom';

const StudentSession = () => {
  const { section } = useParams(); // Extract the section parameter from the URL

  return (
    <div>
      <h1>Student Session: {section}</h1>
      {/* Add content specific to the student session */}
    </div>
  );
};

export default StudentSession;
