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
  Typography
} from 'antd'
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
  FileSearchOutlined,
  SearchOutlined,
  ImportOutlined,
  ExportOutlined,
  FileExcelOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { FiDownload } from 'react-icons/fi'
// Utils
import { request } from '../../utils/request'
import config from '../../utils/config'
import { usePreviewStore } from '../../store/previewStore'
import { isPermissionAction } from '../../utils/helper'
import { exportFile } from '../../utils/exportFile'

// Components
import MainPage from '../../component/common/PageLoader'
import UploadButton from '../../component/ui/UploadButton'
import PageLoader from '../../component/common/PageLoader'

const { Title, Text } = Typography

function ProductPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    category: [],
    brand: [],
    total: [],
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: null,
    status: null,
    category_id: null,
    brand_id: null
  })

  const [validate, setValidate] = useState({})
  const [fileList, setFileList] = useState([])

  // Zustand Store
  const { open, imgUrl, handleOpenPreview, handleClosePreview } =
    usePreviewStore()

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    handleOpenPreview(file.url || file.preview)
  }

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })

  const getList = async param_filter => {
    param_filter = {
      ...filter,
      ...param_filter
    }
    setState(pre => ({ ...pre, loading: true }))
    let query_param = '?page=1'
    if (param_filter.txt_search !== null && param_filter.txt_search !== '') {
      query_param += '&txt_search=' + param_filter.txt_search
    }
    if (param_filter.status !== null && param_filter.status !== '') {
      query_param += '&status=' + param_filter.status
    }
    if (param_filter.category_id) {
      query_param += '&category_id=' + param_filter.category_id
    }
    if (param_filter.brand_id) {
      query_param += '&brand_id=' + param_filter.brand_id
    }

    const res = await request('products' + query_param, 'get', {})
    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        total: res.total,
        list: res.list || [],
        category: res.category || [],
        brand: res.brand || [],
        loading: false
      }))
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res.errors?.message) {
        message.error(res.errors?.message)
      }
    }
  }

  useEffect(() => {
    getList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpenModal = () => {
    setState(pre => ({ ...pre, open: true }))
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setFileList([])
    setValidate({})
  }

  const onFinish = async item => {
    const formData = new FormData()
    formData.append('product_name', item.product_name)
    formData.append('category_id', item.category_id)
    formData.append('brand_id', item.brand_id)
    formData.append('price', item.price)
    formData.append('quantity', item.quantity)
    formData.append('description', item.description || '')
    formData.append('status', item.status || 0)

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj)
    } else if (fileList.length === 0 && formRef.getFieldValue('id')) {
      let image_remove = formRef.getFieldValue('image')
      if (image_remove) {
        formData.append('image_remove', image_remove)
      }
    }

    let url = 'products'
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
      message.error(res?.message || 'Failed to perform action!')
      setState(p => ({ ...p, loading: false }))
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          Are you sure you want to delete the product{' '}
          <b>"{data.product_name || data.title}"</b>?
          <p style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '8px' }}>
            * This action cannot be undone.
          </p>
        </div>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        const res = await request(`products/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success(res.message || 'Delete Success!')
          getList()
        } else {
          message.error(res?.message || 'Failed to delete!')
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
    formRef.setFieldsValue({ ...data })
    setState(p => ({ ...p, open: true }))
  }

  const handleFilter = () => {
    getList()
  }

  const handleReset = () => {
    const data = {
      txt_search: null,
      status: null,
      category_id: null,
      brand_id: null
    }
    setFilter(data)
    getList(data)
  }
  // function Export
  const handleExport = () => {
    exportFile({
      url: 'product-export',
      filename: 'product_List'
    })
  }
  return (
    <div>
      {state.loading && <PageLoader />}
      <div>
        <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2'>
                Product Management
                <span className='text-sm font-normal text-indigo-600 dark:text-indigo-400 dark:bg-indigo-900/30 px-3 py-1 rounded-full w-fit'>
                  In Stock: {state.total || 0}
                </span>
              </h2>
              <Text type='secondary' className='text-sm dark:text-gray-400'>
                Manage your products, categories, and inventory stock here.
              </Text>
            </div>

            <div className='flex flex-wrap items-center gap-3 w-full md:w-auto justify-end'>
              {isPermissionAction('product.export') && (
              <Button
                onClick={handleExport}
                className='border-gray-200 hover:text-indigo-600 hover:border-indigo-600 flex items-center'
                icon={<FiDownload />}
              >
                Export Excel
              </Button>
              )}
              {isPermissionAction('product.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className='bg-indigo-600 border-0 hover:bg-indigo-700 flex items-center'
              >
                Add Products
              </Button>
              )}
            </div>
          </div>

          {/* Filter Section */}
          <div className='border-t border-gray-100 pt-6'>
            <div className='flex flex-wrap justify-between items-center gap-4'>
              <Input
                allowClear
                value={filter.txt_search}
                onChange={e =>
                  setFilter(p => ({ ...p, txt_search: e.target.value }))
                }
                placeholder='Search products...'
                onPressEnter={handleFilter}
                prefix={<SearchOutlined className='text-gray-400 mr-2' />}
                style={{ width: 250 }}
              />
              <div className='flex flex-wrap items-center gap-3'>
                <Select
                  allowClear
                  placeholder='Status'
                  style={{ width: 120 }}
                  value={filter.status}
                  onChange={value => setFilter(p => ({ ...p, status: value }))}
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />

                <Select
                  allowClear
                  placeholder='Category'
                  style={{ width: 150 }}
                  value={filter.category_id}
                  onChange={value =>
                    setFilter(p => ({ ...p, category_id: value }))
                  }
                  options={state.category?.map(item => ({
                    label: item.name,
                    value: item.id
                  }))}
                />

                <Select
                  allowClear
                  placeholder='Brand'
                  style={{ width: 150 }}
                  value={filter.brand_id}
                  onChange={value =>
                    setFilter(p => ({ ...p, brand_id: value }))
                  }
                  options={state.brand?.map(item => ({
                    label: item.name,
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
        </div>

        <Modal
          title={
            formRef.getFieldValue('id')
              ? 'Update Product'
              : 'Create New Product'
          }
          open={state.open}
          onCancel={handleCloseModal}
          centered
          width={650}
          footer={null}
          maskClosable={false}
        >
          <Form layout='vertical' onFinish={onFinish} form={formRef}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Product Name'
                  name='product_name'
                  {...validate.product_name}
                  rules={[
                    { required: true, message: 'Please enter product name!' }
                  ]}
                >
                  <Input placeholder='Enter product name' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label='Category'
                  name='category_id'
                  {...validate.category_id}
                  rules={[
                    { required: true, message: 'Please select a category!' }
                  ]}
                >
                  <Select
                    placeholder='Select Category'
                    options={state.category?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label='Brand'
                  name='brand_id'
                  {...validate.brand_id}
                  rules={[
                    { required: true, message: 'Please select a brand!' }
                  ]}
                >
                  <Select
                    placeholder='Select Brand'
                    options={state.brand?.map(item => ({
                      label: item.name,
                      value: item.id
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label='Price'
                  name='price'
                  {...validate.price}
                  rules={[{ required: true, message: 'Please enter price!' }]}
                >
                  <Input placeholder='0.00' type='number' step='0.01' />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label='Quantity'
                  name='quantity'
                  {...validate.quantity}
                  rules={[
                    { required: true, message: 'Please enter quantity!' }
                  ]}
                >
                  <Input placeholder='0' type='number' />
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
                <Form.Item label='Description' name='description'>
                  <Input.TextArea
                    placeholder='Enter details...'
                    autoSize={{ minRows: 2, maxRows: 4 }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label='Image' {...validate.image}>
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

            <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
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
                >
                  {formRef.getFieldValue('id') ? 'Update' : 'Save'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {isPermissionAction('product.view') ? (
          <Table
            dataSource={state.list}
            rowKey='id'
            scroll={{ x: 1200 }}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50']
            }}
            columns={[
              {
                title: 'Product Name',
                dataIndex: 'product_name',
                key: 'product_name',
                fixed: 'left',
                width: 200
              },
              {
                title: 'Image',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
                render: image =>
                  image ? (
                    <Image
                      src={config.image_path + image}
                      width={60}
                      height={40}
                      className='rounded border object-cover'
                    />
                  ) : (
                    <Text type='secondary' style={{ fontSize: '12px' }}>
                      No Image
                    </Text>
                  )
              },
              {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
                render: cat => cat?.name
              },
              {
                title: 'Brand',
                dataIndex: 'brand',
                key: 'brand',
                render: b => b?.name
              },
              {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                align: 'right',
                // Only show if user has product.view_price permission
                hidden: !isPermissionAction('product.view_price'),
                render: price => (
                  <span className='font-medium text-blue-600'>
                    $
                    {Number(price).toLocaleString(undefined, {
                      minimumFractionDigits: 2
                    })}
                  </span>
                )
              },
              {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                align: 'center',
                render: qty => (
                  <span
                    style={{
                      color: qty <= 5 ? '#f5222d' : 'inherit',
                      fontWeight: qty <= 5 ? 'bold' : 'normal'
                    }}
                  >
                    {qty}
                  </span>
                )
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: value => {
                  const isActive = value === 'active' || value === 1
                  return (
                    <Tag
                      color={isActive ? 'green' : 'red'}
                      className='rounded-full px-3'
                    >
                      {isActive ? 'Active' : 'Inactive'}
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
                  isPermissionAction('product.update') ||
                  isPermissionAction('product.delete')
                ),
                render: (id, data) => (
                  <Space size='small'>
                    {isPermissionAction('product.update') && (
                      <Button
                        type='text'
                        onClick={() => handleEdit(data)}
                        icon={
                          <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                        }
                      />
                    )}
                    {isPermissionAction('product.delete') && (
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
            ].filter(col => !col.hidden)}
          />
        ) : (
          <div className='text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
            <Title level={4} type='danger'>
              Access Denied
            </Title>
            <Text type='secondary'>
              You do not have permission to view the product data!.
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductPage
