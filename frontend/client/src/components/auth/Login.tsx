import { useState } from 'react';
function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted', formData);
        alert('Form submitted');
    };
  return (
    <div>
      <h1 className='text-xl font-bold mb-4 text-gray-500 text-center'>Login</h1>
      <form className='flex flex-col items-center justify-center h-full' onSubmit={handleSubmit}>
        <input type='text' placeholder='email' className='border border-gray-300 rounded p-2 mb-4' name='email' onChange={handleFormDataChange}/>
        <input type='password' placeholder='Password' className='border border-gray-300 rounded p-2 mb-4' name='password' onChange={handleFormDataChange} />
        <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600' >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
