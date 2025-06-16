import './App.css'
import { Route, Routes } from "react-router-dom";
import Home from './Home';
import Protected from './Protected';
import Admin from './Admin';
function App() {

  return (
    <div>
    <Routes>
      <Route path='/' element={<Home/>} ></Route>
      <Route path='/admin/:id' element={<Protected><Admin/></Protected>} ></Route>
    </Routes>
    </div>
  )
}

export default App
