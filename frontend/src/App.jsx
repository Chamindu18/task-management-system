import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import NotFound from "./components/NotFound";

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;