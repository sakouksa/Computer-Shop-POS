import React from "react";
import { Button, Result } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const ServerErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white">
      <Result
        status="500"
        title={<span className="text-7xl font-extrabold text-red-500 leading-none">500</span>}
        subTitle={
          <div className="mt-3 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Technical Issue!
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
              {error?.message ||
                "Sorry! The server is currently experiencing an internal issue. Please try again later."}
            </p>
          </div>
        }
        extra={
          <Button
            type="primary"
            size="large"
            icon={<ReloadOutlined />}
            onClick={resetErrorBoundary || (() => window.location.reload())}
            className="!h-11 !px-8 !rounded-lg !bg-primary !border-0"
          >
            Try Again
          </Button>
        }
      />
    </div>
  );
};

export default ServerErrorPage;