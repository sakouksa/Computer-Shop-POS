import React, { useEffect, useState } from "react"; // ថែម useEffect, useState
import { Button, Input, Space, Table } from "antd"; // ថែម Input, Space, Table
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { request } from "../../util/request"; // ត្រូវប្រាកដថា Path នេះត្រឹមត្រូវ
import { dateClient } from "../../util/helper";

function CustomerPage() {
  // state management
  const [state, setState] = useState({
    list: [],
    total: 0,
    loading: false,
  });

  // calling useEffect
  useEffect(() => {
    getlist();
  }, []);
  // posts Function
  const getlist = async () => {
    setState((pre) => ({ ...pre, loading: true })); // បើក Loading
    const res = await request("customer", "get", {});
    if (res) {
      setState((pre) => ({
        ...pre,
        list: res.list || [], // ការពារកុំឱ្យ Error បើ Backend ផ្ញើមកទទេ
        loading: false, //  បិទ Loading
      }));
    } else {
      setState((pre) => ({ ...pre, loading: false
      }));
    }
  };

  return (
    <div>
      <div className="main-page-header">
        <Space style={{ marginBottom: 16 }}>
          {/* show Customer */}
          <div>Customer: {state.list.length}</div>
          <Input.Search allowClear placeholder="Search customer..." />
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
            key: "email",
            title: "Email",
            dataIndex: "email",
          },
          {
            key: "phone",
            title: "Phone",
            dataIndex: "phone",
          },
          {
            key: "address",
            title: "Address",
            dataIndex: "address",
          },
          {
            key: "created_at",
            title: "Created At",
            dataIndex: "created_at",
            render: (value) => dateClient(value),
          },
          {
            key: "action",
            title: "Action",
            dataIndex: "action",
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

export default CustomerPage;
