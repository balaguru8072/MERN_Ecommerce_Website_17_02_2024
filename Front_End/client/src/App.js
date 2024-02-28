import './App.css';
import Home from './Component/Home';
import Footer from './Component/Layout/Footer';
import Header from './Component/Layout/Header';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import ProductDetail from './Component/Product/ProductDetail';
import ProductSearch from './Component/Product/ProductSearch';
import Login from './Component/User/Login';
import Register from './Component/User/Register';
import { useEffect } from 'react';
import store from "./store";
import { loadUser } from './actions/userActions';
import Profile from './Component/User/Profile';

function App() {

  useEffect(()=>{
    store.dispatch(loadUser)

  })
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer theme='dark' />
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/search/:keyword' element={<ProductSearch />} />
              <Route path='/product/:id' element={<ProductDetail />} />
              <Route path='/login' element= {<Login/>} />
              <Route path='/register' element= {<Register/>} />
              <Route path='/myprofile' element= {<Profile/>} />
            </Routes>
          </div>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
