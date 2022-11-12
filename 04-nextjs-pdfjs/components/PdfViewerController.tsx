import {
  useRef,
  ChangeEvent,
} from "react";
import styled, {
  css,
} from "styled-components";

const _mixinActionElement = css`
  padding: 8px 16px;

  color: #fff;
  font-size: 20px;
  font-weight: 700;

  border: none;
  border-radius: 8px;
  transition: all 0.28s;

  &:hover {
    box-shadow: 0 1px 6px #fff;
  }

  &:active {
    box-shadow: 0 1px 3px #fff;
    opacity: 0.5;
  }
`;

const _PdfViewerController = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  color: ${({ theme }) => theme.colors};

  flex-shrink: 0;

  color: #ff1493;

  .PdfViewerController {
    &-button {
      ${_mixinActionElement}

      background-color: #03a9f4;
    }

    &-fileUploader {
      &-button {
        ${_mixinActionElement}

        background-color: #ff1493;
        transition: all 0.28s;
      }

      &-hiddenInput {
        display: none;
      }
    }
  }
`;

export type PdfViewerControllerProps = {
  pageNumber: number;
  onChangePageNumber: (newPageNumber: number) => void;
  onChangePdfUrl: (pdfUrl: string | null) => void;
};

function PdfViewerController({ 
  pageNumber,
  onChangePageNumber,
  onChangePdfUrl,
}: PdfViewerControllerProps) {
  const $inputFile = useRef<HTMLInputElement | null>(null);
  
  const onClickFileInputButton = () => {
    $inputFile.current!.click();
  };
  
  const _onChangePdfFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    
    if (!file) {
      onChangePdfUrl(null);
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    onChangePdfUrl(fileUrl);
  };
  
  return (
    <_PdfViewerController>
      <button
        className="PdfViewerController-button"
        onClick={() => onChangePageNumber(--pageNumber)}
      >
        prev
      </button>

      <button
        className="PdfViewerController-button"
        onClick={() => onChangePageNumber(++pageNumber)}
      >
        next
      </button>

      <div className="PdfViewerController-fileUploader">
        <button 
          className="PdfViewerController-fileUploader-button"
          onClick={onClickFileInputButton}
        >
          Select PDF FIle
        </button>

        <input
          className="PdfViewerController-fileUploader-hiddenInput"
          type="file"
          ref={$inputFile}
          onChange={_onChangePdfFile}
        />
      </div>
    </_PdfViewerController>
  );
}

export default PdfViewerController;