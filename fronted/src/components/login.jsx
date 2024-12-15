import { useForm } from 'react-hook-form';
import axios from 'axios'

export default function Login() {
    const {register,handleSubmit, formState:{errors}} =  useForm()
    const onSubmit = async (data) => {
      try {
          const response = await axios.post('http://localhost:3000/user/SignIn', data,{
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
          localStorage.setItem("chat-user", JSON.stringify(data));
          localStorage.setItem("token", JSON.stringify(response.data.token));
       
          alert('Login successful');
          window.location.href = '/chat'
      } catch (err) {
          console.error('Error during login:', err);
          alert(err.response?.data?.message || 'Login failed. Please try again.');
      }
  };
  
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
	<div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
		<h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Welcome Back!</h1>
		<form action="#" onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-4">
				<label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
				<input
                id="email"
                type="email"
                 {...register('email',{required:'Email is required'})}
                 className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="your@email.com" required/>
                {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
			</div>
			<div className="mb-4">
				<label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
				<input type="password" id="password"
                {...register('password',{required:'Password is required'})}
                className="shadow-sm rounded-md w-full px-3 py-2
                 border border-gray-300 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500"
                   placeholder="Enter your password" required/>
                {errors.password && <span className="text-red-500 text-xs">Password is required</span>}
				<a href="#"
					className="text-xs text-gray-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Forgot
					Password?</a>
			</div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:outline-none" checked/>
					<label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">Remember me</label>
				</div>
				<a href="#"
					className="text-xs text-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Create
					Account</a>
			</div>
			<button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
		</form>
	</div>
</div>
    </div>
  )
}
