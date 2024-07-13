import React, { useEffect, useRef } from "react";
import { DataStream, connectDataStream } from "@ts/datastream";

interface Props {
  onViewerRefUpdate: (viewer: HTMLInputElement | null) => void;
  onViewerSizeUpdate: (viewer: DOMRect) => void;
}
const Viewer3DComponent = ({ onViewerRefUpdate, onViewerSizeUpdate }: Props) => {
  const viewerReference = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const viewerSizeCallback = () => {
      let viewerRect = new DOMRect();

      const viewerRef: HTMLInputElement | null = viewerReference.current;
      if (viewerRef) {
        viewerRect = viewerRef.getBoundingClientRect();
      }

      onViewerSizeUpdate(viewerRect);
    };
    window.addEventListener("resize", viewerSizeCallback);

    onViewerRefUpdate(viewerReference.current);
    viewerSizeCallback();

    return () => {
      window.removeEventListener("resize", viewerSizeCallback);
    };
  }, []);

  return <div ref={viewerReference} className="viewer" />;
};

const getEmitters = (dataStream: DataStream) => ({
  onViewerRefUpdate: (viewerRef: HTMLInputElement) => {
    dataStream.stateStream.viewerRef.emit(viewerRef);
  },
  onViewerSizeUpdate: (viewerRect: DOMRect) => {
    dataStream.stateStream.viewerSize.emit(viewerRect);
  },
});

export const Viewer3D = connectDataStream({ getEmitters })(Viewer3DComponent as React.ComponentType);
