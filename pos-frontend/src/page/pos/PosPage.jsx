import React from "react";
import { Row, Col, Card, Typography, Button } from "antd";

import { MdOutlineWeekend, MdLeaderboard, MdStorefront } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { profileStore } from "../../store/profileStore";
const { Text, Title } = Typography;

const PosPage = () => {
  const { permission } = profileStore();
  const { profile } = profileStore();

  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>
      {permission?.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}
      <Button type="primary">Dashboard</Button>
    </div>
  );
};

export default PosPage;