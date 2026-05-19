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
  Typography,
  DatePicker
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
import dayjs from 'dayjs'

import { isPermissionAction } from '../../utils/helper'
import { customerService } from '../../services/customerService'
import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'

const { Title, Text } = Typography

function CustomerPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
    customer_types: []
  })
  const [isServerError, setIsServerError] = useState(false)
  const [filter, setFilter] = useState({
    txt_search: '',
    customer_type_id: null
  })

  useEffect(() => {
    getList()
  }, [])

  const getList = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))
    setIsServerError(false)

    try {
      const res = await customerService.getList(currentFilter)
      if (res && !res.errors) {
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || [],
          customer_types: res.customer_types || [] // select array customer_type backend
        }))
      } else {
        if (res?.errors?.status === 500) setIsServerError(true)
        else message.error(res?.errors?.message || 'Failed to fetch data')
      }
    } catch (error) {
      setIsServerError(true)
    } finally {
      setState(pre => ({ ...pre, loading: false }))
    }
  }

  const onFinish = async values => {
    try {
      const payload = {
        ...values,
        dob: values.dob ? values.dob.format('YYYY-MM-DD') : null
      }
      let res = values.id
        ? await customerService.update(values.id, payload)
        : await customerService.create(payload)

      if (res && !res.errors) {
        message.success(res.message || 'Success!')
        handleCloseModal()
        getList()
      } else {
        message.error(res?.errors?.message || 'Operation failed!')
      }
    } catch (error) {
      message.error('Server error occurred.')
    }
  }

  const handleEdit = data => {
    formRef.setFieldsValue({
      ...data,
      dob: data.dob ? dayjs(data.dob) : null
    })
    setState(pre => ({ ...pre, open: true }))
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete ${data.first_name} ${data.last_name}?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await customerService.delete(data.id)
          if (res && !res.error) {
            message.success('Deleted successfully!')
            getList()
          }
        } catch (error) {
          message.error('Error deleting.')
        }
      }
    })
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
  }

  const handleReset = () => {
    const data = { txt_search: '', customer_type_id: null }
    setFilter(data)
    getList(data)
  }

  if (isServerError) return <ServerErrorPage onRetry={() => getList()} />

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}

      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0'>
              Customer Management
              <span className='ml-2 text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total}
              </span>
            </h2>
            <Text type='secondary'>
              Manage your shop customers and membership tiers.
            </Text>
          </div>
          <div className='flex items-center gap-3'>
            {isPermissionAction('customer.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={() => setState(p => ({ ...p, open: true }))}
                className='bg-indigo-600'
              >
                Add New
              </Button>
            )}
          </div>
        </div>

        <div className='border-t border-gray-100 pt-6 flex flex-wrap justify-between items-center gap-4'>
          <Input
            placeholder='Search name or tel...'
            value={filter.txt_search}
            onChange={e =>
              setFilter(p => ({ ...p, txt_search: e.target.value }))
            }
            onPressEnter={() => getList()}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <div className='flex items-center gap-3'>
            <Select
              allowClear
              placeholder='Membership Level'
              style={{ width: 180 }}
              value={filter.customer_type_id}
              onChange={v => setFilter(p => ({ ...p, customer_type_id: v }))}
              options={state.customer_types?.map(item => ({
                label: item.name,
                value: item.id
              }))}
            />
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              Reset
            </Button>
            <Button
              type='primary'
              onClick={() => getList()}
              icon={<FilterOutlined />}
              className='bg-indigo-600'
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Customer Record'
            : 'Add New Customer'
        }
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={700}
      >
        <Form layout='vertical' form={formRef} onFinish={onFinish}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='First Name'
                name='first_name'
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder='Enter first name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Last Name'
                name='last_name'
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder='Enter last name' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Gender'
                name='gender'
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select
                  placeholder='Select gender'
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Date of Birth' name='dob'>
                <DatePicker className='w-full' format='YYYY-MM-DD' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Telephone'
                name='tel'
                rules={[
                  { required: true, message: 'Telephone string is required' }
                ]}
              >
                <Input placeholder='Enter phone number' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Membership Tier'
                name='customer_type_id'
                rules={[
                  { required: true, message: 'Please map a tier profile' }
                ]}
              >
                <Select
                  placeholder='Select level'
                  options={state.customer_types?.map(i => ({
                    label: i.name,
                    value: i.id
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label='Address' name='address'>
                <Input.TextArea
                  rows={2}
                  placeholder='Enter current address line'
                />
              </Form.Item>
            </Col>
          </Row>
          <div className='text-right mt-6'>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
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
                className='bg-indigo-600'
              >
                {formRef.getFieldValue('id') ? 'Update' : 'Save'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
      {isPermissionAction('customer.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          scroll={{ x: 'max-content' }}
          columns={[
            {
              title: 'Customer Name',
              render: (_, row) => `${row.first_name} ${row.last_name}`,
              fixed: 'left'
            },
            { title: 'Gender', dataIndex: 'gender' },
            {
              title: 'Date of Birth',
              dataIndex: 'dob',
              render: date => (date ? dayjs(date).format('YYYY-MM-DD') : '-')
            },
            { title: 'Telephone', dataIndex: 'tel' },
            {
              title: 'Membership Tier',
              render: (_, row) => {
                const tierName = row.customer_type?.name || 'General'
                let color = 'blue'
                if (tierName.toLowerCase() === 'silver') color = 'gray'
                if (tierName.toLowerCase() === 'gold') color = 'gold'
                if (tierName.toLowerCase() === 'platinum') color = 'purple'
                return <Tag color={color}>{tierName.toUpperCase()}</Tag>
              }
            },
            { title: 'Address', dataIndex: 'address', ellipsis: true },
            {
              title: 'Actions',
              align: 'center',
              width: 110,
              fixed: 'right',
              hidden: !(
                isPermissionAction('customer.update') ||
                isPermissionAction('customer.delete')
              ),
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
            You do not have permission to view customer dashboard parameters!
          </Text>
        </div>
      )}
    </div>
  )
}

export default CustomerPage
