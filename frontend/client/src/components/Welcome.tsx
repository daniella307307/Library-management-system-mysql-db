
function Welcome() {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
    <h1 className='text-4xl font-bold mb-4 text-gray-500'>Welcome to the App</h1>
    <p className='text-md mb-8 text-gray-500 '>This is a simple React application that can help in library management tasks.</p>
    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'>
      Get Started
    </button>
    <div className='mt-8 flex flex-col items-center'>
      <p className='text-gray-600'>Already have an account?</p>
      <button className='text-blue-500 hover:underline mt-8' onClick={() => window.location.href='/login'}>
        Login
      </button>  
       
  </div>
  </div>
  );
}

export default Welcome;
