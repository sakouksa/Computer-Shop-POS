import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Space, Table, Tag } from "antd";
import { CgInsertBeforeO } from "react-icons/cg";
import Item from "antd/es/list/Item";
//Import icon
import { CiCloudOn, CiEdit } from "react-icons/ci";
import { request } from "../../util/request";
// import dayJs
import dayjs from "dayjs";
import { dateClient } from "../../util/helper";
import { MdDelete } from "react-icons/md";
function RolePage() {
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
  });
  useEffect(() => {
    getlist();
  }, []);
  // posts Function
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true })); // បើក Loading
    const res = await request("role", "get", {});
    if (res) {
      setState((pre) => ({
        ...pre,
        total: res.total,
        list: res.list || [], // ការពារកុំឱ្យ Error បើ Backend ផ្ញើមកទទេ
        loading: false, // បិទ Loading
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false }));
    }
  };

  return (
    <div>
      <div className="main-page-header">
        <Space>
          <div>Role{state.total}</div>
          <Input.Search allowClear placeholder="Search Roles" />
        </Space>
      </div>
      <Table
        dataSource={state.list}
        loading={state.loading}
        columns={[
          {
            key: "name",
            title: "Name",
            dataIndex: "name",
          },
          {
            key: "code",
            title: "Code",
            dataIndex: "code",
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
          },
          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            render: (value) =>
              value ? (
                <Tag color="green">Active</Tag>
              ) : (
                <Tag color="red">Inactive</Tag>
              ),
          },
          {
            key: "created_at",
            title: "Created At",
            dataIndex: "created_at",
            render: (value) => dateClient(value,"DD/MM/YYYY HH:mm"),
          },
          {
            key: "action",
            title: "Action",
            align: "center",
            render: () => (
              <Space>
                <Button type="primary" icon={<CiEdit />} />
                <Button danger icon={<MdDelete />} />
              </Space>
            ),
          },
        ]}
      ></Table>
    </div>
  );
}
export default RolePage;
