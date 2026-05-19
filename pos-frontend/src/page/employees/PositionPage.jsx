import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Row,
  Typography
} from 'antd'
import {
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
  SearchOutlined
} from '@ant-design/icons'
import { RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'
import { CiEdit } from 'react-icons/ci'

// Utils (Assuming these exist in your project)
import { request } from '../../utils/request'
import { isPermissionAction } from '../../utils/helper'
import PageLoader from '../../component/common/PageLoader'

const { Text, Title } = Typography

function PositionPage () {
  const [formRef] = Form.useForm()
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    txt_search: ''
  })

  const [validate, setValidate] = useState({})

  // Fetch List from Laravel PositionController
  const getList = async (param_filter = {}) => {
    const currentFilter = { ...filter, ...param_filter }
    setState(pre => ({ ...pre, loading: true }))

    let query_param = '?id_loading=true' // standard param
    if (currentFilter.txt_search) {
      query_param +=
        '&txt_search=' + encodeURIComponent(currentFilter.txt_search)
    }

    const res = await request('positions' + query_param, 'get', {})
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
    setValidate({})
  }

  const onFinish = async values => {
    let url = 'positions'
    let method = 'post'
    const id = formRef.getFieldValue('id')

    if (id) {
      url += '/' + id
      method = 'put' // Laravel update logic
    }

    setState(p => ({ ...p, loading: true }))
    const res = await request(url, method, values)

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
    formRef.setFieldsValue({ ...data })
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
        const res = await request(`positions/${data.id}`, 'delete', {})
        if (res && !res.error) {
          message.success(res.message || 'Deleted successfully!')
          getList()
        } else {
          // Captures the 422 error if employees are assigned
          message.error(res?.message || 'Delete failed!')
        }
      }
    })
  }

  const handleReset = () => {
    const resetFilter = { txt_search: '' }
    setFilter(resetFilter)
    getList(resetFilter)
  }

  return (
    <div className='p-4'>
      {state.loading && <PageLoader />}

      <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
          <div>
            <h2 className='text-xl font-bold text-gray-900 m-0 flex flex-col md:flex-row md:items-center gap-2'>
              Position Management
              <span className='text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit'>
                Total: {state.total || 0}
              </span>
            </h2>
            <Text type='secondary'>
              Manage company hierarchy and job roles.
            </Text>
          </div>

          {isPermissionAction('position.create') && (
              <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
                className='bg-indigo-600 border-0 hover:bg-indigo-700 flex items-center'
              >
                Add Position
              </Button>
          )}
        </div>

        <div className='border-t border-gray-100 pt-6'>
          <div className='flex flex-wrap justify-between items-center gap-4'>
            <Input
              allowClear
              value={filter.txt_search}
              placeholder='Search Name or Description...'
              onChange={e =>
                setFilter(p => ({ ...p, txt_search: e.target.value }))
              }
              onPressEnter={() => getList()}
              prefix={<SearchOutlined className='text-gray-400' />}
              style={{ width: 250 }}
            />
            <div className='flex gap-2'>
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
      </div>

      <Modal
        title={
          formRef.getFieldValue('id')
            ? 'Update Position'
            : 'Create New Position'
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
                label='Position Name'
                name='name'
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder='e.g. Senior Developer' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Parent Position' name='parent_id'>
                <Select
                  placeholder='Select parent position (Optional)'
                  allowClear
                  options={state.list
                    .filter(item => item.id !== formRef.getFieldValue('id'))
                    .map(item => ({ label: item.name, value: item.id }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Description' name='description'>
                <Input.TextArea
                  rows={3}
                  placeholder='Role responsibilities...'
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

      {isPermissionAction('position.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              fontWeight: 'bold'
            },
            {
              title: 'Reports To (Parent)',
              dataIndex: ['parent', 'name'],
              key: 'parent',
              render: text =>
                text || (
                  <Text type='secondary' italic>
                    N/A (Top Level)
                  </Text>
                )
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description',
              ellipsis: true
            },
            {
              title: 'Action',
              align: 'center',
              key: 'action',
              hidden: !(
                isPermissionAction('position.update') ||
                isPermissionAction('position.delete')
              ),
              render: (_, data) => (
                <Space size='middle'>
                  {isPermissionAction('position.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('position.delete') && (
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

export default PositionPage
