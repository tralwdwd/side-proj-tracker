'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { instance } from './auth';
import { ID, Permission, Role } from "appwrite";

const CreationModal = ({ refreshProjects, isModalVisible, onDismiss }) => {
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  

  const handleCreate = async () =>{
    if(projectName.trim() !== '' && projectDescription.trim() !== ''){
      let a = await instance.account.get()
      await instance.database.createDocument(
        "public",
        "projects",
        ID.unique(),
        {
          user_id: a.$id,
          name: projectName,
          description: projectDescription,
        },
        [
          Permission.read(Role.user(a.$id)),
          Permission.update(Role.user(a.$id)),
          Permission.delete(Role.user(a.$id))
        ]
      )
      refreshProjects();
      dissmissActions();
      toast.success('Project "'+ projectName + '" created successfully');
    }else {
        toast["error"]('Please fill in all the fields');
    }
  }
  const dissmissActions = () => {
    setProjectName('');
    setProjectDescription('');
    onDismiss();
  }
  return (
    <div>
      
      {isModalVisible &&
        <div className='fixed top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center'>
          <div className='max-w-[460px] bg-modal-background shadow-lg py-2 rounded-md'>
            <h2 className='text-lg font-medium dark:text-white border-b border-gray-300 py-3 px-4 mb-4'>Create Project</h2>
            <div className='px-4 pb-4'>
              <input type='text' className='w-full h-10 px-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white ' placeholder='Project Name' value={projectName} onChange={(n)=> setProjectName(n.target.value)}/>
              <input type='text' className='w-full h-10 px-2 mt-2 rounded-md dark:bg-gray-700 bg-neutral-300 dark:text-white ' placeholder='Project Description' value={projectDescription} onChange={(d)=>setProjectDescription(d.target.value)}/>
            </div>
            <div className='border-t border-gray-300 flex justify-between items-center px-4 pt-2'>
              <button
                type='button'
                className='h-8 px-2 text-sm rounded-md bg-neutral-300 dark:bg-gray-700 dark:text-white cursor-pointer'
                onClick={dissmissActions}
              >
                Cancel
              </button>
              <button type='button' className='h-8 px-2 text-sm rounded-md bg-blue-500 text-white cursor-pointer' onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      }

    </div>
  );
};

export default CreationModal;
