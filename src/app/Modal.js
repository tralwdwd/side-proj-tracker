'use client'
import React from 'react';

const Modal = ({ title, isModalVisible, onDismiss, onSuccess, successLabel, successLabelClassName, children }) => {
  
  return (
    <div>
      
      {isModalVisible &&
        <div className='fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center'>
          <div className='max-w-[460px] bg-modal-background shadow-lg py-2 rounded-md'>
            <h2 className='text-lg font-medium dark:text-white border-b border-gray-300 py-3 px-4 mb-4'>{title}</h2>
            <div className='px-4 pb-4'>
              {children}
            </div>
            <div className='border-t border-gray-300 flex justify-between items-center px-4 pt-2'>
              <button
                type='button'
                className='h-8 px-2 text-sm rounded-md bg-neutral-300 dark:bg-gray-700 dark:text-white cursor-pointer'
                onClick={onDismiss}
              >
                Cancel
              </button>
              <button type='button' className={`h-8 px-2 text-sm rounded-md  text-white cursor-pointer ${successLabelClassName}`} onClick={onSuccess}>{successLabel}</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default Modal;