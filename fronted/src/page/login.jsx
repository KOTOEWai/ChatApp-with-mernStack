import { useForm } from 'react-hook-form';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
export default function Login() {
    const {register,handleSubmit, formState:{errors}} =  useForm()
    const onSubmit = async (data) => {
      try {
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/SignIn`, data,{
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
          localStorage.setItem("chat-user", JSON.stringify(data));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          toast.success('Login successful!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
          window.location.href = '/chat'
      } catch (err) {
          console.error('Error during login:', err);
          alert(err.response?.data?.message || 'Login failed. Please try again.');
      }
  };
  
  return (
    
      <div className="flex items-center justify-center w-full min-h-screen dark:bg-gray-950">
        <ToastContainer/>
	      <div className="max-w-md px-8 py-6 bg-white rounded-lg shadow-md dark:bg-gray-900">
		<h1 className="mb-4 text-2xl font-bold text-center dark:text-gray-200">Welcome Back!</h1>
		<form action="#" onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-4">
				<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
				<input
                id="email"
                type="email"
                data-testid="email"
                 {...register('email',{required:'Email is required'})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="your@email.com" required/>
                {errors.email && <span className="text-xs text-red-500">Email is required</span>}
			</div>
			<div className="mb-4">
				<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
				<input type="password" id="password"
                {...register('password',{required:'Password is required'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="Enter your password" required/>
                {errors.password && <span className="text-xs text-red-500">Password is required</span>}
				<a href="#"
					className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot
					Password?</a>
			</div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
				<input
        type="checkbox"
        id="remember"
        defaultChecked
        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:outline-none"
      />
					<label htmlFor="remember" className="block ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</label>
				</div>
				<a href="/signup"
					className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create
					Account</a>
			</div>
			<button type="submit" className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
		</form>
	      </div>
      </div>
   
  )
}
