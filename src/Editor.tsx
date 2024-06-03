import React, { useState, KeyboardEvent } from "react";
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from "draft-js";
import "draft-js/dist/Draft.css";

interface TextEditorProps {
  editorState: EditorState;
  setEditorState: (state: EditorState) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  editorState,
  setEditorState,
}) => {
  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const addImage = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src: url },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
    );
  };

  const onURLChange = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      const url = target.value;
      target.value = "";
      addImage(url);
    }
  };

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "5px",
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Enter image URL and press Enter"
        onKeyPress={onURLChange}
      />
      <Editor
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={setEditorState}
        placeholder="Enter some text..."
      />
    </div>
  );
};

export default TextEditor;
