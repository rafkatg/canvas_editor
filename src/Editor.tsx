import React, { useState, KeyboardEvent } from "react";
import { Editor, EditorState, RichUtils, AtomicBlockUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { saveEditorStateToJson, loadEditorStateFromJson } from "./utils";

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

  const addElement = (type: string, data: any) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      type,
      "IMMUTABLE",
      data,
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
      addElement("IMAGE", { src: url });
    }
  };

  const addButton = () => {
    addElement("BUTTON", { label: "Click Me" });
  };

  const saveToFile = () => {
    const json = saveEditorStateToJson(editorState);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editorState.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const json = event.target?.result as string;
        setEditorState(loadEditorStateFromJson(json));
      };
      reader.readAsText(file);
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
      <button onClick={addButton}>Add Button</button>
      <button onClick={saveToFile}>Save</button>
      <input type="file" accept="application/json" onChange={loadFromFile} />
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
