import { useRef } from "react";

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { LexicalEditor } from "lexical";
import { LinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { Card, Group } from "@mantine/core";
import { IconArrowBigUp } from "@tabler/icons-react";

import ToolbarPlugin from "./ToolbarPlugin";
import './styles.css';

const editorTheme = {
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
    theme: editorTheme,
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
          <Card shadow="md">
        <ToolbarPlugin />
        <div style={{ padding: "5px" }}>
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable-root" style={{ backgroundColor: '#f8f8f8' }} />}
            placeholder={<Group gap={1} mt={2} ><span>Enter some text</span><IconArrowBigUp /></Group>}
            ErrorBoundary={LexicalErrorBoundary} />
        </div>
            </Card>
      </LexicalComposer>
    </div>
  );
}