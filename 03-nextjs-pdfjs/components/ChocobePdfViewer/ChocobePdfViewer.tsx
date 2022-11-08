import React, {
  useRef,
  useEffect,
  useState, 
} from "react";
import styled from "styled-components";
import * as PDFJS from "pdfjs-dist";
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;

const ChocobePdfViewerRoot = styled.div`
  width: 100%;
  height: 100%;

  overflow-y: scroll;

  > canvas {
    display: block;
    background-color: #ff1493;
  }

  > canvas + canvas {
    margin-top: 1px;
  }
`;

function ChocobePdfViewer(props: any) {
  const $viewerRoot = useRef<HTMLDivElement>(null);
  const canvasSize = useRef({
    width: 0,
    height: 0,
    scale: 1,
  });

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<PDFPageProxy[]>([]);

  const loadPdf = async () => {
    const url = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

    const newPdf = await PDFJS.getDocument(url).promise;
    setPdf(newPdf);

    console.log("viewerState.pdf: ", pdf);
  };

  const loadPage = async (pageNumber: number) => {
    if (!pdf) return;

    return await pdf.getPage(pageNumber);
  };

  const loadAllPages = async () => {
    if (!pdf) return;
    
    const pages = (await Promise.all(
      Array.from(
        { length: pdf.numPages },
        (_, i) => loadPage(i + 1)
      )
    )).filter(page => page) as PDFPageProxy[];

    console.log("pages: ", pages);

    setPages(pages);
  };

  const initCanvasSize = () => {
    if (!$viewerRoot.current || !pages.length) return;

    const page = pages[0];
    const { width } = $viewerRoot.current.getBoundingClientRect();

    const {
      width: pageWidth,
      height: pageHeight,
    } = page.getViewport({ scale: 1 });
    
    const scale = width / pageWidth;
    const height = pageHeight * scale;

    canvasSize.current = {
      width,
      height,
      scale,
    };
  };

  const renderPages = async () => {
    if (!pages.length || !$viewerRoot.current) return;

    const { width, height, scale } = canvasSize.current;

    const canvasList = await Promise.all(pages.map(async page => {
      const $pageCanvas = document.createElement("canvas");
      $pageCanvas.width = width;
      $pageCanvas.height = height;

      const canvasContext = $pageCanvas.getContext("2d")!;
      const viewport = page.getViewport({ scale });

      await page.render({
        canvasContext,
        viewport,
      }).promise;

      return $pageCanvas;
    }));

    $viewerRoot.current.replaceChildren(...canvasList);

    console.log("렌더링 완료");
  }

  useEffect(() => {
    loadPdf();
  }, []);

  useEffect(() => {
    loadAllPages();
  }, [pdf]);

  useEffect(() => {
    initCanvasSize();
    renderPages();
  }, [pages]);

  return (
    <ChocobePdfViewerRoot ref={$viewerRoot}>
      <canvas className="viewerCanvas" />
      <canvas className="viewerCanvas" />
    </ChocobePdfViewerRoot>
  )
}

export default ChocobePdfViewer;