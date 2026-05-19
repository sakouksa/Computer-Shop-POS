import React from 'react'
import { Result, Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const Error403 = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <Result
        status='403'
        title='403'
        subTitle={
          <div className='flex flex-col gap-1'>
            <Text strong className='text-lg'>
              Access Denied: Restricted Module
            </Text>
            <Text type='secondary'>
              It looks like you don't have the necessary permissions to view
              this section. This could be due to your current role or
              administrative restrictions.
            </Text>
            <Text type='secondary' className='mt-2'>
              If you believe this is an error, please contact your{' '}
              <strong>System Administrator</strong> to update your access
              rights.
            </Text>
          </div>
        }
        extra={
          <Button
            type='primary'
            onClick={() => navigate('/')}
            className='h-10 px-8 rounded-md bg-[#1677ff]'
          >
            Back to Dashboard
          </Button>
        }
      />
    </div>
  )
}

export default Error403
