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
  InputNumber
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

import { isPermissionAction } from '../../utils/helper'
import { EmployeePayrollService } from '../../services/employeePayrollService'

import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'
import { FiDownload } from 'react-icons/fi'
import { exportFile } from '../../utils/exportFile'
const { Title, Text } = Typography

function EmployeePayrollPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false,
    payroll: [],
    employee: []
  })
  const [validate, setValidate] = useState({})
  const [isServerError, setIsServerError] = useState(false)
  const [filter, setFilter] = useState({
    txt_search: '',
    payroll_id: null,
    employee_id: null
  })

  useEffect(() => {
    getList()
  }, [])

  const getList = async (param_filter = {}) => {
    const currentFilter = {
      ...filter,
      ...param_filter
    }
    setState(pre => ({ ...pre, loading: true }))
    setIsServerError(false)

    try {
      const res = await EmployeePayrollService.getList(currentFilter)
      if (res && !res.errors) {
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || [],
          payroll: res.payroll || [],
          employee: res.employee || []
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
      let res = values.id
        ? await EmployeePayrollService.update(values.id, values)
        : await EmployeePayrollService.create(values)

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
    formRef.setFieldsValue({ ...data })
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
          const res = await EmployeePayrollService.delete(data.id)
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
  const handleOpenModal = () => {
    setState(pre => ({
      ...pre,
      open: true
    }))
  }
  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
  }
  // function Export
  const handleExport = () => {
    exportFile({
      url: 'employee-payroll-export',
      filename: 'employee-payroll_List'
    })
  }
  const handleReset = () => {
    const data = {
      txt_search: '',
      payroll_id: null,
      employee_id: null
    }
    setFilter(data)
    getList(data)
  }
  const handleFilter = () => {
    getList(filter)
  }
  if (isServerError) return <ServerErrorPage onRetry={() => getList()} />

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}

      {/* Header */}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0'>
              Employee Payroll Details
              <span className='ml-2 text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total}
              </span>
            </h2>
            <Text type='secondary'>
              Manage individual employee salaries and deductions.
            </Text>
          </div>
          <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
            {isPermissionAction('employee-payroll.export') && (
              <Button
                onClick={handleExport}
                className='border-gray-200 hover:text-indigo-600 hover:border-indigo-600 flex items-center'
                icon={<FiDownload />}
              >
                Export Excel
              </Button>
            )}

            {isPermissionAction('employee-payroll.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className='bg-indigo-600 border-0 hover:bg-indigo-700 flex items-center'
              >
                Add New
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div
          div
          className='border-t border-gray-100 pt-6 flex flex-wrap justify-between items-center gap-4'
        >
          <Input
            placeholder='Search employee name...'
            value={filter.txt_search}
            onChange={e =>
              setFilter(p => ({ ...p, txt_search: e.target.value }))
            }
            onPressEnter={() => getList()}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <div className='flex flex-wrap items-center gap-3'>
            <Select
              allowClear
              placeholder='payroll'
              style={{ width: 150 }}
              value={filter.payroll_id}
              onChange={value => setFilter(p => ({ ...p, payroll_id: value }))}
              options={state.payroll?.map(item => ({
                label: item.title,
                value: item.id
              }))}
            />

            <Select
              allowClear
              placeholder='Employee ID'
              style={{
                width: 180
              }}
              value={filter.employee_id}
              onChange={value =>
                setFilter(p => ({
                  ...p,
                  employee_id: value
                }))
              }
              options={state.employee?.map(item => ({
                label: `${item.id} - ${item.first_name} ${item.last_name}`,
                value: item.id
              }))}
            />
            <div className='flex gap-2'>
              <Button
                type='default'
                onClick={handleReset}
                icon={<ReloadOutlined />}
                className='px-3 flex items-center'
              >
                Reset
              </Button>
              <Button
                type='primary'
                onClick={handleFilter}
                icon={<FilterOutlined />}
                className='px-3 flex items-center bg-indigo-600 border-0 hover:bg-indigo-700'
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Create/Update */}
      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Employee Salary'
            : 'Add Employee Salary'
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
                label='Payroll'
                name='payroll_id'
                {...validate.payroll_id}
                rules={[
                  {
                    required: true,
                    message: 'Please select a payroll!'
                  }
                ]}
              >
                <Select
                  placeholder='Select payroll'
                  options={(state.payroll || []).map(item => ({
                    label: item.title,
                    value: item.id
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Employee'
                name='employee_id'
                {...validate.employee_id}
                rules={[
                  {
                    required: true,
                    message: 'Please select a employee!'
                  }
                ]}
              >
                <Select
                  placeholder='Select employee'
                  options={(state.employee || []).map(item => ({
                    label: `${item.card_id} - ${item.first_name} ${item.last_name}`,
                    value: item.id
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='base_salary'
                label='Base Salary'
                rules={[{ required: true }]}
              >
                <InputNumber className='w-full' prefix='$' min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='ot_amount' label='OT Amount'>
                <InputNumber className='w-full' prefix='$' min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name='allowance' label='Allowance'>
                <InputNumber className='w-full' prefix='$' min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='deduction_amount' label='Deduction'>
                <InputNumber className='w-full' prefix='$' min={0} />
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
      {/* Table Section */}
      {isPermissionAction('employee-payroll.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            {
              title: 'Employee',
              render: (_, row) =>
                `${row.employee?.first_name} ${row.employee?.last_name}`
            },
            {
              title: 'Base Salary',
              dataIndex: 'base_salary',
              render: v => `$${v}`
            },
            { title: 'OT', dataIndex: 'ot_amount', render: v => `$${v}` },
            {
              title: 'Allowance',
              dataIndex: 'allowance',
              render: v => `$${v}`
            },
            {
              title: 'Deduction',
              dataIndex: 'deduction_amount',
              render: v => <Text type='danger'>${v}</Text>
            },
            {
              title: 'Net Salary',
              dataIndex: 'net_salary',
              render: v => (
                <Text strong className='text-green-600'>
                  ${v}
                </Text>
              )
            },
            {
              title: 'Actions',
              align: 'center',
              hidden: !(
                isPermissionAction('employee-payroll.update') ||
                isPermissionAction('employee-payroll.delete')
              ),
              render: (_, data) => (
                <Space>
                  {isPermissionAction('employee-payroll.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('employee-payroll.delete') && (
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

export default EmployeePayrollPage
