# PDF.js 구현 (vanilla JS)

* 참고: [https://usefulangle.com/post/20/pdfjs-tutorial-1-preview-pdf-during-upload-wih-next-prev-buttons](https://usefulangle.com/post/20/pdfjs-tutorial-1-preview-pdf-during-upload-wih-next-prev-buttons)

<br />

# PDF.js API

## PDFJS.getDocument({ url }) 

* `url` 로 `.pdf` 파일을 읽어오는 메서드이며 `async` 메서드 입니다.
* `PDFDocumentProxy` 객체를 반환하며, `.pdf` 파일 데이터 입니다.
* `url` 로 요청하기 때문에, 해당 `server` 의 `CORS` 가 설정되어 있어야 파일을 읽을 수 있습니다.


<br /><br />


만약 `url` 이 아닌 `Local` 에서 직접 `.pdf` 파일을 불러온다면, `URL.createObjectURL()` 로 변환하면, `url` 로 사용할 수 있게 됩니다.

<br />

`PDF.js` 는 이러한 경우를 위해, `Parameter` 로 `url` 뿐만 아니라 `data` 로도 전달 받습니다.

넘겨주는 `data` 는 `Binary Data` 형식입니다.

아래 코드는 `PDF.js` 의 `getDocument()` 예시 입니다.

```javascript
// PDF 파일의 URL 사용
PDFJS.getDocument({ url: "https://sample.pdf" });

// PDF 파일의 
PDFJS.getDocument({ data: binaryData });
```


<br /><br />


### `Base64`, `Encoding`, `Decoding` 정리


파일은 전송을 위해 `Encoding` 과 `Decoding` 개념을 사용 합니다.

* `Encoding`: `고수준 언어(자연어)` => `저수준 언어(Binary)` 로 변환하는 방식을 말합니다.
* `Decoding`: `저수준 언어(Binary)` => `고수준 언어(자연어)` 로 해석하는 방식을 말합니다.

<br />

파일을 전송할 때는 `Encoding` 을 하게 되는데, 이 방식에는 `Base64` 방식을 사용합니다.

`Base64` 의 문자 그대로의 뜻은 `64진법` 이며, `ASCII` 코드로 구성되게 됩니다.

그리고 `Base64` 로 `Encoding` 하는 목적은 파일 전송중에 파일 데이터에 영향이 없도록 하기 위함 입니다.

* `Binary` 와 `ASCII` 모두 통신으로 전달할 수 있습니다.
* `Binary` 로 전송할 경우 `BIT 단위 통신` 을 하기 때문에, `데이터 손실` 에 대한 유추를 할 수 없다는 문제가 있습니다.
* `ASCII` 로 전송하면, `안정성` 과 `에러수정` 및 `작은 용량으로 빠른 전송` 을 할 수 있기에, `Base64 (ASCII)` 로 파일 전송을 합니다.

<br />

이렇게 변환한 `Base64` 데이터를 다시 사용할 때는 `Decoding` 을 하여, `원래의 데이터(Binary Data)` 로 표현할 수 있습니다.

<br />

`Javascript` 의 `window` 객체에는 `Base64` 에 대한 메서드를 제공합니다.

* `btoa()`
  * `Binary to ASCII` 의미를 가지며, `Binary` 데이터를 `Base64 (=== ASCII)` 로 `Encoding` 한 결과를 반환 합니다.
  * `Encoding` 결과값은 `Base64` 이므로, 파일 전송에 사용하게 됩니다.

* `atob()`
  * `ASCII to Binary` 의미를 가지며, `Base64 (=== ASCII)` 를 `Binary` 데이터로 해석한 결과를 반환 합니다.
  * `Decoding` 결과값을 `Binary` 이므로, Javascript 에서 파일 데이터를 `조작`, `가공` 등의 활용할 때 사용 합니다.

<br />

```javascript
const binaryData = "Hello World";

const base64Data = btoa(binaryData);
console.log(base64Data); // "SGVsbG8gV29ybGQ="

const decodedData = atob(base64Data);
console.log(decodedData); // "Hello World"
```


<br /><br />


## PDFJS.numPages

`PDFJS.numPages` 프로퍼티는 `PDFJS.getDocument()` 로 읽어온 `.pdf` 파일의 `전체 페이지 수` 입니다.

* `readonly` 값 입니다.

```javascript
const totalPageCount = PDFJS.numPages();
```


<br /><br />


## PDFJS.getPage(targetPageNum: number)

`Parameter` 로 넘겨준 `페이지` 에 대한 데이터를 반환 합니다.

* `async` 메서드 입니다.
* 반환 데이터는 `PDFPageProxy` 입니다.
* 해당 페이지 데이터를 읽어올 뿐, 화면에 `rendering` 하지는 않습니다.

```javascript
const pageData = PDFJS.getPage(1);
```


<br /><br />


## PDFJS.getViewport(scale)

현재 페이지를 기준으로, `Parameter` 로 넘겨준 `scale` 일 때의 `차원 (Demension)` 객체를 반환 합니다.

`차원 (Demension)` 객체에는 현재 페이지에 대한 `px` 값을 `number` 로 나타냅니다.

<br />

```javascript
const viewport = PDFJS.getViewport(1);

const width = viewport.width;
const height = viewport.height;
```


<br /><br />


## PDFJS.render(renderContext)

현재 페이지를 실제 화면에 `rendering` 하는 메서드 입니다.

* `async` 메서드 입니다.
* `rendering` 은 설정에 따라 `<canvas />` 또는 `<SVG />` 에 그립니다.

