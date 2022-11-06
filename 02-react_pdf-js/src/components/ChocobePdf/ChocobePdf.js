import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import * as PDFJS from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

/**
 * @param {{
 *  pdfUrl: string;
 *  pageNumber: number;
 *  onChangePageNumber: (pageNumber: number) => void;
 * }} props
 */
function ChocobePdf({
  pdfUrl,
  pageNumber,
  onChangePageNumber,
}) {
  const [pdf, setPdf] = useState(null);
  const [page, setPage] = useState(null);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  /** @type { import("react").RefObject<HTMLCanvasElement> } */
  const $canvas = useRef(null);

  const canRenderPage = nextPageNumber => {
    if (!(pdf && $canvas.current)) return false;

    if (isDocumentLoading || isPageLoading) return false;

    if (nextPageNumber < 1) {
      onChangePageNumber(1);
      return false;
    }

    if (nextPageNumber > totalPageCount) {
      onChangePageNumber(totalPageCount);
      return false;
    }

    return true;
  };

  const renderPage = useCallback(async nextPageNumber => {
    if (!pdf) return;

    setIsPageLoading(true);

    const newPage = await pdf.getPage(nextPageNumber);

    if (newPage === page) return;
    
    const pageWidth = newPage.getViewport({ scale: 1 }).width;
    const scale = $canvas.current.width / pageWidth;

    const viewport = newPage.getViewport({ scale });
    $canvas.current.height = viewport.height;

    const renderContext = {
      canvasContext: $canvas.current.getContext("2d"),
      viewport,
    };

    await newPage.render(renderContext).promise;

    setPage(newPage);
    setIsPageLoading(false);

    if (nextPageNumber !== pageNumber) {
      onChangePageNumber(nextPageNumber);
    }
  }, [pdf, $canvas]);

  useEffect(() => {
    if (!(pdfUrl && $canvas.current)) return;

    const loadPdf = async () => {
      setIsDocumentLoading(true);

      const newPdf = await PDFJS.getDocument({ url: pdfUrl }).promise;

      setPdf(newPdf);
      setTotalPageCount(newPdf.numPages);
      setIsDocumentLoading(false);
    };

    loadPdf();
  }, [pdfUrl, $canvas, onChangePageNumber]);

  useEffect(() => {
    renderPage(1);
  }, [pdf]);

  useEffect(() => {
    if (!canRenderPage(pageNumber)) return;
    
    renderPage(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    if (!$canvas.current) return;

    const { width } = $canvas.current.getBoundingClientRect();
    $canvas.current.width = width;
  }, [$canvas]);

  return (
    <canvas ref={$canvas} />
  );
}

export default React.memo(ChocobePdf);