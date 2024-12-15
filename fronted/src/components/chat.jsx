
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
const socket = io("http://localhost:3000");
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
          const res = await fetch('http://localhost:3000/user/getUser');
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
          const res = await fetch(`http://localhost:3000/user/getSingleUser/${id}`);
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
        `http://localhost:3000/message/sendMessage/${singleUser._id}`,
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
        const res = await axios.get(`http://localhost:3000/message/getMessage/${id}`,{
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
     const res = await axios.get('http://localhost:3000/user/secure',
      { withCredentials: true }
    )
    setLogginId(res.data._id)
  }
    
    logginUser();
  },[])
  return (
    <>
<div className="flex   justify-center items-center dark:bg-gray-950">
<div className=" p-4 md:w-[20%] h-screen overflow-y-auto bg-gray-50">
  {/* Search Section */}
  <div className="relative flex justify-center mb-6">
    <input
      type="search"
      name="search"
      placeholder="Search users..."
      className="bg-white w-full max-w-md h-12 px-4 pr-12 rounded-full text-sm focus:outline-none shadow-md"
    />
    <button type="submit" className="absolute right-0 top-0 mt-2 mr-6">
      <img
        src={search}
        alt="Search Icon"
        className="w-8 h-8 rounded-full hover:bg-gray-100 p-1"
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
          src={`http://localhost:3000/uploads/${user.pic}`}
          className="w-12 h-12 rounded-full mr-4"
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
      <div className="flex items-center justify-between px-6 py-4 border-b  border-gray-200 bg-white rounded-t-lg">
       
       
        <div  className="flex items-center space-x-4">
          <img
            src={`http://localhost:3000/uploads/${singleUser.pic}`}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{singleUser.name}</h2>
            <div className="flex items-center space-x-2">
              <BsCircleFill className="text-green-500 w-2 h-2" />
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-3 cursor-pointer">
         <img src={telephone} alt="" className="w-8 h-8" /> 
         <img src={video} alt="" className="w-10 h-10" /> 
         <img src={Icon} alt="" className="w-8 h-9" /> 
         </div>
      </div> : ''
 }

      { !id ? <div>
        <img src={messageLogo} alt="" className="" />
      </div> : <div className="flex-1 overflow-y-auto p-3 space-y-4">
      {message.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.receiver !== singleUser._id ? 'justify-start' : 'justify-end'
                  }`}
                >
                    { msg.receiver !== singleUser._id ?
                  <img  src={`http://localhost:3000/uploads/${singleUser.pic}`} alt=""  className="w-4 h-4 rounded-full object-cover mt-4" /> : ''
                    }
                  <div className={`rounded-lg px-2 py-2 max-w-[80%] ${msg.receiver === singleUser._id ? 'bg-blue-200' : 'bg-gray-100'}`}>
                    <p className="text-lg">{  msg.content } </p> 
                    <div className="text-right text-xs text-gray-500">
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
      <div className="px-6 py-4 bg-white border-t  border-gray-200 rounded-b-lg">

     <div className="flex space-x-4 ">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full">
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
    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
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