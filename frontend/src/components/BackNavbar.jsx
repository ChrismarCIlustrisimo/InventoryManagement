import React from 'react';
import { IoCaretBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const BackNavbar = () => {
  return (
    <div className='fixed top-0 left-0 w-full flex justify-between px-2 py-4 items-center bg-trasnparent'>
      <button className='flex gap-2 items-center py-3 px-6 outline-none'>
        <IoCaretBackOutline />
        Back to sales order
      </button>
      <div className='flex gap-2 items-center text-red-500'>
        <button className='border border-red-600 py-2 px-6 rounded font-semibold hover:bg-red-600 hover:text-white active:bg-red-700 active:text-red-200 px-4 rounded-xl outline-none'>
          Edit
        </button>
        <div className='h-10 border-l-2 border-red-500 mx-2'></div>
        <button className='text-4xl outline-none hover:text-white'>
          <MdDelete />
        </button>
      </div>
    </div>
  );
}

export default BackNavbar;
