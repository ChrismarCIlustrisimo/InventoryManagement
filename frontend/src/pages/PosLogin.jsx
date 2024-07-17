import React, { useState } from 'react'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../utils/helper';
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'; // Importing user and padlock icons from react-icons
import loginImage from '../assets/loginImage.png'; 
import loginLogo from '../assets/iControlLoginLogo.png'; 

const PosLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if(!validateEmail(email)){
            setError('Please enter a valid email');
            return;
        }

        if(!password){
            setError('Please enter a password');
            return;
        }
        setError('');

        //API CALL
    }

  return (
    
        <div className='flex items-center justify-start w-full h-[100%]'>

            <div className='flex items-start justify-start w-[65%] py-4 h-full bg-[#17262e]'>
              <img src={loginImage} alt="Login" className='w-[66%]' />
            </div>


            <div className='flex items-start justify-center w-[35%] h-[100%]  rounded  flex-col px-11 bg-primaryBackground'>

                <img src={loginLogo} alt="Login" className='w-[30%] my-4' />

                <h1 className='my-4 text-[40px]'>Welcome <br />To <span className='font-bold'>iControl</span></h1>

                <div className='py-10 w-[100%]'>
                    <form onSubmit={handleLogin}>
                        
                        <label htmlFor="username" className='text-white'>Username</label>
                        <div className='pl-4 w-[100%] input-box flex gap-1 items-center rounded-xl p-0 mb-6 mt-2'>
                           <RiUserLine className="text-lg" />
                           <input 
                            type='text' 
                            placeholder='Username' 
                            className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                              />
                        </div>

                        <label htmlFor="password" className='text-white'>Password</label>
                        <PasswordInput placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} className='mb-2' />
                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
                        <button type="submit" className='btn-primary bg-primary mt-8 py-4'>Login</button>
                    </form>
                </div>
            </div>
        </div>



  )
}

export default PosLogin
