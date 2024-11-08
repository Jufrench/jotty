import { useRef } from "react";

import { InitialConfigType, InitialEditorStateType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { LexicalEditor } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import ToolbarPlugin from "./ToolbarPlugin";

export default function Editor() {
  const editorRef = useRef<LexicalEditor | null>(null);

  function onError(error: any) {
    console.error(error);
  }

  const initialConfig: InitialConfigType = {
    namespace: "EditorWidgetSettings",
    // theme,
    onError: console.error,
    nodes: [
      HeadingNode,
      QuoteNode,
      // ListNode,
      // ListItemNode,
      // LinkNode,
    ],
    // editorState: initialEditorState,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorRefPlugin editorRef={editorRef} />
      <ToolbarPlugin />
      <div style={{ border: '1px solid dodgerblue' }}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary} />
      </div>
		</LexicalComposer>
  );
}