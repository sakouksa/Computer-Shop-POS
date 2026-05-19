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
  Typography,
  Row,
  Col,
  notification
} from 'antd'
import {
  SearchOutlined,
  ExclamationCircleFilled,
  ReloadOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { CiEdit } from 'react-icons/ci'
import { RiSave3Fill } from 'react-icons/ri'
import { MdDelete } from 'react-icons/md'
import { BiSolidEditAlt } from 'react-icons/bi'

// Utils & Services
import { dateClient, isPermissionAction } from '../../utils/helper'
import { ProvinceService } from '../../services/provinceService' // កែ path តាមជាក់ស្តែង

// Components
import PageLoader from '../../component/common/PageLoader'
import ServerErrorPage from '../error-page/500' // ប្រាកដថាមាន component នេះ

const { Title, Text } = Typography

function ProvincePage () {
  const [formRef] = Form.useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [isServerError, setIsServerError] = useState(false)

  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
    open: false
  })

  const [filter, setFilter] = useState({
    text_search: '',
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
    };
    setState(pre => ({
      ...pre,
      loading: true
    }));

    try {
      const res = await ProvinceService.getList(currentFilter);

      if (res && !res.errors) {
        setIsServerError(false);
        setState(pre => ({
          ...pre,
          total: res.list?.length || 0,
          list: res.list || []
        }));
      } else {
        const status = res?.errors?.status;
        if (status === 500) {
          setIsServerError(true);
        } else if (status === 403) {
          setIsServerError(false);
          message.error("You don't have permission to view this list.");
        } else {
          message.error(res?.errors?.message || "Something went wrong!");
        }
      }
    } catch (error) {
      setIsServerError(true);
    } finally {
      setState(pre => ({
        ...pre,
        loading: false
      }));
    }
  };
  const onFinish = async values => {
    try {
      const id = formRef.getFieldValue('id')
      let res = id
        ? await ProvinceService.update(id, values)
        : await ProvinceService.create(values)

      if (res && !res.errors) {
        notification.success({
          message: 'Success',
          description: res.message || 'Operation successful'
        })
        handleCloseModal()
        getList()
      } else {
        setValidate(res.errors || {})
        message.error(res?.errors?.message || 'Operation failed!')
      }
    } catch (error) {
      message.error('Server error occurred.')
    }
  }

  const handleDelete = async data => {
    Modal.confirm({
      title: 'Confirm Deletion',
      icon: <ExclamationCircleFilled style={{ color: '#ff4d4f' }} />,
      content: `Are you sure you want to delete province "${data.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      centered: true,
      onOk: async () => {
        try {
          const res = await ProvinceService.delete(data.id)
          if (res && !res.errors) {
            message.success(res.message || 'Deleted successfully!')
            getList()
          } else {
            message.error(res?.errors?.message || 'Deletion failed!')
          }
        } catch (error) {
          message.error('Error deleting.')
        }
      }
    })
  }

  const handleEdit = data => {
    formRef.setFieldsValue({ ...data })
    setIsEdit(true)
    setState(pre => ({ ...pre, open: true }))
  }

  const handleOpenModal = () => {
    formRef.resetFields()
    formRef.setFieldValue('status', 1)
    setIsEdit(false)
    setState(pre => ({ ...pre, open: true }))
  }

  const handleCloseModal = () => {
    setState(pre => ({ ...pre, open: false }))
    formRef.resetFields()
    setValidate({})
  }

  const handleReset = () => {
    const resetFilter = { text_search: '', status: null }
    setFilter(resetFilter)
    getList(resetFilter)
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
              Province Management
              <span className='ml-2 text-sm font-normal text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full'>
                Total: {state.list.length}
              </span>
            </h2>
            <Text type='secondary'>
              Manage locations and distances from the city center.
            </Text>
          </div>
          {isPermissionAction('province.create') && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className='bg-indigo-600 border-0 hover:bg-indigo-700'
            >
              Add Province
            </Button>
          )}
        </div>

        <div className='border-t border-gray-100 pt-6 flex flex-wrap justify-between items-center gap-4'>
          <Input
            placeholder='Search name or code...'
            value={filter.text_search}
            onChange={e =>
              setFilter(p => ({ ...p, text_search: e.target.value }))
            }
            onPressEnter={() => getList()}
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <div className='flex gap-3'>
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
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              Reset
            </Button>
            <Button
              type='primary'
              onClick={() => getList()}
              icon={<SearchOutlined />}
              className='bg-indigo-600 border-0'
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        title={isEdit ? 'Update Province' : 'Create Province'}
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
                label='Province/City Name'
                name='name'
                {...validate.name}
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder='Enter province name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Code'
                name='code'
                {...validate.code}
                rules={[{ required: true, message: 'Please enter code!' }]}
              >
                <Input placeholder='Enter code' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='Distance (km)'
                name='distand_from_city'
                {...validate.distand_from_city}
                rules={[{ required: true, message: 'Please enter distance!' }]}
              >
                <Input type='number' placeholder='Distance in km' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Description' name='description'>
                <Input.TextArea
                  rows={4}
                  placeholder='Enter province details...'
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='Status' name='status'>
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
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button
                type='primary'
                htmlType='submit'
                className='bg-indigo-600'
                icon={isEdit ? <BiSolidEditAlt /> : <RiSave3Fill />}
              >
                {isEdit ? 'Update' : 'Save'}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Data Table */}
      {isPermissionAction('province.view') ? (
        <Table
          dataSource={state.list}
          rowKey='id'
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              render: t => <Text strong>{t}</Text>
            },
            { title: 'Code', dataIndex: 'code' },
            {
              title: 'Distance',
              dataIndex: 'distand_from_city',
              render: v => `${v} km`
            },
            {
              title: 'Description',
              dataIndex: 'description',
              key: 'description',
              width: 250,
              render: text => (
                <div className='text-gray-500 text-xs italic'>
                  {text || '-'}
                </div>
              )
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: v => (
                <Tag color={v === 1 ? 'green' : 'red'}>
                  {v === 1 ? 'Active' : 'Inactive'}
                </Tag>
              )
            },
            {
              title: 'Created At',
              dataIndex: 'created_at',
              render: v => dateClient(v)
            },
            {
              title: 'Action',
              align: 'center',
              hidden: !(
                isPermissionAction('province.update') ||
                isPermissionAction('province.delete')
              ),
              render: (_, data) => (
                <Space>
                  {isPermissionAction('province.update') && (
                    <Button
                      type='text'
                      onClick={() => handleEdit(data)}
                      icon={
                        <CiEdit style={{ fontSize: 18, color: '#004EBC' }} />
                      }
                    />
                  )}
                  {isPermissionAction('province.delete') && (
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

export default ProvincePage
