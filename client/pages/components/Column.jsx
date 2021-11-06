import React from 'react';

const Column = ({ data, handleDelete }) => {
  return (
    <div className='col'>
      <div className='col-header flex align-center'>
        <h2 className='col-name'>{data.name}</h2>
        <button type='button'
          className='no-border col-btn'
          onClick={() => handleDelete(data.columnId)}>
          <i className='fas fa-times col-icon semi-bold gray-text'></i>
        </button>
      </div>
    </div>
  );
};

export default Column;
