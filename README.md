# -Study-PDFjs

`PDF.js` 라이브러리를 사용하여, `PDF Viewer` 구현 연습 저장소 입니다.

* `pdfjs-dist` 의 `workerSrc`

```javascript
import * as PDFJS from "pdfjs-dist";
PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
```

<br />

* [1. 01-vanilla-js_pdf-js](https://github.com/Chocobe/-Study-PDFjs/tree/master/01-vanilla-js_pdf-js)
  * `Webpack` 환경에서 `PDF Viewer` 구현 프로젝트
  * `<canvas />` 에 Rendering 은 하되, `Text Selection` 기능은 없습니다.

