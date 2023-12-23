import React from 'react';

const Heading = ({ title, subtitle }) => {
  return (
    <div className="text-center my-14">
      <h1 className="text-6xl font-bold text-white">{title}</h1>
      <p className="text-md text-gray-300">{subtitle}</p>
    </div>
  );
};

export default Heading;
