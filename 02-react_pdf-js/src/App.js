import React, {
  useState,
  useCallback,
} from "react";

import ChocobePdf from "./components/ChocobePdf/ChocobePdf";
import "./App.css";

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState("https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf");
  
  const onChangePageNumber = useCallback((pageNumber) => {
    setPageNumber(pageNumber);
  }, []);

  const onPrevPage = useCallback(() => {
    onChangePageNumber(pageNumber => pageNumber - 1);
  }, [onChangePageNumber]);

  const onNextPage = useCallback(() => {
    onChangePageNumber(pageNumber => pageNumber + 1);
  }, [onChangePageNumber]);

  const onChangePdfUrl = e => {
    const file = e.target.files?.[0];

    if (!file) return;

    const ff = URL.createObjectURL(file);
    console.log("ff: ", ff);

    setPdfUrl(ff);
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="actions">
        <input type="file" onChange={onChangePdfUrl} />
        <button onClick={onPrevPage}>prev</button>
        <button onClick={onNextPage}>next</button>
      </div>

      <ChocobePdf 
        pdfUrl={pdfUrl}
        pageNumber={pageNumber}
        onChangePageNumber={onChangePageNumber}
      />
    </div>
  );
}

export default App;