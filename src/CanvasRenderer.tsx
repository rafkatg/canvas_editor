import React, { useEffect, useRef } from "react";
import { EditorState, convertToRaw } from "draft-js";

interface CanvasRendererProps {
  editorState: EditorState;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ editorState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const buttonContainer = buttonContainerRef.current;
    if (!canvas || !buttonContainer) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "16px Arial";
    buttonContainer.innerHTML = "";

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
        } else if (entity.type === "BUTTON") {
          const button = document.createElement("button");
          button.textContent = entity.data.label;
          button.style.position = "absolute";
          button.style.left = "10px";
          button.style.top = `${yOffset}px`;
          button.onclick = () => alert("Button clicked!");
          buttonContainer.appendChild(button);
          yOffset += 50; // Adjust yOffset based on button height
        }
      });
    });
  }, [editorState]);

  return (
    <div style={{ position: "relative" }}>
      <canvas ref={canvasRef} width={800} height={600} style={{ zIndex: 1 }} />
      <div
        ref={buttonContainerRef}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
      />
    </div>
  );
};

export default CanvasRenderer;
