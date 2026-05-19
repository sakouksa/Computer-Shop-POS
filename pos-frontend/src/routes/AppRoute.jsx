import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLoader from '../component/common/PageLoader';
import PositionPage from '../page/employees/PositionPage';
import EmployeePage from '../page/employees/EmployeePage';
import PayrollPage from '../page/employees/PayrollPage';
import EmployeePayrollPage from '../page/employees/EmployeePayrollPage';
import ProfilePage from '../page/profile/ProfilePage';
import ExpensePage from '../page/expenses/ExpensePage';
import ExpenseTypePage from '../page/expenses/ExpenseTypePage';

const MainLayout = lazy(() => import('../component/layout/MainLayout'));
const Dashboard = lazy(() => import('../page/dashboard/DashboardPage'));
const PosPage = lazy(() => import('../page/pos/PosPage'));
const AboutPage = lazy(() => import('../page/about/AboutPage'));
const CustomerPage = lazy(() => import('../page/customers/CustomerPage'));
const ProductPage = lazy(() => import('../page/inventory/ProductPage'));
const ProductPageItemCard = lazy(() => import('../page/inventory/ProductPageItemCard'));
const CategoryPage = lazy(() => import('../page/inventory/CategoryPage'));
const BrandPage = lazy(() => import('../page/inventory/BrandPage'));
const ProvincePage = lazy(() => import('../page/settings/ProvincePage'));
const PaymentMethodPage = lazy(() => import('../page/settings/PaymentMethodPage'));
const RolePage = lazy(() => import('../page/users/RolePage'));

const LoginPage = lazy(() => import('../page/auth/LoginPage'));
const RegisterPage = lazy(() => import('../page/auth/RegisterPage'));
const Error403 = lazy(() => import('../page/error-page/403'));
const ServerErrorPage = lazy(() => import('../page/error-page/500'));
const RouteNoFound = lazy(() => import('../page/error-page/404'));

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/product_card" element={<ProductPageItemCard />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/province" element={<ProvincePage />} />
            <Route path="/payment_method" element={<PaymentMethodPage />} />
            <Route path="/position" element={<PositionPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/employee/payrolls" element={<EmployeePayrollPage />} />
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/expense" element={<ExpensePage />} />
            <Route path="/expense_type" element={<ExpenseTypePage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/403" element={<Error403 />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="*" element={<RouteNoFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoute;