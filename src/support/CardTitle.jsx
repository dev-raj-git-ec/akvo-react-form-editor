import React from 'react';

const CardTitle = ({ title, numbering = null }) => {
  return <div>{numbering ? `${numbering}. ${title}` : title}</div>;
};

export default CardTitle;
