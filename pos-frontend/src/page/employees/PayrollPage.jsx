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

import {
  dateClient,
  dateServer,
  isPermissionAction,
  formatToPicker
} from '../../utils/helper'

import { PayrollService } from '../../services/payrollService'

import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'

const { Title, Text } = Typography

function PayrollPage () {
  const [formRef] = Form.useForm()

  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })

  const [isServerError, setIsServerError] = useState(false)

  const [filter, setFilter] = useState({
    txt_search: '',
    status: null
  })

  const [validate, setValidate] = useState({})

  useEffect(() => {
    getList()
  }, [])

  const getList = async (param_filter = {}) => {
    const currentFilter = {
      ...filter,
      ...param_filter
    }

    setState(pre => ({
      ...pre,
      loading: true
    }))

    setIsServerError(false)

    try {
      const res = await PayrollService.getList(currentFilter)

      if (res && !res.errors) {
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || []
        }))
      } else {
        const status = res?.errors?.status
        if (status === 500) {
          setIsServerError(true)
        } else if (status === 403) {
          setIsServerError(false)
          message.error("You don't have permission to view this list.")
        } else {
          message.error(res?.errors?.message || 'Something went wrong!')
        }
      }
    } catch (error) {
      setIsServerError(true)
    } finally {
      setState(pre => ({
        ...pre,
        loading: false
      }))
    }
  }

  const onFinish = async values => {
    try {
      const payload = {
        ...values,
        payment_date: dateServer(values.payment_date)
      }

      let res

      if (values.id) {
        res = await PayrollService.update(values.id, payload)
      } else {
        res = await PayrollService.create(payload)
      }

      if (res && !res.errors) {
        message.success(
          res.message ||
            (values.id
              ? 'Payroll updated successfully!'
              : 'Payroll created successfully!')
        )

        handleCloseModal()
        getList()
      } else {
        message.error(res?.errors?.message || 'Operation failed!')
      }
    } catch (error) {
      console.error('Save Payroll Error:', error)

      message.error('Server error occurred while saving payroll.')
    }
  }

  const handleEdit = data => {
    formRef.setFieldsValue({
      ...data,
      payment_date: formatToPicker(data.payment_date)
    })

    setState(pre => ({
      ...pre,
      open: true
    }))
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete payroll "${data.title}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await PayrollService.delete(data.id)

          if (res && !res.error) {
            message.success(res.message || 'Deleted successfully!')
            getList()
          } else {
            message.error(res?.message || 'Delete failed!')
          }
        } catch (error) {
          message.error('Server error occurred while deleting.')
        }
      }
    })
  }

  const handleOpenModal = () => {
    setState(pre => ({
      ...pre,
      open: true
    }))
  }

  const handleCloseModal = () => {
    setState(pre => ({
      ...pre,
      open: false
    }))

    formRef.resetFields()
    setValidate({})
  }

  const handleReset = () => {
    const resetFilter = {
      txt_search: '',
      status: null
    }

    setFilter(resetFilter)

    getList(resetFilter)
  }

  // SERVER ERROR UI
  if (isServerError) {
    return <ServerErrorPage onRetry={() => getList()} />
  }

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}

      {/* Header */}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex flex-col md:flex-row md:items-center gap-2'>
              Payroll Management
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit'>
                Total: {state.total || 0}
              </span>
            </h2>

            <Text type='secondary'>
              Track and manage employee payroll records.
            </Text>
          </div>

          {isPermissionAction('payroll.create') && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className='bg-indigo-600 border-0'
            >
              Add Payroll
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className='border-t border-gray-100 pt-6 flex flex-wrap justify-between items-center gap-4'>
          <Input
            allowClear
            placeholder='Search by title...'
            value={filter.txt_search}
            onChange={e =>
              setFilter(pre => ({
                ...pre,
                txt_search: e.target.value
              }))
            }
            onPressEnter={() => getList()}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />

          <div className='flex items-center gap-3'>
            <Select
              allowClear
              placeholder='Status'
              style={{ width: 150 }}
              value={filter.status}
              onChange={value =>
                setFilter(pre => ({
                  ...pre,
                  status: value
                }))
              }
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Paid', value: 'paid' }
              ]}
            />

            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Reset
            </Button>

            <Button
              type='primary'
              icon={<FilterOutlined />}
              onClick={() => getList()}
              className='bg-indigo-600 border-0'
            >
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={
          formRef.getFieldValue('id') ? 'Update Payroll' : 'Create New Payroll'
        }
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={600}
      >
        <Form layout='vertical' form={formRef} onFinish={onFinish}>
          <Form.Item name='id' hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label='Payroll Title'
                name='title'
                rules={[
                  {
                    required: true,
                    message: 'Please enter title!'
                  }
                ]}
              >
                <Input placeholder='Enter payroll title' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='Payment Date'
                name='payment_date'
                rules={[
                  {
                    required: true,
                    message: 'Select payment date!'
                  }
                ]}
              >
                <DatePicker className='w-full' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label='Status' name='status' initialValue='pending'>
                <Select
                  options={[
                    {
                      label: 'Pending',
                      value: 'pending'
                    },
                    {
                      label: 'Approved',
                      value: 'approved'
                    },
                    {
                      label: 'Paid',
                      value: 'paid'
                    }
                  ]}
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
      {isPermissionAction('payroll.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            {
              title: 'Title',
              dataIndex: 'title'
            },
            {
              title: 'Payment Date',
              dataIndex: 'payment_date',
              render: value => dateClient(value)
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: status => {
                const key = String(status || '')
                  .toLowerCase()
                  .trim()

                const statusMap = {
                  approved: { color: 'blue', text: 'Approved' },
                  paid: { color: 'green', text: 'Paid' },
                  pending: { color: 'orange', text: 'Pending' },
                  rejected: { color: 'red', text: 'Rejected' }
                }

                const item = statusMap[key]

                return (
                  <Tag color={item?.color ?? 'default'}>
                    {item?.text ?? status}
                  </Tag>
                )
              }
            },
            {
              title: 'Actions',
              align: 'center',
              fixed: 'right',
              width: 120,
              hidden: !(
                isPermissionAction('payroll.update') ||
                isPermissionAction('payroll.delete')
              ),
              render: (_, data) => (
                <Space size='small'>
                  {isPermissionAction('payroll.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit
                          style={{
                            fontSize: 18,
                            color: '#004EBC'
                          }}
                        />
                      }
                    />
                  )}

                  {isPermissionAction('payroll.delete') && (
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

export default PayrollPage
