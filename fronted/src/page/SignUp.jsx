import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [imgProfile, setImgProfile] = useState(null);

  const handleFileChange = (e) => {
    setImgProfile(e.target.files[0]); 
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    
    // Append the file if it exists
    if (imgProfile) {
      formData.append('pic', imgProfile);
    }

    // Append other form data
    for (const key in data) {
      formData.append(key, data[key]);
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/user/SignUp`, formData, {
        withCredentials: true,
      });

      toast.success('Register successful!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate('/login');
    } catch (err) {
      console.error('Error during signup:', err);
      alert(err.response?.data?.message || 'Register failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen dark:bg-gray-950">
      <ToastContainer/>
      <div className="font-[sans-serif] bg-white w-[60%] dark:bg-gray-950">
        <div className="grid items-center h-full gap-8 md:grid-cols-2">
          <div className="p-4 max-md:order-1">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="lg:max-w-[85%] w-full h-full object-contain block mx-auto"
              alt="signup"
            />
          </div>

          <div className="flex items-center md:p-8 p-6 bg-[#0C172C] h-[95%] lg:w-11/12 lg:ml-auto">
            <form className="w-full max-w-lg mx-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-yellow-400">Create an account</h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block mb-2 text-xs text-white">Full Name</label>
                <input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  name="name"
                  type="text"
                  className="w-full px-2 py-3 text-sm text-white bg-transparent border-b border-gray-300 outline-none focus:border-yellow-400"
                  placeholder="Enter name"
                />
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div className="mt-8">
                <label className="block mb-2 text-xs text-white">Email</label>
                <input
                  id="email"
                  {...register('email', { required: 'Email is required' })}
                  name="email"
                  type="email"
                  className="w-full px-2 py-3 text-sm text-white bg-transparent border-b border-gray-300 outline-none focus:border-yellow-400"
                  placeholder="Enter email"
                />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              </div>

              {/* Profile Picture */}
              <div className="mt-8">
                <label htmlFor="pic" className="block mb-2 text-xs text-white">
               Profile Picture
              </label>
              <input
              id="pic"
              name="pic"
              type="file"
              onChange={handleFileChange}
                className="w-full px-2 py-3 text-sm text-white bg-transparent border-b border-gray-300 outline-none focus:border-yellow-400"
             />

                {errors.pic && <span className="text-red-500">{errors.pic.message}</span>}
              </div>

              {/* Password */}
              <div className="mt-8">
                <label className="block mb-2 text-xs text-white">Password</label>
                <input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  name="password"
                  type="password"
                  className="w-full px-2 py-3 text-sm text-white bg-transparent border-b border-gray-300 outline-none focus:border-yellow-400"
                  placeholder="Enter password"
                />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold text-gray-800 bg-yellow-400 rounded-md shadow-xl w-max hover:bg-yellow-500 focus:outline-none"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
