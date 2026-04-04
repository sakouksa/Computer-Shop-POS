import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./page/home/HomePage";
import AboutPage from "./page/about/AboutPage";
import LoginPage from "./page/auth/LoginPage";
import RegisterPage from "./page/auth/RegisterPage";
import RouteNoFound from "./page/error-page/404";
import MainLayout from "./component/layout/MainLayout";
import CustomerPage from "./page/customer/CustomerPage";
import ProductPage from "./page/product/ProductPage";
import RolePage from "./page/role/RolePage";
import CategoryPage from "./page/category/CategoryPage";
import ProvincePage from "./page/province/ProvincePage";

// Import Ant Design
import { ConfigProvider, App as AntdApp } from "antd";

// Import Fonts
import "@fontsource/kantumruy-pro";
import "@fontsource/kantumruy-pro/700.css";
// import ServerErrorPage from "./page/error-page/500";
import BrandPage from "./page/brand/BrandPage";
import ProductPageItemCard from "./page/product/ProductPageItemCard";
import ImagePreviewGlobal from "./component/image/ImagePreviewGlobal";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Kantumruy Pro', sans-serif",
          fontSize: 15,
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <Routes>
            {/* Layout Main */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/product-card" element={<ProductPageItemCard />} />
              <Route path="/role" element={<RolePage />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/brand" element={<BrandPage />} />
              <Route path="/province" element={<ProvincePage />} />
            </Route>

            {/* Layout Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* ២.  /500  Error Server
            <Route path="/500" element={<ServerErrorPage />} /> */}

            {/* 404 Page NoFound */}
            <Route path="*" element={<RouteNoFound />} />
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
