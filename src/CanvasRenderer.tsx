import React, { useEffect, useRef } from "react";
import { EditorState, convertToRaw } from "draft-js";

interface CanvasRendererProps {
  editorState: EditorState;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ editorState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "16px Arial";

    let yOffset = 20;

    rawContent.blocks.forEach((block) => {
      const text = block.text;
      context.fillText(text, 10, yOffset);
      yOffset += 20;

      block.entityRanges.forEach((range) => {
        const entityKey = range.key;
        const entity = rawContent.entityMap[entityKey];
        if (entity.type === "IMAGE") {
          const img = new Image();
          img.src = entity.data.src;
          img.onload = () => {
            context.drawImage(img, 10, yOffset, img.width / 2, img.height / 2); // Adjust size as needed
          };
          yOffset += img.height / 2 + 20; // Adjust yOffset based on image height
        }
      });
    });
  }, [editorState]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default CanvasRenderer;
