import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './page/home/HomePage';
import AboutPage from './page/about/AboutPage';
import LoginPage from './page/auth/LoginPage';
import RegisterPage from './page/auth/RegisterPage';
import RouteNoFound from './page/error-page/404';
import MainLayout from './component/layout/MainLayout';
import MainLayoutLogin from './component/layout/MainLayoutLogin';
import CustomerPage from './page/customer/CustomerPage';
import ProductPage from './page/product/ProductPage';
import RolePage from './page/role/RolePage';

function App() {
  return (
    <BrowserRouter>
     <Routes>
        {/* Layout */}
          <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/customer' element={<CustomerPage />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/role' element={<RolePage />} />
          
          <Route path='*' element={<RouteNoFound />} />
        </Route>
          {/* Layout */}
          <Route element={<MainLayoutLogin />}>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='*' element={<RouteNoFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
