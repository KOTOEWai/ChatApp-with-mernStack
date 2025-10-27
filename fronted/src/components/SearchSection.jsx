
import search from '../assets/images.png';
export default function SearchSection() {
  return (

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
    
  )
}
