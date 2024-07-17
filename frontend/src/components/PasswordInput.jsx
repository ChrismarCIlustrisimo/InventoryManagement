import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'; // Importing user and padlock icons from react-icons

const PasswordInput = ({ value, onChange, placeholder }) => {

  const [isShowPassword, setisShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setisShowPassword(!isShowPassword);
  }

  return (
    
      <div className='px-4 w-[100%] input-box flex gap-1 items-center rounded-xl p-0 m-0 mt-2'>
        <RiLockPasswordLine className="text-lg" />
        <input 
          type={isShowPassword ? 'text' : 'password'}
          placeholder='Password'
          className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
          value={value}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isShowPassword ? (
          <FaRegEyeSlash
            size={22}
            className='text-primary cursor-pointer'
            onClick={() => toggleShowPassword()}
          />
        ) : (
          <FaRegEye
            size={22}
            className='text-primary cursor-pointer'
            onClick={() => toggleShowPassword()}
          />
        )}
      </div>

    

  )
}

export default PasswordInput
