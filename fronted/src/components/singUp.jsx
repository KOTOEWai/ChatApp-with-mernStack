import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [imgProfile, setImgProfile] = useState(null);

  const handleFileChange = (e) => {
    setImgProfile(e.target.files[0]); // Correctly set the selected file
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
      await axios.post('http://localhost:3000/user/SignUp', formData, {
        withCredentials: true,
      });
      alert('Sign up successful!');
      navigate('/login');
    } catch (err) {
      console.error('Error during signup:', err);
      alert(err.response?.data?.message || 'Register failed. Please try again.');
    }
  };

  return (
    <div className="dark:bg-gray-950 flex justify-center items-center h-screen">
      <div className="font-[sans-serif] bg-white w-[60%] dark:bg-gray-950">
        <div className="grid md:grid-cols-2 items-center gap-8 h-full">
          <div className="max-md:order-1 p-4">
            <img
              src="https://readymadeui.com/signin-image.webp"
              className="lg:max-w-[85%] w-full h-full object-contain block mx-auto"
              alt="signup"
            />
          </div>

          <div className="flex items-center md:p-8 p-6 bg-[#0C172C] h-[95%] lg:w-11/12 lg:ml-auto">
            <form className="max-w-lg w-full mx-auto" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-yellow-400">Create an account</h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-white text-xs block mb-2">Full Name</label>
                <input
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  name="name"
                  type="text"
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter name"
                />
                {errors.name && <span className="text-red-500">{errors.name.message}</span>}
              </div>

              {/* Email */}
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Email</label>
                <input
                  id="email"
                  {...register('email', { required: 'Email is required' })}
                  name="email"
                  type="email"
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter email"
                />
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
              </div>

              {/* Profile Picture */}
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Profile Picture</label>
                <input
                  name="pic"
                  type="file"
                  id="pic"
                  onChange={handleFileChange}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                />
                {errors.pic && <span className="text-red-500">{errors.pic.message}</span>}
              </div>

              {/* Password */}
              <div className="mt-8">
                <label className="text-white text-xs block mb-2">Password</label>
                <input
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  name="password"
                  type="password"
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter password"
                />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
              </div>

              {/* Submit */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-max shadow-xl py-3 px-6 text-sm text-gray-800 font-semibold rounded-md bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
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
