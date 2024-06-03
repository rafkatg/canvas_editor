import { EditorState, convertToRaw, convertFromRaw } from "draft-js";

export const saveEditorStateToJson = (editorState: EditorState) => {
  const contentState = editorState.getCurrentContent();
  return JSON.stringify(convertToRaw(contentState));
};

export const loadEditorStateFromJson = (json: string): EditorState => {
  const contentState = convertFromRaw(JSON.parse(json));
  return EditorState.createWithContent(contentState);
};
