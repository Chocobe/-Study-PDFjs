import { ChocobePdfViewer } from "@/components";
import styled from "styled-components";

const HomeEl = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
`;

const HeaderEl = styled.header`
  padding: 20px;
  flex-shrink: 0;

  font-size: 24px;
  font-weight: 900;
  text-align: right;

  border-bottom: 1px solid #777;
`;

const MainEl = styled.main`
  height: 100%;
  flex-shrink: 1;
  overflow: hidden;
`;

function Home() {
  return (
    <HomeEl>
      <HeaderEl>
        Hello Home Page Component
      </HeaderEl>

      <MainEl>
        <ChocobePdfViewer />
      </MainEl>
    </HomeEl>
  );
}

export default Home;