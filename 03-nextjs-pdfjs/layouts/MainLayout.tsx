import React from "react";
import styled from "styled-components";

const MainLayoutRoot = styled.div`
  width: 100%;
  height: 100vh;

  color: #eee;
  background-color: #222;
`;

type MainLayoutProps = {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <MainLayoutRoot>
      {children}
    </MainLayoutRoot>
  );
}

export default MainLayout;