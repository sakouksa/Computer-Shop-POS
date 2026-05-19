import './App.css';
import { ConfigProvider, App as AntdApp } from 'antd';
import AppRoute from './routes/AppRoute';

// Import Fonts
import '@fontsource/kantumruy-pro';
import '@fontsource/kantumruy-pro/700.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Kantumruy Pro', sans-serif",
          fontSize: 15,
          colorPrimary: '#1677ff',
        },
      }}
    >
      <AntdApp>
        <AppRoute/>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;