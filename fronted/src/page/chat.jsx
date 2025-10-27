import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import { BsCircleFill } from "react-icons/bs";
import { CameraIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { io } from "socket.io-client";

import SearchSection from "../components/SearchSection";
import UserList from "../components/UserList";
import messageLogo from "../assets/messagelogo.jpg";
import telephone from "../assets/telephone.png";
import Icon from "../assets/letter-i.png";

const socket = io(`${import.meta.env.VITE_BASE_URL}`);

const ChatInterface = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ message: "" });
  const [loggedInId, setLoggedInId] = useState();

  // ✅ Fetch logged-in user
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/secure`,
          { withCredentials: true }
        );
        setLoggedInId(data._id);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };
    fetchLoggedInUser();
  }, []);

  // ✅ Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/getUser`);
        const data = await res.json();
        const filteredUsers = data.filter((u) => u._id !== loggedInId);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [loggedInId]);

  // ✅ Fetch single user by ID
  useEffect(() => {
    if (!id) return;
    const fetchSingleUser = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/getSingleUser/${id}`
        );
        const data = await res.json();
        setSingleUser(data);
      } catch (error) {
        console.error("Error fetching single user:", error);
      }
    };
    fetchSingleUser();
  }, [id]);

  // ✅ Fetch chat messages
  useEffect(() => {
    if (!id) return;
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/message/getMessage/${id}`,
          { withCredentials: true }
        );
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [id]);

  // ✅ Socket listeners
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  // ✅ Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Message Send Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const newMessage = {
      receiver: singleUser._id,
      content: formData.message,
    };

    try {
      socket.emit("Message", newMessage);
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/message/sendMessage/${singleUser._id}`,
        { message: formData.message },
        { withCredentials: true }
      );
      setFormData({ message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex items-center justify-center dark:bg-gray-950">
      <ToastContainer />

      {/* Sidebar */}
      <div className="p-4 md:w-[20%] h-screen overflow-y-auto bg-gray-50">
        <SearchSection />
        <UserList users={users} />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col h-screen w-[60%] bg-gray-50 shadow-xl">
        {/* Header */}
        {id && (
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={`${import.meta.env.VITE_BASE_URL}/uploads/${singleUser.pic}`}
                alt="Profile"
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {singleUser.name}
                </h2>
                <div className="flex items-center space-x-2">
                  <BsCircleFill className="w-2 h-2 text-green-500" />
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 cursor-pointer">
              <img src={telephone} alt="phone" className="w-8 h-8" />
              <CameraIcon className="w-8 h-8" />
              <img src={Icon} alt="info" className="w-8 h-9" />
            </div>
          </div>
        )}

        {/* Messages */}
        {!id ? (
          <div className="flex items-center justify-center flex-1">
            <img src={messageLogo} alt="logo" className="w-48 opacity-70" />
          </div>
        ) : (
          <div className="flex-1 p-3 space-y-4 overflow-y-auto">
            {messages.map((msg, i) => {
              const isSender = msg.receiver === singleUser._id;
              return (
                <div
                  key={i}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  {!isSender && (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}/uploads/${singleUser.pic}`}
                      alt="profile"
                      className="object-cover w-4 h-4 mt-4 rounded-full"
                    />
                  )}
                  <div
                    className={`rounded-lg px-2 py-2 max-w-[80%] ${
                      isSender ? "bg-blue-200" : "bg-gray-100"
                    }`}
                  >
                    <p className="text-lg">{msg.content}</p>
                    <div className="text-xs text-right text-gray-500">
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Message Input */}
        {id && (
          <form
            onSubmit={handleSubmit}
            className="flex items-center w-full gap-2 px-6 py-4 bg-white border-t border-gray-200"
          >
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
              aria-label="send-message"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
