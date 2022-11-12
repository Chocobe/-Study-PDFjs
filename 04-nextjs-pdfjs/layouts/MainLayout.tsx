import { ReactNode } from "react";
import styled from "styled-components";

const _MyLayout = styled.div`
  width: 100%;
  height: 100vh;
  
  color: ${({ theme }) => theme.colors.customWhite};
  background-color: ${({ theme }) => theme.colors.customBlack};
`;

export type MyLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MyLayoutProps) {
  return (
    <_MyLayout>
      {children}
    </_MyLayout>
  );
};

export default MainLayout;