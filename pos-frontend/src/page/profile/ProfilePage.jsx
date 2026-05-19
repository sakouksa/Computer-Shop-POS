import React, { useEffect, useState } from 'react'
import {
  Card,
  Input,
  Button,
  Upload,
  Form,
  message,
  Divider,
  Row,
  Col,
  Space,
  Typography,
  Tabs,
  Avatar
} from 'antd'
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CameraOutlined,
  LockOutlined,
  CheckCircleFilled,
  EditFilled,
  EditOutlined
} from '@ant-design/icons'
import { RiSave3Fill } from 'react-icons/ri'
import { profileService } from '../../services/profileService'
import { profileStore } from '../../store/profileStore'
import config from '../../utils/config'
import PageLoader from '../../component/common/PageLoader'
import { MdBrowserUpdated, MdUpdate } from 'react-icons/md'
import { LiaUserEditSolid } from 'react-icons/lia'
import { RxUpdate } from 'react-icons/rx'
const { Text, Title } = Typography

const ProfilePage = () => {
  const [formProfile] = Form.useForm()
  const [formPassword] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [userData, setUserData] = useState(null)

  const setProfile = profileStore(state => state.setProfile)
  const nameWatch = Form.useWatch('name', formProfile)

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const res = await profileService.getProfile()
    const data = res?.data || res

    if (data && !data.errors) {
      setUserData(data)
      formProfile.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.profile?.phone || '',
        address: data.profile?.address || ''
      })

      if (data.profile?.image) {
        setFileList([
          {
            uid: '-1',
            name: data.profile.image,
            status: 'done',
            url: config.image_path + data.profile.image
          }
        ])
      }
    }
    setLoading(false)
  }

  const onUpdateProfile = async values => {
    setLoading(true)
    const formData = new FormData()
    formData.append('name', values.name || '')
    formData.append('phone', values.phone || '')
    formData.append('address', values.address || '')

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj)
    } else if (fileList.length === 0) {
      formData.append('image_remove', 'true')
    }

    const res = await profileService.updateProfile(formData)
    if (res && !res.errors) {
      message.success('Profile updated successfully!')
      if (res.data) setProfile(res.data)
      await getList()
    } else {
      message.error(res?.message || 'Update failed')
    }
    setLoading(false)
  }

  const onChangePassword = async values => {
    setLoading(true)
    const res = await profileService.changePassword(values)
    if (res && !res.errors) {
      message.success('Password changed successfully!')
      formPassword.resetFields()
    } else {
      message.error(res?.message || 'Current password incorrect')
    }
    setLoading(false)
  }

  return (
    <div className='p-4 md:p-8 bg-[#f8fafc] min-h-screen'>
      {loading && <PageLoader />}

      <div className='max-w-6xl mx-auto'>
        <header className='mb-8'>
          <Title level={3} className='!m-0 !font-bold text-slate-500'>
            Account Settings
          </Title>
          <Text className='text-slate-500'>
            Manage your POS administrator profile and security.
          </Text>
        </header>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className='shadow-sm rounded-2xl overflow-hidden border-none text-center'>
              <div className='h-24 bg-gradient-to-r from-indigo-600 to-blue-500 -mx-6 -mt-6 mb-12 relative'>
                <div className='absolute -bottom-10 left-1/2 -translate-x-1/2'>
                  <div className='relative'>
                    <Avatar
                      size={100}
                      src={
                        fileList.length > 0
                          ? fileList[0].url ||
                            (fileList[0].originFileObj &&
                              URL.createObjectURL(fileList[0].originFileObj))
                          : userData?.profile?.image
                          ? config.image_path + userData.profile.image
                          : null
                      }
                      icon={
                        !fileList.length &&
                        !userData?.profile?.image && <UserOutlined />
                      }
                      className='border-4 border-white shadow-xl bg-slate-200 object-cover'
                    />
                    <div className='absolute bottom-1 right-1'>
                      <Upload
                        customRequest={({ onSuccess }) => onSuccess('ok')}
                        showUploadList={false}
                        onChange={({ fileList }) => setFileList(fileList)}
                        maxCount={1}
                        accept='image/*'
                      >
                        <Button
                          type='primary'
                          shape='circle'
                          icon={<CameraOutlined />}
                          size='middle'
                          className='flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform bg-indigo-600'
                        />
                      </Upload>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-2'>
                <Title level={4} className='!mb-0 !font-bold text-slate-800'>
                  {nameWatch || userData?.name}
                </Title>
                <div className='flex items-center justify-center gap-1 text-indigo-600 font-medium text-xs uppercase tracking-wider mt-1'>
                  <CheckCircleFilled /> {userData?.role || 'Supper Admin'}
                </div>
              </div>

              <Divider className='my-6' />

              <div className='text-left space-y-4 px-2'>
                <div>
                  <Text className='text-[10px] uppercase font-bold text-slate-400 block mb-1'>
                    Email Address
                  </Text>
                  <div className='flex items-center gap-2 text-slate-700'>
                    <MailOutlined /> {userData?.email}
                  </div>
                </div>
                <div>
                  <Text className='text-[10px] uppercase font-bold text-slate-400 block mb-1'>
                    Phone Number
                  </Text>
                  <div className='flex items-center gap-2 text-slate-700'>
                    <PhoneOutlined /> {userData?.profile?.phone || 'Not set'}
                  </div>
                </div>
                <div>
                  <Text className='text-[10px] uppercase font-bold text-slate-400 block mb-1'>
                    Location
                  </Text>
                  <div className='flex items-center gap-2 text-slate-700'>
                    <HomeOutlined /> {userData?.profile?.address || 'Not set'}
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card className='shadow-sm rounded-2xl border-none min-h-[500px]'>
              <Tabs
                defaultActiveKey='1'
                className='custom-tabs'
                items={[
                  {
                    key: '1',
                    label: (
                      <span className='px-4 font-medium'>
                        General Information
                      </span>
                    ),
                    children: (
                      <Form
                        form={formProfile}
                        layout='vertical'
                        onFinish={onUpdateProfile}
                        className='mt-6 px-2'
                      >
                        <Row gutter={16}>
                          <Col span={24} md={12}>
                            <Form.Item
                              label='Display Name'
                              name='name'
                              rules={[{ required: true }]}
                            >
                              <Input
                                prefix={<UserOutlined />}
                                className=' rounded-lg'
                                placeholder='Enter full name'
                              />
                            </Form.Item>
                          </Col>
                          {/* <Col span={24} md={12}>
                            <Form.Item label='Email (Contact)' name='email'>
                              <Input
                                prefix={<MailOutlined />}
                                disabled
                                className=' rounded-lg bg-slate-50'
                              />
                            </Form.Item>
                          </Col> */}
                          <Col span={24} md={12}>
                            <Form.Item label='Phone' name='phone'>
                              <Input
                                prefix={<PhoneOutlined />}
                                className=' rounded-lg'
                                placeholder='012 345 678'
                              />
                            </Form.Item>
                          </Col>
                          <Col span={24} md={12}>
                            <Form.Item label='Office Address' name='address'>
                              <Input
                                prefix={<HomeOutlined />}
                                className=' rounded-lg'
                                placeholder='Phnom Penh'
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                        <div className='flex justify-end pt-4'>
                          <Button
                            type='primary'
                            htmlType='submit'
                            icon={<LiaUserEditSolid />}
                            className='hover:bg-indigo-700'
                          >
                            Save Changes
                          </Button>
                        </div>
                      </Form>
                    )
                  },
                  {
                    key: '2',
                    label: <span className='px-4 font-medium'>Security</span>,
                    children: (
                      <Form
                        form={formPassword}
                        layout='vertical'
                        onFinish={onChangePassword}
                        className='mt-6 px-2 max-w-md'
                      >
                        <Form.Item
                          label='Current Password'
                          name='old_password'
                          rules={[{ required: true }]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            className=' rounded-lg'
                          />
                        </Form.Item>
                        <Form.Item
                          label='New Password'
                          name='new_password'
                          rules={[{ required: true, min: 6 }]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            className='rounded-lg'
                          />
                        </Form.Item>
                        <Form.Item
                          label='Confirm New Password'
                          name='new_password_confirmation'
                          dependencies={['new_password']}
                          rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                              validator (_, v) {
                                if (!v || getFieldValue('new_password') === v)
                                  return Promise.resolve()
                                return Promise.reject('Passwords do not match!')
                              }
                            })
                          ]}
                        >
                          <Input.Password
                            prefix={<LockOutlined />}
                            className=' rounded-lg'
                          />
                        </Form.Item>
                        <Button
                          type='primary'
                          htmlType='submit'
                          icon={<RxUpdate />}
                          danger
                          className='rounded-lg mt-2'
                        >
                          Change Password
                        </Button>
                      </Form>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ProfilePage
