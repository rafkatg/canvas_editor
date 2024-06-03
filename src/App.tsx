import React, { useState } from "react";
import TextEditor from "./Editor";
import CanvasRenderer from "./CanvasRenderer";
import { EditorState } from "draft-js";

const App: React.FC = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  return (
    <div>
      <h1>WYSIWYG Editor with Canvas Renderer</h1>
      <TextEditor editorState={editorState} setEditorState={setEditorState} />
      <CanvasRenderer editorState={editorState} />
    </div>
  );
};

export default App;
