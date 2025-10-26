
import { FiSend } from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import search from '../assets/images.png';
import messageLogo from '../assets/messagelogo.jpg'
import telephone from '../assets/telephone.png';
import video from '../assets/play.png';
import Icon from '../assets/letter-i.png';
import { io } from 'socket.io-client';
const socket = io(`${import.meta.env.VITE_BASE_URL}`);
const ChatInterface = () => {
    const [user, setUser] = useState([]);
    const [singleUser, setSingleUser] = useState({});
    const [formData, setFormData] = useState({ message: '' });
    const [logginId,setLogginId] = useState();
    const [message, setMessage] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const LogginUserId = logginId;
  
    // Fetch all users
   useEffect(() => {
      const getUsers = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/getUser`);
          const data = await res.json();
          const users = data.filter((user)=> user._id != LogginUserId)
          setUser(users);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      getUsers();
    }, [LogginUserId]);
    // Fetch single user by ID
   useEffect(() => {
      if (!id) return;
      const getSingleUser = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/getSingleUser/${id}`);
          const data = await res.json();
          setSingleUser(data);
        } catch (error) {
          console.error('Error fetching single user:', error);
        }
      };
      getSingleUser();
    }, [id]);
    // Handle form input change
 const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) {
      alert('Please type a message.');
      return;
    }
    const Message = { receiver: singleUser._id, content: formData.message };

    try {
      // Send message to the server
      socket.emit('Message',Message);

      // Optionally, save message to the database
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/sendMessage/${singleUser._id}`,
        { message: formData.message },
        { withCredentials: true },
      );

      // Clear input field
      setFormData({ message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };
 //socketFetch
 useEffect(() => {
    socket.on('receiveMessage', (newMessage) => {
      setMessage((prevMessages) => [...prevMessages, newMessage]);
    });
    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

//get message
  useEffect(() => {
   const getMessage = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/message/getMessage/${id}`,{
          withCredentials: true,
        });
      
        setMessage(res.data)

      } catch (error) {
        console.error('Error fetching single user:', error);
      }
    };
    getMessage();
  }, [id]);

  useEffect(()=>{
    const logginUser = async () => {
     const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/secure`,
      { withCredentials: true }
    )
    setLogginId(res.data._id)
  }
    
    logginUser();
  },[])
  return (
    <>
<div className="flex items-center justify-center dark:bg-gray-950">
<div className=" p-4 md:w-[20%] h-screen overflow-y-auto bg-gray-50">
  {/* Search Section */}
  <div className="relative flex justify-center mb-6">
    <input
      type="search"
      name="search"
      placeholder="Search users..."
      className="w-full h-12 max-w-md px-4 pr-12 text-sm bg-white rounded-full shadow-md focus:outline-none"
    />
    <button type="submit" className="absolute top-0 right-0 mt-2 mr-6">
      <img
        src={search}
        alt="Search Icon"
        className="w-8 h-8 p-1 rounded-full hover:bg-gray-100"
      />
    </button>
  </div>

  {/* User List */}
  <div className="space-y-4">
    {user.map((user, i) => (
      <div
        key={i}
        onClick={() => navigate(`/chat/${user._id}`)}
        className={`flex items-center p-3 rounded-lg shadow-md cursor-pointer transition ${
          user._id === id
            ? "bg-orange-200 hover:bg-orange-300"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        {/* User Picture */}
        <img
          src={`${import.meta.env.VITE_BASE_URL}/uploads/${user.pic}`}
          className="w-12 h-12 mr-4 rounded-full"
          alt="User"
        />
        {/* User Name */}
        <p className="text-lg font-medium text-gray-700">{user.name}</p>
      </div>
    ))}

  </div>
</div>

<div className="flex flex-col h-screen w-[60%]  bg-gray-50 shadow-xl ">

{ id ?
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 rounded-t-lg">
       
       
        <div  className="flex items-center space-x-4">
          <img
            src={`${import.meta.env.VITE_BASE_URL}/uploads/${singleUser.pic}`}
            alt="Profile"
            className="object-cover w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{singleUser.name}</h2>
            <div className="flex items-center space-x-2">
              <BsCircleFill className="w-2 h-2 text-green-500" />
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 cursor-pointer">
         <img src={telephone} alt="" className="w-8 h-8" /> 
         <img src={video} alt="" className="w-10 h-10" /> 
         <img src={Icon} alt="" className="w-8 h-9" /> 
         </div>
      </div> : ''
 }

      { !id ? <div>
        <img src={messageLogo} alt="" className="" />
      </div> : <div className="flex-1 p-3 space-y-4 overflow-y-auto">
      {message.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.receiver !== singleUser._id ? 'justify-start' : 'justify-end'
                  }`}
                >
                    { msg.receiver !== singleUser._id ?
                  <img  src={`${import.meta.env.VITE_BASE_URL}/uploads/${singleUser.pic}`} alt=""  className="object-cover w-4 h-4 mt-4 rounded-full" /> : ''
                    }
                  <div className={`rounded-lg px-2 py-2 max-w-[80%] ${msg.receiver === singleUser._id ? 'bg-blue-200' : 'bg-gray-100'}`}>
                    <p className="text-lg">{  msg.content } </p> 
                    <div className="text-xs text-right text-gray-500">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}
            </div>
                  </div>

                 
                  
                 

                </div>
              ))}
        <div />
      </div>
}
      <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-lg">

     <div className="flex space-x-4 ">
        <form onSubmit={handleSubmit} className="flex items-center w-full space-x-2">
  <input
    id="message"
    name="message"
    onChange={handleInputChange}
    value={formData.message}
    type="text"
    placeholder="Type your message here..."
    className="w-full p-2 border border-gray-300 rounded-lg"
  />
  <button
    type="submit"
    className="px-4 py-2 text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <FiSend className="w-5 h-5" />
  </button>
</form>

        </div>
      </div>
    </div>
 </div>
    </>
  );
};

export default ChatInterface;