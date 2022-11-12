import {
  useRef,
  useState,
  useMemo,
  useEffect,
} from "react";
import styled from "styled-components";
import * as PDFJS from "pdfjs-dist";
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

const _PdfViewer = styled.div`
  width: 100%;
  height: 100%;

  .pageCanvas {
    display: block;
  }
`;

export type PdfViewerProps = {
  pdfUrl: string | null;
  pageNumber: number;
  onChangeTotalPageCount: (totalPageCount: number) => void;
  onChangePageNumber: (newPageNumber: number) => void;
};

function PdfViewer({
  pdfUrl,
  pageNumber,
  onChangePageNumber,
  onChangeTotalPageCount,
}: PdfViewerProps) {
  const $thisEl = useRef<HTMLDivElement | null>(null);
  const $pageCanvasList = useRef<Array<HTMLCanvasElement | null>>([]);

  const isWithoutWatchPageNumber = useRef<boolean>(false);
  const isPageLoading = useRef<boolean>(false);

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PDFPageProxy[] | null>(null);

  const totalPageCount = useMemo(() => {
    return pdf?.numPages || null;
  }, [pdf]);

  const loadPdf = async () => {
    if (!pdfUrl) return;

    const newPdf = await PDFJS.getDocument(pdfUrl).promise;
    setPdf(newPdf);
    onChangeTotalPageCount(newPdf.numPages);
  };

  const loadPage = async (newPageNumber: number) => {
    if (!pdf || isPageLoading.current) return;

    isPageLoading.current = true;
    const newPage = await pdf.getPage(newPageNumber);
    isPageLoading.current = false;

    setPages([newPage]);
  }

  const getViewport = (page: PDFPageProxy) => {
    const originViewport = page.getViewport({ scale: 1 });

    const { width } = $thisEl.current!.getBoundingClientRect();
    const scale = width / originViewport.width;

    return page.getViewport({ scale });
  };

  const resizePageCanvasList = () => {
    const firstPage = pages?.[0];

    if (!firstPage) return;

    const newViewport = getViewport(firstPage);

    $pageCanvasList.current.forEach($canvas => {
      if (!$canvas) return;

      $canvas.width = newViewport.width;
      $canvas.height = newViewport.height;
    });
  };

  const renderPageCanvasList = () => {
    if (!pages?.length) return;

    pages.forEach((page, idx) => {
      const viewport = getViewport(page);
      const $pageCanvas = $pageCanvasList.current![idx]!;
      const canvasContext = $pageCanvas.getContext("2d")!;

      page.render({
        canvasContext,
        viewport,
      });
    })
  };

  useEffect(() => {
    loadPdf();
    // eslint-disable-next-line
  }, [pdfUrl]);

  useEffect(() => {
    isWithoutWatchPageNumber.current = true;
    onChangePageNumber(1);

    loadPage(1);
    // eslint-disable-next-line
  }, [pdf]);

  useEffect(() => {
    resizePageCanvasList();
    renderPageCanvasList();

    isWithoutWatchPageNumber.current = false;
  }, [pages]);

  useEffect(() => {
    if (totalPageCount === null) return;
    
    if (isWithoutWatchPageNumber.current) {
      isWithoutWatchPageNumber.current = false;
      return;
    }

    if (pageNumber < 1) {
      onChangePageNumber(1);
      return;
    }

    if (pageNumber > totalPageCount) {
      onChangePageNumber(totalPageCount);
      return;
    }

    if (isPageLoading.current) {
      isWithoutWatchPageNumber.current = true;
      onChangePageNumber(pages![0].pageNumber);
      return;
    }

    loadPage(pageNumber);
  }, [pageNumber]);
  
  return (
    <_PdfViewer ref={$thisEl}>
      {pages?.map((page, idx) => (
        <canvas
          key={idx}
          className="pageCanvas"
          ref={$el => $pageCanvasList.current[idx] = $el}
        />
      ))}
    </_PdfViewer>
  );
}

export default PdfViewer;