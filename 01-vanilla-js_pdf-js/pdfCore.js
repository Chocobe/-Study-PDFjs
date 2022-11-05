// @ts-check

import * as PDFJS from "pdfjs-dist";

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;

/**
 * `.pdf` 파일의 URL
 * @type { string }
 */
const PDF_URL = "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf";

/** 
 * PDFDocumentProxy 객체
 * @type { import("pdfjs-dist").PDFDocumentProxy }
 */
let _PDF_DOC;

/** 
 * 현재 Page 번호 
 * @type { number }
 */
let _CURRENT_PAGE;

/** 
 * PDF 파일의 전체 페이지 수 
 * @type { number }
 */
let _TOTAL_PAGES;

/** 
 * PDF 파일의 Rendering 했는지에 대한 상태 Flag 값 (사실 boolean 역할 0/1) 
 * @type { number }
 */
let _PAGE_RENDERING_IN_PROGRESS = 0;

/** 
 * PDF 를 Rendering 할 <canvas /> 요소 
 * @type { HTMLCanvasElement? }
 */
let _CANVAS = document.querySelector("#pdf-canvas");

/** 
 * PDF Rendering 실행 함수
 * PDF Viewer 의 초기화 역할
 * @param { string } pdfUrl
 */
const showPDF = async pdfUrl => {
  // 0. Type Assersion 처리
  /** @type { HTMLDivElement? } */
  const $pdfLoader = document.querySelector("#pdf-loader");

  /** @type { HTMLDivElement? } */
  const $pdfContents = document.querySelector("#pdf-contents");

  /** @type { HTMLDivElement? } */
  const $pdfTotalPages = document.querySelector("#pdf-total-pages");

  if (!$pdfLoader) return;
  if (!$pdfContents) return;
  if (!$pdfTotalPages) return;
  
  // 1. PDF File Loading Message 표시
  $pdfLoader.style.display = "block";

  // 2. PDF 파일 읽기
  try {
    _PDF_DOC = await PDFJS.getDocument({ url: pdfUrl }).promise;
  } catch (e) {
    console.error(e);
  }
  
  //
  // PDF 파일 로딩 완료 시점
  //

  // 3. PDF 전체 페이지 수 가져오기
  _TOTAL_PAGES = _PDF_DOC.numPages;

  // 4. `#pdf-loader` 숨김 및 `#pdf-contents` 보이기
  $pdfLoader.style.display = "none";
  $pdfContents.style.display = "block";
  $pdfTotalPages.style.display = "block";
  $pdfTotalPages.innerHTML = String(_TOTAL_PAGES);

  // 5. 첫번째 Page Rendering 함수 호출
  showPage(1);
};

/** 
 * pageNo 에 해당하는 Page 를 Rendering 하는 함수 
 * @param { number } pageNo
 */
const showPage = async pageNo => {
  // 0. Type Assertion 처리
  if (!_CANVAS) return;

  /** @type { CanvasRenderingContext2D? } */
  const canvasContext = _CANVAS.getContext("2d");

  /** @type { HTMLButtonElement? } */
  const $prevButton = document.querySelector("#pdf-prev");

  /** @type { HTMLButtonElement? } */
  const $nextButton = document.querySelector("#pdf-next");

  /** @type { HTMLDivElement? } */
  const $pageLoader = document.querySelector("#page-loader");

  /** @type { HTMLDivElement? } */
  const $pdfCurrentPage = document.querySelector("#pdf-current-page");

  if (!canvasContext) return;
  if (!$prevButton) return;
  if (!$nextButton) return;
  if (!$pageLoader) return;
  if (!$pdfCurrentPage) return;

  // 1. Rendering 진행중 상태 Flag 를 true 로 설정
  _PAGE_RENDERING_IN_PROGRESS = 1;

  // 2. 현재 페이지 번호 갱신
  _CURRENT_PAGE = pageNo;

  // 3. Page Loading 중이므로, Page Button disabled 처리
  $prevButton.disabled = true;
  $nextButton.disabled = true;

  // 4. <canvas /> 숨김 및 Page Loading Message 보이기
  _CANVAS.style.display = "none";
  $pageLoader.style.display = "block";

  // 5. 현재 Page No 갱신
  $pdfCurrentPage.innerHTML = `${pageNo}`;

  //
  // 현재 Page 전처리 완료 시점
  //

  // 6. 현재 Page 로딩 시작
  /** @type { import("pdfjs-dist").PDFPageProxy } */
  let page;

  try {
    page = await _PDF_DOC.getPage(pageNo);
  } catch (e) {
    console.error(e);
    return;
  }

  // TODO: Page 로딩 중, 에러가 발생한다면 여기 유력 1
  // 7. `scale === 1` 일 때, Page 의 `width` 값 가져오기
  const pdfOriginalWidth = page.getViewport({ scale: 1 }).width;

  // 8. <canvas /> 의 `width` 에 적용하기
  const scaleRequired = _CANVAS.width / pdfOriginalWidth;

  // 9. scaleRequired 를 반영한 Page 의 viewport 가져오기
  const viewport = page.getViewport({ scale: scaleRequired });

  // 10. scaleRequired 가 반영된 viewport.height 를 <canvas /> 에 반영하기
  _CANVAS.height = viewport.height;

  // 11. Page Rendering 시, Params 객체 생성
  const renderContext = {
    canvasContext,
    viewport,
  };

  // 12. Page Rendering 실행
  try {
    // TODO: Page 로딩 중, 에러가 발생한다면 여기 유력 2
    await page.render(renderContext).promise;
  } catch (e) {
    console.error(e);
  }

  // 13. rendering 진행 완료 Flag 를 false 로 설정
  _PAGE_RENDERING_IN_PROGRESS = 0;

  // 14. Page Loading 완료 => Page Button disabled 해제 처리
  $prevButton.disabled = false;
  $nextButton.disabled = false;

  // 15. <canvas /> 보이기 및 `#pdf-loader` 숨김 처리
  _CANVAS.style.display = "block";
  $pageLoader.style.display = "none";
};

const initEventHandlers = () => {
  /** @type { HTMLButtonElement? } */
  const $showPdfButton = document.querySelector("#show-pdf-button");

  /** @type { HTMLButtonElement? } */
  const $prevButton = document.querySelector("#pdf-prev");

  /** @type { HTMLButtonElement? } */
  const $nextButton = document.querySelector("#pdf-next");

  // 0. Type Assersion 처리
  if (!$showPdfButton) return;
  if (!$prevButton) return;
  if (!$nextButton) return;

  $showPdfButton.addEventListener("click", () => {
    $showPdfButton.style.display = "none";
    showPDF(PDF_URL);
  });

  $prevButton.addEventListener("click", () => {
    if (_CURRENT_PAGE > 1) {
      showPage(--_CURRENT_PAGE);
    }
  });

  $nextButton.addEventListener("click", () => {
    if (_CURRENT_PAGE < _TOTAL_PAGES) {
      showPage(++_CURRENT_PAGE);
    }
  });
};

const initCanvasWidth = () => {
  /** @type { HTMLDivElement? } */
  const $pdfContents = document.querySelector("#pdf-contents");

  if (!$pdfContents) return;
  if (!_CANVAS) return;

  const { width } = $pdfContents.getBoundingClientRect();

  _CANVAS.width = width;
};

initCanvasWidth();
initEventHandlers();