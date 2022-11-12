import {
  useState,
  useCallback,
  useEffect,
} from "react";
import styled from "styled-components";
import {
  PdfViewerController,
  PdfViewer,
} from "@/components";

const _Home = styled.div`
  padding: 20px 40px;
  height: 100%;

  display: flex;
  flex-direction: column;
  
  overflow: hidden;

  .Home {
    &-header {
      flex-shrink: 0;

      font-size: 24px;
      font-weight: 700;
      text-align: right;
    }

    &-main {
      margin-top: 20px;
      height: 100%;

      flex-shrink: 1;

      display: flex;
      flex-direction: column;

      &-contents {
        margin-top: 20px;
        height: 100%;

        overflow-y: scroll;

        flex-shrink: 1;
      }
    }
  }
`;

function Home() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const onChangePageNumber = useCallback((newPageNumber: number) => {
    setPageNumber(newPageNumber);
  }, []);

  const onChangeTotalPageCount = useCallback((newTotalPageCount: number) => {
    setTotalPageCount(newTotalPageCount);
  }, []);

  const onChangePdfUrl = useCallback((newPdfUrl: string | null) => {
    if (!newPdfUrl) {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);

      setPdfUrl(null);
      return;
    }

    setPdfUrl(newPdfUrl);
  }, [pdfUrl]);
  
  useEffect(() => {
    console.log("pdfUrl 변경 감지: ", pdfUrl);
  }, [pdfUrl]);
  
  return (
    <_Home>
      <header className="Home-header">
        NextJS - PDF.js 구현
      </header>

      <main className="Home-main">
        <PdfViewerController
          pageNumber={pageNumber}
          onChangePageNumber={onChangePageNumber}
          onChangePdfUrl={onChangePdfUrl}
        />

        {/* TODO: <PdfViewer /> 구현하기 */}
        <div className="Home-main-contents">
          <PdfViewer
            pdfUrl={pdfUrl}
            pageNumber={pageNumber}
            onChangePageNumber={onChangePageNumber}
            onChangeTotalPageCount={onChangeTotalPageCount}
          />
        </div>
      </main>
    </_Home>
  );
}

export default Home;