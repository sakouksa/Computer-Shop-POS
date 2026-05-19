import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Upload,
  Row,
  Typography,
  DatePicker
} from 'antd'
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
  SearchOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { FiDownload } from 'react-icons/fi'
import dayjs from 'dayjs'

// Utils
import { request } from '../../utils/request'
import config from '../../utils/config'
import { usePreviewStore } from '../../store/previewStore'
import { isPermissionAction } from '../../utils/helper'
import { exportFile } from '../../utils/exportFile'
import ServerErrorPage from '../error-page/500'
// Components
import UploadButton from '../../component/ui/UploadButton'
import PageLoader from '../../component/common/PageLoader'

const { Text, Title } = Typography

function EmployeePage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    positions: [],
    paymentMethods: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: null,
    employment_status: null,
    position_id: null
  })
  const [isServerError, setIsServerError] = useState(false)
  const [validate, setValidate] = useState({})
  const [fileList, setFileList] = useState([])

  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore()

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    handleOpenPreview(file.url || file.preview)
  }

  const getList = async (param_filter = {}) => {
    // Merge filters
    const finalFilter = {
      ...filter,
      ...param_filter
    }

    // Set initial loading and error state
    setState(pre => ({
      ...pre,
      loading: true
    }))
    setIsServerError(false)

    // Build query parameters
    let query_param = '?page=1'
    if (finalFilter.txt_search)
      query_param += `&txt_search=${finalFilter.txt_search}`
    if (finalFilter.employment_status)
      query_param += `&employment_status=${finalFilter.employment_status}`
    if (finalFilter.position_id)
      query_param += `&position_id=${finalFilter.position_id}`

    try {
      // Fetch data from API
      const res = await request('employees' + query_param, 'get', {})

      if (res && !res.error) {
        // Success: Update employee list and metadata
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || [],
          positions: res.positions || [],
          paymentMethods: res.payment_methods || []
        }))
      } else {
        // API Error: Handle 500, 403, and others
        const status = res?.status
        if (status === 500) {
          setIsServerError(true)
        } else if (status === 403) {
          message.error(
            "You don't have permission to access this employee list."
          )
        } else {
          message.error(res?.errors?.message || 'Something went wrong!')
        }
      }
    } catch (error) {
      // Network or unexpected crash
      setIsServerError(true)
    } finally {
      // Always stop loading
      setState(pre => ({
        ...pre,
        loading: false
      }))
    }
  }
  useEffect(() => {
    getList()
  }, [])

  const handleOpenModal = () => setState(pre => ({ ...pre, open: true }))

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setFileList([])
    setValidate({})
  }
  const onFinish = async item => {
    const formData = new FormData()

    // Basic Fields
    formData.append('card_id', item.card_id)
    formData.append('first_name', item.first_name)
    formData.append('last_name', item.last_name)
    formData.append('gender', item.gender)

    // Date Format
    if (item.dob) {
      formData.append('dob', item.dob.format('YYYY-MM-DD'))
    }

    formData.append('email', item.email)
    formData.append('tel', item.tel || '')
    formData.append('position_id', item.position_id)
    formData.append('salary', item.salary)
    formData.append('employment_status', item.employment_status || 'Full-time')

    // Optional Fields
    if (item.payment_method_id) {
      formData.append('payment_method_id', item.payment_method_id)
    }

    formData.append('bank_account_name', item.bank_account_name || '')
    formData.append('bank_account_number', item.bank_account_number || '')

    // Image Upload
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj)
    } else if (fileList.length === 0 && formRef.getFieldValue('id')) {
      let image_remove = formRef.getFieldValue('image')
      if (image_remove) {
        formData.append('image_remove', 'true')
      }
    }

    let url = 'employees'
    let method = 'post'

    // Update Mode
    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      formData.append('_method', 'PUT')
    }

    setState(p => ({
      ...p,
      loading: true
    }))

    const res = await request(url, method, formData)

    if (res && !res.errors) {
      message.success(res.message || 'Success!')
      handleCloseModal()
      getList()
    } else {
      setValidate(res.errors || {})
      if (res?.errors?.image) {
        message.error(
          res.errors.image[0] ||
            'The profile image must be an image file (jpg, jpeg, png) and not exceed 2MB.'
        )
      } else if (res?.message) {
        message.error(res.message)
      } else {
        message.error('Failed to perform action!')
      }
      setState(p => ({
        ...p,
        loading: false
      }))
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete employee "${data.first_name} ${data.last_name}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        const res = await request(`employees/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success('Employee deleted successfully!')
          getList()
        }
      }
    })
  }

  const handleEdit = data => {
    if (data.image) {
      setFileList([
        {
          uid: data.id,
          name: data.image,
          status: 'done',
          url: config.image_path + data.image
        }
      ])
    }
    formRef.setFieldsValue({
      ...data,
      dob: data.dob ? dayjs(data.dob) : null
    })
    setState(p => ({ ...p, open: true }))
  }

  // function Export
  const handleExport = () => {
    exportFile({
      url: 'employees-export',
      filename: 'Employee_List'
    })
  }
  const initialFilter = {
    txt_search: null,
    employment_status: null,
    position_id: null
  }
  if (isServerError) return <ServerErrorPage onRetry={() => getList()} />

  return (
    <div>
      {state.loading && <PageLoader />}

      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex gap-2 items-center'>
              Employee Management
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total}
              </span>
            </h2>
            <Text type='secondary'>
              Manage employee profiles, payroll, and employment status.
            </Text>
          </div>

          <div className='flex gap-3'>
            {isPermissionAction('employee.export') && (
              <Button icon={<FiDownload />} onClick={handleExport}>
                Export Excel
              </Button>
            )}
            {isPermissionAction('position.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className='bg-indigo-600'
              >
                Add Employee
              </Button>
            )}
          </div>
        </div>

        <div className='border-t border-gray-100 pt-6'>
          <div
            div
            className='flex flex-wrap justify-between items-center gap-4'
          >
            <Input
              placeholder='Search name, email, or ID...'
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={filter.txt_search}
              onChange={e =>
                setFilter(p => ({ ...p, txt_search: e.target.value }))
              }
              onPressEnter={() => getList()}
              allowClear
            />
            <div className='flex gap-2'>
              <Select
                placeholder='Position'
                style={{ width: 150 }}
                allowClear
                value={filter.position_id}
                options={state.positions.map(i => ({
                  label: i.name,
                  value: i.id
                }))}
                onChange={v => setFilter(p => ({ ...p, position_id: v }))}
                onClear={() => setFilter(p => ({ ...p, position_id: null }))}
              />
              <Select
                placeholder='Status'
                style={{ width: 150 }}
                allowClear
                value={filter.employment_status}
                options={[
                  { label: 'Full Time', value: 'Full-time' },
                  { label: 'Part Time', value: 'Part-time' },
                  { label: 'Probation', value: 'Probation' },
                  { label: 'Resigned', value: 'Resigned' }
                ]}
                onChange={v => setFilter(p => ({ ...p, employment_status: v }))}
                onClear={() =>
                  setFilter(p => ({ ...p, employment_status: null }))
                }
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilter(initialFilter)
                  getList(initialFilter)
                }}
              >
                Reset
              </Button>
              <Button
                type='primary'
                icon={<FilterOutlined />}
                onClick={() => getList()}
                className='bg-indigo-600'
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={state.currentId ? 'Update Employee' : 'Create Employee'}
        open={state.open}
        onCancel={handleCloseModal}
        width={800}
        footer={null}
      >
        <Form layout='vertical' form={formRef} onFinish={onFinish}>
          <Row gutter={16}>
            {/* Card ID */}
            <Col span={8}>
              <Form.Item
                label='Card ID'
                name='card_id'
                {...validate.card_id}
                rules={[{ required: true, message: 'Please input Card ID!' }]}
              >
                <Input placeholder='E.g. EMP001' />
              </Form.Item>
            </Col>

            {/* First Name */}
            <Col span={8}>
              <Form.Item
                label='First Name'
                name='first_name'
                {...validate.first_name}
                rules={[
                  { required: true, message: 'Please input First Name!' }
                ]}
              >
                <Input placeholder='First Name' />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col span={8}>
              <Form.Item
                label='Last Name'
                name='last_name'
                {...validate.last_name}
                rules={[{ required: true, message: 'Please input Last Name!' }]}
              >
                <Input placeholder='Last Name' />
              </Form.Item>
            </Col>

            {/* Gender */}
            <Col span={8}>
              <Form.Item
                label='Gender'
                name='gender'
                {...validate.gender}
                rules={[{ required: true, message: 'Please select gender!' }]}
              >
                <Select
                  placeholder='Select Gender'
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Date of Birth */}
            <Col span={8}>
              <Form.Item
                label='Date of Birth'
                name='dob'
                {...validate.dob}
                rules={[
                  { required: true, message: 'Please select date of birth!' }
                ]}
              >
                <DatePicker className='w-full' format='YYYY-MM-DD' />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={8}>
              <Form.Item
                label='Email'
                name='email'
                {...validate.email}
                rules={[
                  {
                    required: true,
                    type: 'email',
                    message: 'Please input a valid email!'
                  }
                ]}
              >
                <Input placeholder='example@mail.com' />
              </Form.Item>
            </Col>

            {/* Telephone */}
            <Col span={8}>
              <Form.Item label='Telephone' name='tel' {...validate.tel}>
                <Input placeholder='012 345 678' />
              </Form.Item>
            </Col>

            {/* Position */}
            <Col span={8}>
              <Form.Item
                label='Position'
                name='position_id'
                {...validate.position_id}
                rules={[{ required: true, message: 'Please select position!' }]}
              >
                <Select
                  placeholder='Select Position'
                  options={state.positions.map(i => ({
                    label: i.name,
                    value: i.id
                  }))}
                />
              </Form.Item>
            </Col>

            {/* Salary */}
            <Col span={8}>
              <Form.Item
                label='Salary'
                name='salary'
                {...validate.salary}
                rules={[{ required: true, message: 'Please input salary!' }]}
              >
                <Input type='number' prefix='$' placeholder='0.00' />
              </Form.Item>
            </Col>

            {/* Employment Status */}
            <Col span={8}>
              <Form.Item
                label='Employment Status'
                name='employment_status'
                {...validate.employment_status}
                initialValue='Full-time'
              >
                <Select
                  options={[
                    { label: 'Full Time', value: 'Full-time' },
                    { label: 'Part Time', value: 'Part-time' },
                    { label: 'Probation', value: 'Probation' },
                    { label: 'Resigned', value: 'Resigned' }
                  ]}
                />
              </Form.Item>
            </Col>

            {/* Payment Method */}
            <Col span={8}>
              <Form.Item
                label='Payment Method'
                name='payment_method_id'
                {...validate.payment_method_id}
              >
                <Select
                  placeholder='Select Payment'
                  allowClear
                  options={state.paymentMethods.map(i => ({
                    label: i.name,
                    value: i.id
                  }))}
                />
              </Form.Item>
            </Col>

            {/* Bank Account Name */}
            <Col span={8}>
              <Form.Item
                label='Bank Account Name'
                name='bank_account_name'
                {...validate.bank_account_name}
              >
                <Input placeholder='E.g. JOHN DOE' />
              </Form.Item>
            </Col>

            {/* Bank Account Number */}
            <Col span={24}>
              <Form.Item
                label='Bank Account Number'
                name='bank_account_number'
                {...validate.bank_account_number}
              >
                <Input placeholder='Enter account number' />
              </Form.Item>
            </Col>

            {/* Profile Image */}
            <Col span={24}>
              <Form.Item label='Profile Image'>
                <Upload
                  customRequest={e => e.onSuccess('ok')}
                  listType='picture-card'
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={({ fileList }) => setFileList(fileList)}
                  maxCount={1}
                >
                  {fileList.length < 1 && <UploadButton />}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Form Buttons */}
          <div className='text-right mt-4'>
            <Space>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type='primary'
                htmlType='submit'
                className='bg-indigo-600'
                icon={
                  formRef.getFieldValue('id') ? (
                    <BiSolidEditAlt />
                  ) : (
                    <RiSave3Fill />
                  )
                }
              >
                {formRef.getFieldValue('id')
                  ? 'Update Employee'
                  : 'Save Employee'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {isPermissionAction('employee.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          scroll={{ x: 1300 }}
          columns={[
            {
              title: 'Employee',
              fixed: 'left',
              width: 220,
              render: (_, record) => (
                <Space>
                  <Image
                    src={
                      record.image
                        ? config.image_path + record.image
                        : '/default-avatar.png'
                    }
                    width={40}
                    className='rounded-full'
                  />
                  <div>
                    <div className='font-bold'>
                      {record.first_name} {record.last_name}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {record.card_id}
                    </div>
                  </div>
                </Space>
              )
            },
            { title: 'Position', dataIndex: ['position', 'name'] },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Tel', dataIndex: 'tel' },
            {
              title: 'Salary',
              dataIndex: 'salary',
              hidden: !isPermissionAction('employee.view_salary'),
              render: v => (
                <span className='text-green-600 font-medium'>
                  ${Number(v).toLocaleString()}
                </span>
              )
            },
            {
              title: 'Status',
              dataIndex: 'employment_status',
              render: v => {
                let color = 'default'
                let text = v?.toUpperCase()
                switch (v) {
                  case 'Full-time':
                    color = 'green'
                    break
                  case 'Part-time':
                    color = 'cyan'
                    break
                  case 'Probation':
                    color = 'blue'
                    break
                  case 'Resigned':
                    color = 'red'
                    break
                  default:
                    color = 'default'
                }
                return (
                  <Tag
                    color={color}
                    key={v}
                    style={{ borderRadius: '4px', fontWeight: '500' }}
                  >
                    {text}
                  </Tag>
                )
              }
            },
            {
              title: 'Actions',
              fixed: 'right',
              width: 100,
              render: data => (
                <Space>
                  <Button
                    type='text'
                    icon={<CiEdit className='text-blue-600' />}
                    onClick={() => handleEdit(data)}
                  />
                  <Button
                    type='text'
                    danger
                    icon={<MdDelete />}
                    onClick={() => handleDelete(data)}
                  />
                </Space>
              )
            }
          ].filter(c => !c.hidden)}
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
    </div>
  )
}

export default EmployeePage
