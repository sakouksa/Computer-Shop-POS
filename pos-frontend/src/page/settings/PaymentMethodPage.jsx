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
  Row,
  Typography,
  Upload
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

// Utils
import { request } from '../../utils/request'
import config from '../../utils/config'
import { usePreviewStore } from '../../store/previewStore'
import { isPermissionAction } from '../../utils/helper'

// Components
import MainPage from '../../component/common/PageLoader'
import UploadButton from '../../component/ui/UploadButton'
import PageLoader from '../../component/common/PageLoader'

const { Text, Title } = Typography

function PaymentMethodPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: null,
    status: null
  })

  const [validate, setValidate] = useState({})
  const [fileList, setFileList] = useState([])

  // Zustand Store for Preview Image
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

  // Get List logic
  const getList = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))

    let query_param = '?page=1'
    if (currentFilter.txt_search)
      query_param += '&txt_search=' + currentFilter.txt_search
    if (currentFilter.status !== null && currentFilter.status !== '') {
      query_param +=
        '&status=' + (currentFilter.status === 1 ? 'active' : 'inactive')
    }

    const res = await request('payment_methods' + query_param, 'get', {})
    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        loading: false
      }))
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res.errors?.message) message.error(res.errors?.message)
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
    formData.append('name', item.name)
    formData.append('code', item.code || '')
    formData.append('is_active', item.is_active ?? 1)

    // Logo Image logic
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('logo', fileList[0].originFileObj)
    } else if (fileList.length === 0 && formRef.getFieldValue('id')) {
      formData.append('image_remove', 'true')
    }

    let url = 'payment_methods'
    let method = 'post'
    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      formData.append('_method', 'PUT')
    }

    setState(p => ({ ...p, loading: true }))
    const res = await request(url, method, formData)
    if (res && !res.errors) {
      message.success(res.message || 'Success!')
      handleCloseModal()
      getList()
    } else {
      setValidate(res.errors || {})
      message.error(res?.message || 'Operation failed!')
      setState(p => ({ ...p, loading: false }))
    }
  }

  const handleEdit = data => {
    if (data.logo) {
      setFileList([
        {
          uid: data.id,
          name: data.logo,
          status: 'done',
          url: config.image_path + data.logo
        }
      ])
    }
    formRef.setFieldsValue({
      ...data,
      is_active: data.is_active ? 1 : 0
    })
    setState(p => ({ ...p, open: true }))
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete "${data.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        const res = await request(`payment_methods/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success(res.message || 'Deleted successfully!')
          getList()
        } else {
          message.error(res?.message || 'Delete failed!')
        }
      }
    })
  }

  const handleReset = () => {
    const resetFilter = { txt_search: null, status: null }
    setFilter(resetFilter)
    getList(resetFilter)
  }

  return (
    <div className=' p-4'>
      {state.loading && <PageLoader/>}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex flex-col md:flex-row md:items-center gap-2'>
              Payment Methods
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit'>
                Total: {state.total || 0}
              </span>
            </h2>
            <Text type='secondary' className='text-sm'>
              Manage your payment gateways and methods.
            </Text>
          </div>

          {isPermissionAction('paymentmethod.create') && (
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

        {/* Filter Section */}
        <div className='border-t border-gray-100 pt-6'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <Input
              allowClear
              value={filter.txt_search}
              placeholder='Search by name or code...'
              onChange={e =>
                setFilter(p => ({ ...p, txt_search: e.target.value }))
              }
              onPressEnter={() => getList()}
              prefix={<SearchOutlined className='text-gray-400 mr-2' />}
              style={{ width: 250 }}
            />
            <div className='flex items-center gap-3'>
              <Select
                allowClear
                placeholder='Status'
                style={{ width: 150 }}
                value={filter.status}
                onChange={value => setFilter(p => ({ ...p, status: value }))}
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

      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Payment Method'
            : 'Create Payment Method'
        }
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        maskClosable={false}
        centered
        width={600}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label='Method Name'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder='e.g. ABA Bank, ACLEDA, Cash' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Code' name='code' {...validate.code}>
                <Input placeholder='e.g. ABA, WING' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Status' name='is_active' initialValue={1}>
                <Select
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Logo Image'>
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
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: open,
                    onVisibleChange: visible =>
                      !visible && handleClosePreview(),
                    src: imgUrl
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className='text-right mt-4'>
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

      {isPermissionAction('paymentmethod.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          pagination={{ defaultPageSize: 10, showSizeChanger: true }}
          columns={[
            {
              title: 'Logo',
              dataIndex: 'logo',
              align: 'center',
              render: img =>
                img ? (
                  <Image
                    src={config.image_path + img}
                    width={40}
                    height={40}
                    className='rounded border object-cover'
                  />
                ) : (
                  <div className='w-10 h-10 bg-gray-100 rounded flex items-center justify-center mx-auto'>
                    <Text type='secondary' style={{ fontSize: 10 }}>
                      No Logo
                    </Text>
                  </div>
                )
            },
            { title: 'Method Name', dataIndex: 'name', key: 'name' },
            { title: 'Code', dataIndex: 'code', key: 'code' },
            {
              title: 'Status',
              dataIndex: 'is_active',
              align: 'center',
              render: v => (
                <Tag color={v ? 'green' : 'red'}>
                  {v ? 'Active' : 'Inactive'}
                </Tag>
              )
            },
            {
              title: 'Action',
              align: 'center',
              key: 'action',
              hidden: !(
                isPermissionAction('paymentmethod.update') ||
                isPermissionAction('paymentmethod.delete')
              ),
              render: (_, data) => (
                <Space size='middle'>
                  {isPermissionAction('paymentmethod.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('paymentmethod.delete') && (
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
    </div>
  )
}

export default PaymentMethodPage
