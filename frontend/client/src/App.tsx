import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/auth/Login';

function App() {
 

  return (
    <div className='bg-white h-screen w-screen flex items-center justify-center text-black'>
      <Router>
        <Routes>
          <Route path='/' element={<Welcome/>} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;
