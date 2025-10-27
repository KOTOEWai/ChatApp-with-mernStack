import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';


export default function UserList({ users = [] }) {
    UserList.propTypes = {
    users: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        // add other required properties here
      })
    ).isRequired,
  };
  const navigate = useNavigate();
  const { id } = useParams();

  if (!users.length) {
    return <p className="mt-6 text-center text-gray-500">No users found</p>;
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => navigate(`/chat/${user._id}`)}
          className={`flex items-center p-3 rounded-lg shadow-md cursor-pointer transition ${
            user._id === id
              ? "bg-orange-200 hover:bg-orange-300"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          <img
            src={`${import.meta.env.VITE_BASE_URL}/uploads/${user.pic}`}
            className="w-12 h-12 mr-4 rounded-full"
            alt="User"
          />
          <p className="text-lg font-medium text-gray-700">{user.name}</p>
        </div>
      ))}
    </div>
  );
}
