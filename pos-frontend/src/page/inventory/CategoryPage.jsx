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

// Utils
import { request } from '../../utils/request'
import { dateClient, isPermissionAction } from '../../utils/helper'

// Components
import MainPage from '../../component/common/PageLoader'
import PageLoader from '../../component/common/PageLoader'

const { Title, Text } = Typography

function CategoryPage () {
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

  const [validate, setValidate] = useState({})

  useEffect(() => {
    getlist()
  }, [])

  const getlist = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))

    let query_param = '?page=1'
    if (currentFilter.txt_search) {
      query_param += '&txt_search=' + currentFilter.txt_search
    }
    if (currentFilter.status !== null && currentFilter.status !== '') {
      query_param += '&status=' + currentFilter.status
    }

    const res = await request('categories' + query_param, 'get', {})
    if (res && !res.errors) {
      setState(pre => ({
        ...pre,
        total: res.total || res.list?.length || 0,
        list: res.list || [],
        loading: false
      }))
    } else {
      setState(pre => ({ ...pre, loading: false }))
      if (res.errors?.message) message.error(res.errors?.message)
    }
  }

  const handleOpenModal = () => setState(pre => ({ ...pre, open: true }))

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setValidate({})
  }

  const handleReset = () => {
    const resetFilter = { txt_search: '', status: null }
    setFilter(resetFilter)
    getlist(resetFilter)
  }

  const onFinish = async item => {
    let data = { ...item }
    let url = 'categories'
    let method = 'post'

    if (formRef.getFieldValue('id')) {
      url += '/' + formRef.getFieldValue('id')
      method = 'put'
    }

    setState(p => ({ ...p, loading: true }))
    const res = await request(url, method, data)
    if (res && !res.errors) {
      message.success(res.message || 'Success!')
      handleCloseModal()
      getlist()
    } else {
      setValidate(res.errors || {})
      message.error(res?.message || 'Failed to perform action!')
      setState(p => ({ ...p, loading: false }))
    }
  }

  const handleEdit = data => {
    formRef.setFieldsValue({ ...data })
    setState(p => ({ ...p, open: true }))
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete category "${data.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        const res = await request(`categories/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success(res.message || 'Deleted successfully!')
          getlist()
        } else {
          message.error(res?.message || 'Delete failed!')
        }
      }
    })
  }

  return (
    <div className=' p-4'>
      {state.loading && <PageLoader/>}
      {/* Header & Filter Card */}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex flex-col md:flex-row md:items-center gap-2'>
              Category Management
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit'>
                Total: {state.total || 0}
              </span>
            </h2>
            <Text type='secondary' className='text-sm'>
              Organize and manage your product categories.
            </Text>
          </div>
          {isPermissionAction('category.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className='bg-indigo-600 border-0 hover:bg-indigo-700 flex items-center'
              >
                Add Category
              </Button>
          )}
        </div>

        {/* Filter Section */}
        <div className='border-t border-gray-100 pt-6'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <Input
              allowClear
              placeholder='Search categories...'
              value={filter.txt_search}
              onChange={e =>
                setFilter(p => ({ ...p, txt_search: e.target.value }))
              }
              onPressEnter={() => getlist()}
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
                  onClick={() => getlist()}
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

      {/* Modal Form */}
      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Category'
            : 'Create New Category'
        }
        open={state.open}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={600}
      >
        <Form layout='vertical' onFinish={onFinish} form={formRef}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label='Category Name'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder='Enter category name' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='Parent ID'
                name='parent_id'
                {...validate.parent_id}
              >
                <Input placeholder='Enter parent ID (Optional)' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Description' name='description'>
                <Input.TextArea rows={3} placeholder='Enter description' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Status' name='status' initialValue={1}>
                <Select
                  options={[
                    { label: 'Active', value: 1 },
                    { label: 'Inactive', value: 0 }
                  ]}
                />
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
      {/* Data Table */}
      {isPermissionAction('category.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          scroll={{x: 'max-content'}}
          className='shadow-sm rounded-xl overflow-hidden'
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: text => (
                <span className='font-medium text-gray-700'>{text}</span>
              )
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description',
              render: text => text || <Text type='secondary'>-</Text>
            },
            {
              title: 'Parent ID',
              dataIndex: 'parent_id',
              align: 'center',
              key: 'parent_id'
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
              hidden: !(
                isPermissionAction('category.update') ||
                isPermissionAction('category.delete')
              ),
              render: (_, data) => (
                <Space>
                  {isPermissionAction('category.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('category.delete') && (
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

export default CategoryPage
