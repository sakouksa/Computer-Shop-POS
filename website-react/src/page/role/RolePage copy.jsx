import React, { use, useState } from "react";
import { Button, Input, message, Modal, Space, Table, Tag } from "antd";
import { CgInsertBeforeO } from "react-icons/cg";
import Item from "antd/es/list/Item";
//Import icon
import { CiCloudOn } from "react-icons/ci";
function RolePage() {
  const [state, setState] = useState({
    list: [],
    loading: false,
    total: 1000,
  });

  const [objRole, setObjRole] = useState({
    id: "",
    name: "",
    group: "",
  });

  const [isEdit, setIdEdit] = useState(null);

  const onSave = () => {
    //check fill required
    if (objRole.id == "") {
      message.warning("Please fill in Id");
      return;
    } else if (objRole.name == "") {
      message.warning("Please fill in Name");
      return;
    } else if (objRole.group == "") {
      message.warning("Please fill in Group");
      return;
    }
    if (isEdit == null) {
      // Check IT role
      const IndexFound = state.list.findIndex((item) => item.id == objRole.id);
      if (IndexFound != -1) {
        message.warning("Id already exist");
        return;
      }

      setState((role) => ({
        ...role,
        list: [...role.list, objRole],
      }));
      //Clare when submit
      setObjRole((p) => ({
        id: "",
        name: "",
        group: "",
      }));
      message.success("Insert Successfully");
    } else {
      //Edit
      var indexUpdate = state.list.findIndex((item) => item.id == isEdit);
      // state.list[indexUpdate].id = objRole.id;
      state.list[indexUpdate].name = objRole.name;
      state.list[indexUpdate].group = objRole.group;
      setState((role) => ({
        ...role,
        list: [...state.list], //Refresh state
      }));
      //Clare when submit
      setObjRole((p) => ({
        id: "",
        name: "",
        group: "",
      }));
      setIdEdit(null);
      message.success("Update Successfully");
    }
  };

  const onClear = () => {
    setObjRole((p) => ({
      id: "",
      name: "",
      group: "",
    }));
  };

  const onDelete = (item, index) => {
    Modal.confirm({
      title: "Delete data",
      content: "Are sure to remove this record",
      onOk: () => {
        const newList = state.list.filter((data) => data.id !== item.id);

        setState((prevStateDelete) => ({
          ...prevStateDelete,
          list: newList,
        }));

        message.success("Delete Successfully");
      },
    });
  };
  const onEdit = (item, index) => {
    setIdEdit(item.id);
    setObjRole((p) => ({
      ...p,
      ...item,
    }));
  };
  return (
    <div>
      <div className="main-page-header">
        <Space>
          <div>Role, Total: {state.list.length}</div>
          <Input.Search allowClear placeholder="Search" />
        </Space>
      </div>
      <div style={{ padding: 40, backgroundColor: "pink", marginBottom: 2 }}>
        <Space>
          <Input
            disabled={isEdit ? true : false}
            placeholder="Enter Id"
            value={objRole.id}
            onChange={(event) =>
              setObjRole((p) => ({ ...p, id: event.target.value }))
            }
          />
          <Input
            placeholder="Enter Name"
            value={objRole.name}
            onChange={(event) =>
              setObjRole((p) => ({ ...p, name: event.target.value }))
            }
          />
          <Input
            placeholder="Enter Group"
            value={objRole.group}
            onChange={(event) =>
              setObjRole((p) => ({ ...p, group: event.target.value }))
            }
          />

          <Button type="" onClick={onClear}>
            Clear
          </Button>
          <Button type="primary" onClick={onSave}>
            {isEdit ? "Update" : "Save New"}
          </Button>
        </Space>
      </div>
      {state.list.length == 0 && (
        <div style={{ textAlign: "center", marginBottom: 10, fontSize: 18 }}>
          <CiCloudOn style={{ fontSize: 60 }} />
          <div>No Record</div>
        </div>
      )}
      {state.list.map((item, index) => (
        <div
          key={index}
          style={{
            padding: 10,
            backgroundColor: "#eeee",
            marginBottom: 3,
            borderRadius: 10,
          }}
        >
          <Space>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "gray",
              }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.id}-{item.name}
              </div>
              <div>{item.group}</div>
            </div>
          </Space>
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button type="primary" onClick={() => onEdit(item, index)}>
                Edit
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => onDelete(item, index)}
              >
                Delete
              </Button>
            </Space>
          </div>
        </div>
      ))}
    </div>
  );
}
export default RolePage;
