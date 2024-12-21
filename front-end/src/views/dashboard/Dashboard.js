import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { useSelector } from 'react-redux'

const StyledMessage = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const MessageText = styled.p`
  margin: 0;
`;

const Dashboard = () => {
  const data = useSelector((state) => state.user.data);
  if (data.status === '0') {
    return (
      <StyledMessage>
        <MessageText>
          Tài khoản này hiện tại chưa được kích hoạt, vui lòng liên hệ quản lý hệ thống để kích hoạt tài khoản.
        </MessageText>
      </StyledMessage>
    );
  } else {
    // Nếu re.data.status không phải là 0, không hiển thị gì cả
    return null;
  }
};

export default Dashboard;
