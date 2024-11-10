import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';
import React, { useState, useEffect } from 'react';
import { useAdminTheme } from '../context/AdminThemeContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { BsPersonCircle } from "react-icons/bs";
import SearchBar from '../components/adminSearchBar';
import { useLogout } from '../hooks/useLogout';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ConfirmationDialog from '../components/ConfirmationDialog';
import ArchivedUsers from '../components/ArchivedUsers';

<ToastContainer />

const AdminProfile = () => {
    const { user } = useAuthContext();
    const { darkMode } = useAdminTheme();
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const [activeButton, setActiveButton] = useState('profile');
    const [searchQuery, setSearchQuery] = useState('');
    const [contact, setContact] = useState(user.contact);
    const [username, setUsername] = useState(user.username);
    const [name, setName] = useState(user.name);
    const [users, setUsers] = useState([]);
    const { logout } = useLogout();
    const [isEditable, setIsEditable] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userId, setuserId] = useState(user._id);
    const [userToArchive, setUserToArchive] = useState(null);
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);

    const resetToUserData = () => {
        setName(user.name);
        setUsername(user.username);
        setContact(user.contact);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsEditable(false);
        setIsChangingPassword(false);
    };

    const toggleChangePassword = async () => {
        if (isChangingPassword) {
            if (!currentPassword || !newPassword || !confirmPassword) {
                setErrorMessage('All password fields must be filled.');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                setErrorMessage('New passwords do not match.');
                return;
            }
    
            try {
                const response = await axios.post(`${baseURL}/user/${user._id}/validate-password`, { currentPassword });
                if (response.data.valid) {
                    await saveChanges(`/user/${user._id}/change-password`, { currentPassword, newPassword }, 'Password changed successfully.', 'Error changing password:');
                    toast.success('Password changed successfully!');
                } else {
                    setErrorMessage('Current password is incorrect.');
                }
            } catch (error) {
                setErrorMessage('Error validating current password: ' + (error.response ? error.response.data : error.message));
            }
        } else {
            resetToUserData();
        }
        setIsChangingPassword(prev => !prev);
    };
    
    const toggleEdit = async () => {
        if (isEditable) {
            await saveChanges(`/user/${user._id}`, { name, username, contact }, '', 'Error updating profile:');
            toast.success('Information updated successfully!');
        } else {
            resetToUserData();
        }
        setIsEditable(prev => !prev);
    };
    
    
    const saveChanges = async (endpoint, data, successMessage, errorMessage) => {
        try {
            const response = await axios.patch(`${baseURL}${endpoint}`, data);
            setMessage(successMessage); // Set success message
            setErrorMessage(''); // Clear error message
        } catch (error) {
            setErrorMessage(errorMessage + (error.response ? error.response.data : error.message)); // Set error message
            setMessage(''); // Clear success message
        }
    };
    
    
    

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseURL}/user?archived=false`); // Fetch only non-archived users
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    fetchUsers();
}, [baseURL, activeButton]);



    useEffect(() => {
        const nextView = localStorage.getItem('nextView');
        if (nextView) {
            setActiveButton(nextView);
            localStorage.removeItem('nextView'); // Clear the value
        }
    }, [setActiveButton]);


    const handleClick = (button) => {
        setActiveButton(button);
        resetToUserData();  // Reset any editing or password changes when switching tabs
    };

    const handleAddUserClick = () => {
        navigate('/addUser');
    };

    const handleViewUserClick = (userId) => {
        navigate(`/update-user/${userId}`);
    };

    const handleConfirmArchive = async () => { 
        if (userToArchive) {
            try {
                const response = await fetch(`http://localhost:5555/user/${userToArchive}/archive`, {
                    method: 'PATCH',
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to archive user');
                }
    
                // Update user list to reflect archive status
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === userToArchive ? { ...user, archived: true } : user
                    )
                );
                setUserToArchive(null);
                toast.success('User archived successfully!');
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
    
        setIsArchiveDialogOpen(false); // Close the dialog after confirming
    };
    
    const handleArchiveUserClick = (userId) => {
        setUserToArchive(userId); // Set the user ID to archive
        setIsArchiveDialogOpen(true); // Open the confirmation dialog
    };
    

    const handleCancelArchiveUser = () => {
        setUserToArchive(null); // Reset the userToArchive state
        setIsArchiveDialogOpen(false); // Close the dialog
    };

    const getIconColor = (role) => {
        switch (role) {
            case 'super admin':
                return darkMode ? 'text-blue-600' : 'text-blue-400';  // Color for super admin
            case 'admin':
                return darkMode ? 'text-red-600' : 'text-red-400';  // Color for admin
            case 'cashier':
                return darkMode ? 'text-green-600' : 'text-green-400';  // Color for cashier
            default:
                return darkMode ? 'text-gray-600' : 'text-gray-400';  // Default color for other roles
        }
    };
    

    const onLogout = () => {
        logout();
    };

    return (
        <div className={`w-full h-full ${darkMode ? 'bg-light-bg' : 'bg-dark-bg'}`}>
            <DashboardNavbar />
            <ToastContainer theme={darkMode ? 'light' : 'dark'} />
            <div className={`pt-[70px] px-6 py-4 h-full`}>
                <div className='flex items-center justify-center py-5 flex-col h-full'>
                    <div className='flex w-full items-center justify-start'>
                        <h1 className={`w-full text-3xl font-bold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Settings</h1>
                    </div>
                    <div className='w-full h-full flex'>
                        <div className="flex flex-col text-xl h-full w-[20%] items-start justify-start p-4">
                            <button onClick={() => handleClick('profile')} className={`p-2 bg-transparent ${activeButton === 'profile' ? 'text-light-primary' : `${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}`} >Profile</button>
                            <button onClick={() => handleClick('users')} className={`p-2 bg-transparent ${activeButton === 'users' ? 'text-light-primary' : `${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}`} >Users</button>
                            <button onClick={() => handleClick('archived')} className={`p-2 bg-transparent ${activeButton === 'archived' ? 'text-light-primary' : `${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}`} >Archived Users</button>
                        </div>
                        <div className={`flex-grow border-l h-full ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}></div>

                        <div className='flex flex-col w-[80%] items-start justify-start gap-6 p-8 pl-24'>
                            {activeButton === 'profile' && (
                                <>
                                    <p className={`text-xl ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Profile</p>
                                    <BsPersonCircle className={`w-20 h-20 ${darkMode ? 'text-light-primary' : 'text-dark-primary'}`} />
                                    {!isChangingPassword && !isEditable && (
                                        <>
                                            <p className={`text-4xl font-semibold ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{name}</p>
                                            <p className={`${darkMode ? 'text-light-primary' : 'text-dark-primary'}`}>{user.role.toUpperCase()}</p>
                                            <label className={`text-sm font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                Username
                                                <input type="text"  value={username}  placeholder="Username" disabled className={`w-[100%] border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} />
                                            </label>
                                            <label className={`text-sm font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                Contact
                                                <input  type="text" value={contact} placeholder="Contact" disabled  className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} />
                                            </label>
                                        </>
                                    )}
                                    {(isChangingPassword || isEditable) && (
                                        <div className='flex flex-col gap-4'>
                                            {(isEditable || !isChangingPassword) && (
                                                <>
                                                    <label className={`text-sm font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                        Name
                                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" disabled={!isEditable}  className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} />
                                                    </label>
                                                    <label className={`text-sm font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                        Username
                                                        <input type="text"  value={username}  onChange={(e) => setUsername(e.target.value)}  placeholder="Username"  disabled={!isEditable}  className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} />
                                                    </label>
                                                    <label className={`text-sm font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                        Contact
                                                        <input type="text" value={contact}  onChange={(e) => setContact(e.target.value)}  placeholder="Contact" disabled={!isEditable} className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`} />
                                                    </label>
                                                </>
                                            )}
                                                <>
                                                    {isChangingPassword && (
                                                        <>
                                                            <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                                Current Password
                                                                <div className="relative">
                                                                    <input
                                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                                        value={currentPassword}
                                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                                        placeholder="Current Password"
                                                                        className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                                                    />
                                                                    <div
                                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                    >
                                                                        {showCurrentPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                                New Password
                                                                <div className="relative">
                                                                    <input
                                                                        type={showNewPassword ? 'text' : 'password'}
                                                                        value={newPassword}
                                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                                        placeholder="New Password"
                                                                        className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                                                    />
                                                                    <div
                                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                                    >
                                                                        {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <label className={`text-lg font-medium flex flex-col ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                                Confirm Password
                                                                <div className="relative">
                                                                    <input
                                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                                        value={confirmPassword}
                                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                                        placeholder="Confirm Password"
                                                                        className={`w-full border bg-transparent rounded-md p-2 mt-1 ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}
                                                                    />
                                                                    <div
                                                                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-xl"
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    >
                                                                        {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            {message && <p className='text-green-600'>{message}</p>}
                                                            {errorMessage && <p className='text-red-600'>{errorMessage}</p>}
                                                        </>
                                                    )}
                                                </>

                                                <div className='flex gap-4'>
                                                <button
                                                        onClick={isChangingPassword ? toggleChangePassword : toggleEdit}
                                                        className={`px-4 py-2 rounded-md 
                                                            ${isChangingPassword ? 'bg-dark-primary text-light-text' : 'bg-light-primary text-dark-text'}`}
                                                        >
                                                        {isChangingPassword ? 'Save Password' : isEditable ? 'Save Info' : 'Edit Info'}
                                                        </button>
                                                    <button onClick={resetToUserData} className="px-4 py-2 rounded-md bg-gray-300 text-black">Cancel</button>
                                                </div>
                                        </div>
                                    )}
                                    {!isChangingPassword && !isEditable && (
                                        <div className='flex flex-col gap-4'>
                                            <button onClick={toggleChangePassword} className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}>Change Password</button>
                                            <div className='flex gap-4'>
                                                <button  onClick={() => setIsEditable(true)} className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`} >Edit Info</button>
                                                <button onClick={() => onLogout()} className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-white'}`}>Logout</button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeButton === 'users' && (
                                <div className='w-full'>
                                    <div className='flex items-center justify-between'>
                                        <p className={`text-4xl ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>Users</p>
                                        <div className='w-full flex justify-end gap-4 my-4'>
                                            <SearchBar query={searchQuery} onQueryChange={setSearchQuery} placeholderMessage={'Search User by name'}/>
                                            <button
                                                className={`px-4 py-2 rounded-md font-semibold ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'}`}
                                                onClick={handleAddUserClick}
                                            >
                                                Add User
                                            </button>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 w-full'> 
                                    <div className={`w-full max-h-[480px] overflow-auto rounded-lg ${darkMode ? 'bg-light-container' : 'bg-dark-container'}`}>
                                        <table className='w-full border-collapse'>
                                            <thead className={`sticky top-0 rounded-lg py-6 border-b ${darkMode ? 'border-light-primary bg-light-container text-light-textPrimary' : 'border-dark-primary bg-dark-container text-dark-textPrimary'}`}>
                                                <tr>
                                                    <th style={{ width: '40%' }} className={`p-2 py-4 text-left`}>NAME</th>
                                                    <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>ROLE</th>
                                                    <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>CONTACT</th>
                                                    <th style={{ width: '20%' }} className={`p-2 py-4 text-center`}>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody className='h-full'>
                                                    {users
                                                        .filter(user => !user.archived) // Exclude archived users
                                                        .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase())) // Apply search filter
                                                        .map(user => (
                                                            <tr key={user._id} className={`border-b ${darkMode ? 'border-light-primary' : 'border-dark-primary'}`}>
                                                                <td style={{ width: '50%' }} className={`p-2 py-4 flex gap-4 items-center text-left ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                                                                    <BsPersonCircle className={`w-10 h-10 ${getIconColor(user.role)}`} />
                                                                    <p>{user.name}</p>
                                                                </td>
                                                                <td style={{ width: '20%' }} className={`p-2 py-4 text-center ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{user.role}</td>
                                                                <td style={{ width: '20%' }} className={`p-2 py-4 text-center ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>{user.contact}</td>
                                                                <td style={{ width: '20%' }} className='text-center gap-4'>
                                                                    <button
                                                                        className={`px-4 py-2 rounded-md font-semibold mr-4 transform transition-transform duration-150 ${darkMode ? 'bg-light-primary' : 'bg-dark-primary'} hover:scale-105`}
                                                                        onClick={() => handleViewUserClick(user._id)}
                                                                        disabled={user.archived} // Disable edit for archived users
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                    <button
                                                                        className={`px-4 py-2 rounded-md font-semibold transform transition-transform duration-150 ${darkMode ? 'bg-red-500' : 'bg-red-600'}`}
                                                                        onClick={() => handleArchiveUserClick(user._id)}
                                                                        disabled={user.archived} // Disable archive button if already archived
                                                                    >
                                                                        Archive
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>


                                        </table>
                                    </div>
                                </div>
                            </div>
                            )}

                            {activeButton === 'archived' &&(
                                <ArchivedUsers />
                            )}
                        </div>
                        <ConfirmationDialog
                            isOpen={isArchiveDialogOpen}  // This will control whether the dialog is visible
                            onConfirm={handleConfirmArchive}  // This is the function that will run when the user confirms the archive action
                            onCancel={handleCancelArchiveUser}  // This is the function that will run when the user cancels the archive action
                            message="Are you sure you want to archive this user?"  // Custom message to display in the dialog
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProfile;
