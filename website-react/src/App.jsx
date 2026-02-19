import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import AboutPage from "./page/about/AboutPage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import RouteNoFound from "./page/error-page/404";
import MainLayout from "./component/layout/MainLayout";
import MainLayoutLogin from "./component/layout/MainLayoutLogin";
import CustomerPage from "./page/customer/CustomerPage";
import ProductPage from "./page/product/ProductPage";
import RolePage from "./page/role/RolePage";
import { ConfigProvider, App as AntdApp } from "antd"; // Import AntdApp
// Import Ant Design ConfigProvider
// Import Font (អ្នកបានដំឡើងរួចហើយ)
import "@fontsource/kantumruy-pro";
import "@fontsource/kantumruy-pro/700.css";
import CategoryPage from "./page/category/CategoryPage";
import ProvincePage from "./page/province/ProvincePage";

function App() {
  return (
    // ប្រើ ConfigProvider ដើម្បីកំណត់ Font ឱ្យគ្រប់ Antd Components
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Kantumruy Pro', sans-serif",
          fontSize: 15, // ដំឡើងទំហំអក្សរបន្តិចឱ្យស្រួលអាន
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Layout Main */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/role" element={<RolePage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/province" element={<ProvincePage />} />
            <Route path="*" element={<RouteNoFound />} />
          </Route>

          {/* Layout Login */}
          <Route element={<MainLayoutLogin />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<RouteNoFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
