import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
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

import { isPermissionAction } from '../../utils/helper'
import { ExpenseTypeService } from '../../services/ExpenseTypeService'

import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500'

const { Title, Text } = Typography

function ExpenseTypePage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })
  const [isServerError, setIsServerError] = useState(false)
  const [filter, setFilter] = useState({
    txt_search: ''
  })

  useEffect(() => {
    getList()
  }, [])

  const getList = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))
    setIsServerError(false)

    try {
      const res = await ExpenseTypeService.getList(currentFilter)
      if (res && !res.errors) {
        setState(pre => ({
          ...pre,
          total: res.total || 0,
          list: res.list || []
        }))
      } else {
        if (res?.errors?.status === 500) {
          setIsServerError(true)
        } else {
          message.error(res?.errors?.message || 'Failed to fetch data')
        }
      }
    } catch (error) {
      setIsServerError(true)
    } finally {
      setState(pre => ({ ...pre, loading: false }))
    }
  }

  const onFinish = async values => {
    try {
      let res = values.id
        ? await ExpenseTypeService.update(values.id, values)
        : await ExpenseTypeService.create(values)

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
      content: `Are you sure you want to delete this category?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await ExpenseTypeService.delete(data.id)
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
    const data = { txt_search: '' }
    setFilter(data)
    getList(data)
  }

  if (isServerError) return <ServerErrorPage onRetry={() => getList()} />

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}

      {/* Header & Filter Section */}
      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0'>
              Expense Type Management
              <span className='ml-2 text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.total}
              </span>
            </h2>
            <Text type='secondary'>
              Manage and organize categories of expenses.
            </Text>
          </div>
          <div className='flex items-center gap-3'>
            {isPermissionAction('expense-type.create') && (
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
            placeholder='Search category name...'
            value={filter.txt_search}
            onChange={e =>
              setFilter(p => ({ ...p, txt_search: e.target.value }))
            }
            onPressEnter={() => getList()}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <div className='flex items-center gap-3'>
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

      {/* Modal Form */}
      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Expense Type'
            : 'Add Expense Type'
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
                label='Category Name'
                name='name'
                rules={[
                  { required: true, message: 'Please enter category name!' }
                ]}
              >
                <Input placeholder='Enter category name (e.g. Office Supplies)' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label='Description' name='description'>
                <Input.TextArea rows={3} placeholder='Optional description' />
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
      {isPermissionAction('expense-type.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            {
              title: 'ID',
              dataIndex: 'id',
              width: 80
            },
            {
              title: 'Category Name',
              dataIndex: 'name',
              render: text => <Text strong>{text}</Text>
            },
            {
              title: 'Description',
              dataIndex: 'description',
              render: text => text || <Text type='secondary'>-</Text>
            },
            {
              title: 'Actions',
              align: 'center',
              width: 150,
              hidden: !(
                isPermissionAction('expense-type.update') ||
                isPermissionAction('expense-type.delete')
              ),
              render: (_, data) => (
                <Space>
                  {isPermissionAction('expense-type.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('expense-type.delete') && (
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
            You do not have permission to view expense type data!
          </Text>
        </div>
      )}
    </div>
  )
}

export default ExpenseTypePage
