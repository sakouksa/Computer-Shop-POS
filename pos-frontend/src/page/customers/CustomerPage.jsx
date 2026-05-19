import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Row,
  Col,
  Typography
} from 'antd'

import {
  FilterOutlined,
  ReloadOutlined,
  SearchOutlined,
  ExclamationCircleFilled,
  PlusOutlined
} from '@ant-design/icons'

import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'

// Utils & Services
import { dateClient, isPermissionAction } from '../../utils/helper'
import { customerService } from '../../services/customerService'

// Components
import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'

const { Title, Text } = Typography

function CustomerPage () {
  const [formRef] = Form.useForm()

  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: '',
    status: null
  })

  const [isServerError, setIsServerError] = useState(false)
  const [validate, setValidate] = useState({})

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getList = async (param_filter = {}) => {
    const finalFilter = {
      ...filter,
      ...param_filter
    }

    // Start loading and reset error state
    setState(pre => ({
      ...pre,
      loading: true
    }))
    setIsServerError(false)

    try {
      const res = await customerService.getList(finalFilter)

      if (res && !res.errors) {
        // Success: Update list and total count
        setState(pre => ({
          ...pre,
          total: res.total || res.list?.length || 0,
          list: res.list || []
        }))
      } else {
        // API Error: Handle specific status codes (500, 403, etc.)
        const status = res?.errors?.status
        if (status === 500) {
          setIsServerError(true)
        } else if (status === 403) {
          message.error("You don't have permission to view this list.")
        } else {
          message.error(res?.errors?.message || 'Something went wrong!')
        }
      }
    } catch (error) {
      // Network/System Crash: Show server error UI
      setIsServerError(true)
      message.error('Server error occurred')
    } finally {
      // Cleanup: Always stop loading regardless of result
      setState(pre => ({
        ...pre,
        loading: false
      }))
    }
  }
  // Handle Modal Open
  const handleOpenModal = () => {
    formRef.resetFields()
    setValidate({})
    setState(pre => ({ ...pre, open: true }))
  }

  // Handle Modal Close
  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setValidate({})
  }

  // Reset filter
  const handleReset = () => {
    const resetFilter = { txt_search: '', status: null }
    setFilter(resetFilter)
    getList(resetFilter)
  }

  // save / update data
  const onFinish = async item => {
    setState(pre => ({ ...pre, loading: true }))
    let res = null

    const id = formRef.getFieldValue('id')
    if (id) {
      res = await customerService.update(id, item)
    } else {
      res = await customerService.create(item)
    }

    if (res && !res.errors) {
      message.success(res.message || 'Success!')
      handleCloseModal()
      getList()
    } else {
      setValidate(res.errors || {})
      message.error(res?.errors?.message || 'Failed to perform action!')
      setState(pre => ({ ...pre, loading: false }))
    }
  }

  // edit
  const handleEdit = data => {
    formRef.setFieldsValue({ ...data })
    setValidate({})
    setState(pre => ({ ...pre, open: true }))
  }

  // delete
  const handleDelete = data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete customer "${data.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        const res = await customerService.delete(data.id)
        if (res && !res.error) {
          message.success(res.message || 'Deleted successfully!')
          getList()
        } else {
          message.error(res?.errors?.message || 'Delete failed!')
        }
      }
    })
  }

  if (isServerError) {
    return <ServerErrorPage onRetry={() => getList()} />
  }

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}
      {/* Header Section */}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex items-center gap-2'>
              Customer Management
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total || 0}
              </span>
            </h2>
            <Text type='secondary' className='text-sm'>
              Maintain and manage your customer database.
            </Text>
          </div>

          {isPermissionAction('customer.create') && (
            <Button
              type='primary'
              onClick={handleOpenModal}
              icon={<PlusOutlined />}
              className='bg-indigo-600 hover:bg-indigo-700'
            >
              Add Customer
            </Button>
          )}
        </div>

        {/* Filter Section */}
        <div className='border-t border-gray-100 pt-6'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <Input
              allowClear
              placeholder='Search by name, email, or phone...'
              value={filter.txt_search}
              onChange={e =>
                setFilter(pre => ({ ...pre, txt_search: e.target.value }))
              }
              onPressEnter={() => getList()}
              prefix={<SearchOutlined className='text-gray-400 mr-2' />}
              style={{ width: 300 }}
            />

            <div className='flex items-center gap-3'>
              <Select
                allowClear
                placeholder='Status'
                style={{ width: 150 }}
                value={filter.status}
                onChange={value =>
                  setFilter(pre => ({ ...pre, status: value }))
                }
                options={[
                  { label: 'Active', value: 1 },
                  { label: 'Inactive', value: 0 }
                ]}
              />

              <div className='flex gap-2'>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  Reset
                </Button>
                <Button
                  type='primary'
                  onClick={() => getList()}
                  icon={<FilterOutlined />}
                  className='bg-indigo-600 border-0 hover:bg-indigo-700'
                >
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPermissionAction('customer.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          className='shadow-sm rounded-xl overflow-hidden bg-white'
          scroll={{ x: 1000 }}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              fixed: 'left',
              render: text => (
                <span className='font-medium text-gray-700'>{text}</span>
              )
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Phone', dataIndex: 'phone' },
            {
              title: 'Address',
              dataIndex: 'address',
              render: text => text || <Text type='secondary'>N/A</Text>
            },
            {
              title: 'Status',
              dataIndex: 'status',
              align: 'center',
              render: v => (
                <Tag
                  color={v === 1 ? 'green' : 'red'}
                  className='rounded-full px-3'
                >
                  {v === 1 ? 'Active' : 'Inactive'}
                </Tag>
              )
            },
            {
              title: 'Created At',
              dataIndex: 'created_at',
              render: value => dateClient(value)
            },
            {
              title: 'Action',
              align: 'center',
              fixed: 'right',
              width: 120,
              render: (_, data) => (
                <Space>
                  {isPermissionAction('customer.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('customer.delete') && (
                    <Button
                      type='text'
                      danger
                      onClick={() => handleDelete(data)}
                      icon={<MdDelete style={{ fontSize: 18 }} />}
                    />
                  )}
                </Space>
              )
            }
          ]}
        />
      ) : (
        <div className='text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
          <Title level={4} type='danger'>
            Access Denied
          </Title>
          <Text type='secondary'>
            You do not have permission to view this data!
          </Text>
        </div>
      )}

      {/* Modal Section */}
      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Customer'
            : 'Create New Customer'
        }
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={650}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Full Name'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder='Enter customer name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Email Address'
                name='email'
                {...validate.email}
                rules={[
                  { required: true, message: 'Please enter email!' },
                  { type: 'email', message: 'Invalid email format!' }
                ]}
              >
                <Input placeholder='Enter email address' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Phone Number'
                name='phone'
                {...validate.phone}
                rules={[
                  { required: true, message: 'Please enter phone number!' }
                ]}
              >
                <Input placeholder='Enter phone number' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Status' name='status' initialValue={1}>
                <Select
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Address' name='address'>
                <Input.TextArea rows={3} placeholder='Enter physical address' />
              </Form.Item>
            </Col>
          </Row>
          <div className='text-right mt-6'>
            <Space>
              <Button onClick={handleCloseModal} className='rounded-lg'>
                Cancel
              </Button>
              <Button
                type='primary'
                htmlType='submit'
                icon={
                  formRef.getFieldValue('id') ? (
                    <BiSolidEditAlt />
                  ) : (
                    <RiSave3Fill />
                  )
                }
                className='bg-indigo-600 rounded-lg'
              >
                {formRef.getFieldValue('id') ? 'Update' : 'Save'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

export default CustomerPage
