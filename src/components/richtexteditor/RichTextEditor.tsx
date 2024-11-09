import { useRef } from "react";

import { InitialConfigType, InitialEditorStateType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { LexicalEditor } from "lexical";
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import ToolbarPlugin from "./ToolbarPlugin";
import './styles.css';

const theme = {
  paragraph: 'editor-text-paragraph',
  // paragraph: `${{ margin: 0 }}`,
  quote: 'editor-blockquote',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
  },
  list: {
    listitemUnchecked: 'editor-list-item-unchecked',
    listitemChecked: 'editor-list-item-checked',
  }
}

export default function Editor() {
  const editorRef = useRef<LexicalEditor | null>(null);

  const initialConfig: InitialConfigType = {
    namespace: "EditorWidgetSettings",
    theme,
    onError: console.error,
    nodes: [
      HeadingNode,
      QuoteNode,
      LinkNode,
      ListNode,
      ListItemNode
    ],
    // editorState: initialEditorState,
  };

  return (
    // <div style={{ width: "90%", marginTop: "10%" }}>
    <div style={{ padding: "0 20px", marginTop: "10%" }}>
      <LexicalComposer initialConfig={initialConfig}>
        <EditorRefPlugin editorRef={editorRef} />
        <ToolbarPlugin />
        <div style={{padding: "5px"}}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable-root" style={{ backgroundColor: '#f8f8f8'}} />}
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary} />
        </div>
      </LexicalComposer>
    </div>
  );
}