import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Layout,
  Menu,
  Input,
  Space,
  Avatar,
  Badge,
  Dropdown,
  ConfigProvider,
  Button,
  Typography
} from 'antd'

import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'

import {
  MdDashboardCustomize,
  MdPointOfSale,
  MdOutlinePayments,
  MdOutlineLanguage,
  MdOutlineLocationCity,
  MdOutlineBrandingWatermark,
  MdInventory,
  MdFormatListBulleted,
  MdApps
} from 'react-icons/md'

import { RiCustomerService2Fill, RiUserSharedLine } from 'react-icons/ri'
import { BiCategoryAlt, BiSolidUserBadge } from 'react-icons/bi'
import { AiOutlineShoppingCart, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { BsCashStack } from 'react-icons/bs'
import { CiCloudOn } from 'react-icons/ci'
import { TbScanPosition } from 'react-icons/tb'
import logo from '../../assets/img/logo.png'
import { profileStore } from '../../store/profileStore'
import config from '../../utils/config'
import avatar from '../../assets/img/profile.jpg'
import ServerErrorPage from '../../page/error-page/500'
import { ErrorBoundary } from 'react-error-boundary'
const { Header, Content, Footer, Sider } = Layout

function getItem (label, key, icon, children) {
  return { key, icon, children, label }
}

const items_menu_left_tmp = [
  getItem('Dashboard', '/', <MdDashboardCustomize />),
  getItem('POS', '/pos', <MdPointOfSale />),
  getItem('Orders', '/orders', <AiOutlineShoppingCart />),

  getItem('Report', 'report', <MdDashboardCustomize />, [
    getItem('Report Sales', '/report/top_sales', <BsCashStack />),
    getItem('Order', '/order', <FileTextOutlined />),
    getItem('Purchase', '/report/purchase', <AiOutlineShoppingCart />),
    getItem('Expense', '/report/expense', <MdOutlinePayments />)
  ]),

  getItem('Customer', 'customer', <RiCustomerService2Fill />, [
    getItem('Customers', '/customer', <AiOutlineUsergroupAdd />),
    getItem('Customer Types', '/customer_type', <BiCategoryAlt />)
  ]),

  getItem('Inventory', 'inventory', <MdInventory />, [
    getItem('Products', '/product', <MdFormatListBulleted />),
    getItem('Product Cards', '/product_card', <MdApps />),
    getItem('Categories', '/category', <BiCategoryAlt />),
    getItem('Brands', '/brand', <MdOutlineBrandingWatermark />)
  ]),

  getItem('Purchases', 'purchase', <CiCloudOn />, [
    getItem('Purchase Orders', '/purchase', <AiOutlineShoppingCart />),
    getItem('Suppliers', '/supplier', <RiUserSharedLine />)
  ]),

  getItem('Expenses', 'expense', <BsCashStack />, [
    getItem('Expense List', '/expense', <MdOutlinePayments />),
    getItem('Expense Types', '/expense_type', <BiCategoryAlt />)
  ]),

  getItem('Employees', 'employee', <AiOutlineUsergroupAdd />, [
    getItem('Employee List', '/employee', <UserOutlined />),
    getItem('Employee Payroll', '/employee/payrolls', <UserOutlined />),
    getItem('Payroll', '/payroll', <BsCashStack />),
    getItem('position', '/position', <TbScanPosition />)
  ]),

  getItem('Users', 'user', <UserOutlined />, [
    getItem('User List', '/list', <UserOutlined />),
    getItem('Roles', '/role', <BiSolidUserBadge />),
    getItem('Permissions', '/permission', <SafetyCertificateOutlined />)
  ]),

  getItem('Settings', 'settings', <SettingOutlined />, [
    getItem('Language', '/lang', <MdOutlineLanguage />),
    getItem('Province/City', '/province', <MdOutlineLocationCity />),
    getItem('Currency', '/currency', <BsCashStack />),
    getItem('Payment Methods', '/payment_method', <MdOutlinePayments />)
  ])
]

const MainLayout = () => {
  const { profile, logout, permission } = profileStore()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState([])
  const [items, setItems] = useState([])
  // const protectRoute = () => {
  //   let findIndex = permission?.findIndex(
  //     item => '/' + item.web_route_key === location.pathname
  //   )

  //   if (findIndex === -1) {
  //     for (let i = 0; i < permission?.length; i++) {
  //       if (permission[i].web_route_key !== null) {
  //         navigate(permission[i].web_route_key)
  //         break
  //       }
  //     }
  //   }
  // }
  // const protectRoute = () => {
  //   if (!permission || permission.length === 0) return

  //   let findIndex = permission.findIndex(
  //     item =>
  //       '/' + item.web_route_key === location.pathname ||
  //       item.web_route_key === location.pathname ||
  //       (location.pathname === '/' && item.web_route_key == null)
  //   )

  //   if (findIndex === -1) {
  //     for (let i = 0; i < permission.length; i++) {
  //       if (permission[i].web_route_key !== null) {
  //         navigate('/' + permission[i].web_route_key)
  //         break
  //       }
  //     }
  //   }
  // }
  const protectRoute = () => {
    if (!permission || permission.length === 0) return
    if (location.pathname === '/profile') return
    // Find current route permission
    let findIndex = permission.findIndex(item => {
      const route = item.web_route_key

      return (
        (route && '/' + route === location.pathname) ||
        route === location.pathname ||
        (location.pathname === '/' && route == null)
      )
    })

    // If no access, redirect to first valid route
    if (findIndex === -1) {
      for (let i = 0; i < permission.length; i++) {
        const route = permission[i].web_route_key
        // Skip invalid routes
        if (
          route &&
          typeof route === 'string' &&
          route.trim() !== '' &&
          route !== 'http:' &&
          route !== 'https:' &&
          !route.startsWith('http:') &&
          !route.startsWith('https:')
        ) {
          const cleanRoute = route.startsWith('/') ? route : '/' + route

          navigate(cleanRoute)
          break
        }
      }
    }
  }
  const renderMenuLeft = () => {
    let menu_left = []
    items_menu_left_tmp.forEach(item => {
      let findLevelIndex = permission?.findIndex(
        item1 =>
          '/' + item1.web_route_key === item.key ||
          item1.web_route_key === item.key ||
          (item.key === '/' && item1.web_route_key == null)
      )

      let childTmp = []
      if (item?.children?.length > 0) {
        item.children.forEach(data1 => {
          permission?.forEach(data2 => {
            if (
              data2.web_route_key === data1.key ||
              '/' + data2.web_route_key === data1.key
            ) {
              childTmp.push(data1)
            }
          })
        })
      }

      if (childTmp.length > 0) {
        item.children = childTmp
        menu_left.push(item)
      } else if (findLevelIndex !== -1) {
        menu_left.push(item)
      }
    })
    setItems(menu_left)
  }

  useEffect(() => {
    if (!profile) navigate('/login')
  }, [profile])

  useEffect(() => {
    if (permission && permission.length > 0) {
      renderMenuLeft()
      protectRoute()
    }
  }, [permission, location.pathname])

  const onOpenChange = keys => {
    const rootSubmenuKeys = [
      'report',
      'customer',
      'inventory',
      'purchase',
      'expense',
      'employee',
      'user',
      'settings'
    ]
    const latestOpenKey = keys.find(key => !openKeys.includes(key))
    if (!rootSubmenuKeys.includes(latestOpenKey)) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  if (!profile) return null

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 10,
          colorBgLayout: '#f8fafc'
        },
        components: {
          Menu: {
            darkItemBg: '#000',
            darkItemSelectedBg: '#6366f1',
            darkItemSelectedColor: '#fff',
            darkSubMenuItemBg: '#0a0a0a'
          }
        }
      }}
    >
      <Layout className='min-h-screen'>
        {/* sidebar */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          style={{
            background: '#000',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            height: '100vh',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
          className='flex flex-col border-r border-white/5 shadow-2xl'
        >
          {/*  logo section */}
          <div
            className={`h-20 flex items-center px-6 border-b border-white/5 bg-black sticky top-0 z-20 transition-all ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <img
              src={logo}
              alt='logo'
              className='w-10 h-10 object-contain rounded-xl shadow-lg shadow-indigo-500/20'
            />
            {!collapsed && (
              <div className='ml-3 flex flex-col'>
                <span className='text-white font-bold text-[16px] leading-tight'>
                  APEX <span className='text-indigo-500'>POS</span>
                </span>
                <span className='text-[9px] text-slate-500 font-bold tracking-[0.2em] mt-0.5'>
                  MANAGEMENT
                </span>
              </div>
            )}
          </div>

          {/*  menu section */}
          <div
            className='flex-1 overflow-y-auto overflow-x-hidden'
            style={{
              maxHeight: 'calc(100vh - 80px)',
              paddingBottom: '20px'
            }}
          >
            <Menu
              theme='dark'
              mode='inline'
              items={items}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              selectedKeys={[location.pathname]}
              onClick={e => navigate(e.key)}
              style={{ background: 'transparent' }}
              className='border-none mt-2 font-medium'
            />
          </div>
        </Sider>

        {/* main layout */}
        <Layout
          className='transition-all duration-300'
          style={{ marginLeft: collapsed ? 80 : 260 }}
        >
          {/* header */}
          <Header className='sticky top-0 z-[1000] flex items-center justify-between bg-white/80 backdrop-blur-md px-6 h-16 border-b border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4'>
              <Button
                type='text'
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className='w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600'
              />
              <Input
                placeholder='Search metrics...'
                prefix={<SearchOutlined className='text-slate-400' />}
                className='hidden md:flex w-72 h-10 bg-slate-50 border-none rounded-xl focus:bg-white transition-all'
              />
            </div>

            <Space size={20}>
              <Badge count={5} size='small'>
                <Button
                  type='text'
                  icon={<BellOutlined className='text-xl' />}
                  className='w-10 h-10 rounded-xl'
                />
              </Badge>
              <div className='h-8 w-[1px] bg-slate-200 mx-1' />
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'profile',
                      label: 'Profile',
                      icon: <UserOutlined />
                    },
                    {
                      key: 'settings',
                      label: 'Settings',
                      icon: <SettingOutlined />
                    },
                    {
                      type: 'divider'
                    },
                    {
                      key: 'logout',
                      label: 'Logout',
                      icon: <LogoutOutlined />,
                      danger: true
                    }
                  ],
                  onClick: e => {
                    if (e.key === 'logout') {
                      logout()
                    } else if (e.key === 'profile') {
                      navigate('/profile')
                    } else if (e.key === 'settings') {
                      navigate('/settings')
                    }
                  }
                }}
              >
                <div className='flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 px-2 rounded-xl transition-all'>
                  <div className='text-right hidden sm:block'>
                    <div className='text-sm font-bold text-slate-800 leading-none'>
                      {profile?.name}
                    </div>
                    <div className='text-[11px] text-slate-500 font-medium mt-1 uppercase'>
                      {profile?.role}
                    </div>
                  </div>
                  <Avatar
                    src={
                      profile?.profile?.image
                        ? config.image_path +
                          profile.profile.image +
                          '?t=' +
                          Date.now()
                        : avatar
                    }
                    size={40}
                    className='border-2 border-indigo-50 shadow-sm'
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
            </Space>
          </Header>

          {/* content */}
          <Content className='p-6 min-h-[calc(100vh-140px)]'>
            <div className='animate-in fade-in duration-500'>
              <Outlet />
            </div>
          </Content>

          {/* footer */}
          <Footer className='bg-transparent text-center py-6 text-slate-400 text-xs font-medium'>
            © {new Date().getFullYear()} APEX POS SYSTEM. ALL RIGHTS RESERVED.
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default MainLayout

