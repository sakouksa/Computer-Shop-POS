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
  InputNumber,
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
import { ExpenseService } from '../../services/ExpenseService'
import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'
import { FiDownload } from 'react-icons/fi'
import { exportFile } from '../../utils/exportFile'

const { Title, Text } = Typography

function ExpensePage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
    expense_types: []
  })
  const [isServerError, setIsServerError] = useState(false)
  const [filter, setFilter] = useState({
    txt_search: '',
    expense_type_id: null,
    expense_status: null
  })

  useEffect(() => {
    getList()
  }, [])

  const getList = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))
    setIsServerError(false)

    try {
      const res = await ExpenseService.getList(currentFilter)
      if (res && !res.errors) {
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || [],
          expense_types: res.expense_type || []
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
        expense_date: values.expense_date?.format('YYYY-MM-DD'),
        created_by: 1 // Example ID, replace with actual user auth ID
      }
      let res = values.id
        ? await ExpenseService.update(values.id, payload)
        : await ExpenseService.create(payload)

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
      expense_date: data.expense_date ? dayjs(data.expense_date) : null
    })
    setState(pre => ({ ...pre, open: true }))
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete this record?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await ExpenseService.delete(data.id)
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
    const data = { txt_search: '', expense_type_id: null, expense_status: null }
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
              Expense Management
              <span className='ml-2 text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total}
              </span>
            </h2>
            <Text type='secondary'>Manage and track company expenses.</Text>
          </div>
          <div className='flex items-center gap-3'>
            {isPermissionAction('expense.create') && (
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
            placeholder='Search name...'
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
              placeholder='Expense Type'
              style={{ width: 180 }}
              value={filter.expense_type_id}
              onChange={v => setFilter(p => ({ ...p, expense_type_id: v }))}
              options={state.expense_types?.map(item => ({
                label: item.name,
                value: item.id
              }))}
            />
            <Select
              allowClear
              placeholder='Status'
              style={{ width: 120 }}
              value={filter.expense_status}
              onChange={v => setFilter(p => ({ ...p, expense_status: v }))}
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Paid', value: 'paid' },
                { label: 'Cancel', value: 'cancel' }
              ]}
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
        title={formRef.getFieldValue('id') ? 'Update Expense' : 'Add Expense'}
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
                label='Expense Name'
                name='name'
                rules={[{ required: true }]}
              >
                <Input placeholder='Enter name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Expense Type'
                name='expense_type_id'
                rules={[{ required: true }]}
              >
                <Select
                  placeholder='Select type'
                  options={state.expense_types?.map(i => ({
                    label: i.name,
                    value: i.id
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Amount'
                name='amount'
                rules={[{ required: true }]}
              >
                <InputNumber className='w-full' prefix='$' min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Date'
                name='expense_date'
                rules={[{ required: true }]}
              >
                <DatePicker className='w-full' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label='Status'
                name='expense_status'
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { label: 'Pending', value: 'pending' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Cancel', value: 'cancel' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Description' name='description'>
                <Input.TextArea rows={1} placeholder='Optional' />
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
      {isPermissionAction('position.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            { title: 'Date', dataIndex: 'expense_date' },
            { title: 'Expense Name', dataIndex: 'name' },
            { title: 'Type', render: (_, row) => row.expense_type?.name },
            { title: 'Amount', dataIndex: 'amount', render: v => `$${v}` },
            {
              title: 'Status',
              dataIndex: 'expense_status',
              render: status => {
                let color =
                  status === 'paid'
                    ? 'green'
                    : status === 'pending'
                    ? 'orange'
                    : 'red'
                return <Tag color={color}>{status.toUpperCase()}</Tag>
              }
            },
            {
              title: 'Actions',
              align: 'center',
              hidden: !(
                isPermissionAction('position.update') ||
                isPermissionAction('position.delete')
              ),
              render: (_, data) => (
                <Space>
                  {isPermissionAction('expense.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('expense.delete') && (
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
            You do not have permission to view payroll data!
          </Text>
        </div>
      )}
    </div>
  )
}

export default ExpensePage
