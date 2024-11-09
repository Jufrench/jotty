import { useCallback, useEffect, useState } from 'react';

import { ActionIcon, Button, Center, Divider, Group, Menu } from '@mantine/core';
import { IconBold, IconAdjustments, IconArrowBackUp, IconArrowForwardUp, IconTriangleInvertedFilled, IconH1, IconH2, IconH3,
  IconH4, IconH5, IconH6, IconParkingCircle } from '@tabler/icons-react';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, $isTextNode, $setSelection, $createTextNode,
  CAN_REDO_COMMAND, CAN_UNDO_COMMAND, CommandListenerPriority, ElementFormatType, LexicalNode,
  FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { mergeRegister, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType } from "@lexical/utils";
import { $createHeadingNode, $isHeadingNode, HeadingNode, HeadingTagType, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $isListItemNode, ListType, ListNode, INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import FontSizeMenu from './FontSizeMenu';

const LowPriority: CommandListenerPriority = 1;

const textElementOptions = [
  { label: "Paragraph", tag: "p", domElement: <IconParkingCircle /> },
  { label: "Heading 1", tag: "h1", domElement: <IconH1 /> },
  { label: "Heading 2", tag: "h2", domElement: <IconH2 /> },
  { label: "Heading 3", tag: "h3", domElement: <IconH3 /> },
  { label: "Heading 4", tag: "h4", domElement: <IconH4 /> },
  { label: "Heading 5", tag: "h5", domElement: <IconH5 /> },
  { label: "Heading 6", tag: "h6", domElement: <IconH6 /> },
];

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  // ACTIVE STATES FOR BUTTONS
  // =========================
  const [textType, setTextType] = useState<string | undefined>("p");
  const [isBoldActive, setIsBoldActive] = useState<boolean>(false);
  const [isItalicActive, setIsItalicActive] = useState<boolean>(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState<boolean>(false);
  const [isStrikethroughActive, setIsStrikethroughActive] = useState<boolean>(false);
  const [textAlign, setTextAlign] = useState<string>("left");
  const [listType, setListType] = useState<string>("bullet");


  // HANDLE FORMATTING OF TEXT
  // =========================
  const handleFormatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }

  const formatTextElementType = (tag: string | HeadingTagType) => {
    console.log('%cidentifier:', 'color:tomato', tag);
    switch(tag) {
      case "p":
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createParagraphNode());
          editor.getRootElement()?.focus();
        });
        return;
      default:
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(tag as HeadingTagType));
          }
          editor.getRootElement()?.focus();
        });
        return;
    }
  };

  // UPDATE TOOLBAR ACTIVE STATES
  // =========================
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if (selection && $isRangeSelection(selection)) {
      const parent = selection.anchor.getNode().getParent();

      setIsBoldActive(selection.hasFormat("bold"));
      setIsItalicActive(selection.hasFormat("italic"));
      setIsUnderlineActive(selection.hasFormat("underline"));
      setIsStrikethroughActive(selection.hasFormat("strikethrough"));
      // setFontSize($getSelectionStyleValueForProperty(selection, "font-size", `${theme.typography.body1.fontSize}`).replace("px", ""));
      // setTextColor($getSelectionStyleValueForProperty(selection, "color", textColor));
      // setTextHighlightColor($getSelectionStyleValueForProperty(selection, "background-color", textHighlightColor));
      console.log('textType:', textType)

      // Checking if parent of selected node exists to handle update button icon displayed
      // This is relevant to block level elements & their display/styling
      if (parent) {
        setTextAlign(parent.getFormatType());

        // If selection is a list item (selection can never be just a list (<ul>/<ol>), rather a list item (<li>))
        // If selection is NOT a list item, show bullet list (ul) as default display option
        if ($isListItemNode(parent)) {
          const ancestorListNode = $getNearestNodeOfType(parent, ListNode);
          if (ancestorListNode) {
            setListType(ancestorListNode.getListType());
          }
        } else {
          setListType("bullet");
        }

        const allNodes = selection.getNodes();
        let firstBlockNode:LexicalNode = $getNearestBlockElementAncestorOrThrow(allNodes[0]);
        /* 
        This algorithm checks if the first node element type in selection list matches the
        other node element types in the selection list. If it does, the text menu item will show
        the single matching element. If not, the text menu will show nothing.
        */
        for (let i = 1; i < allNodes.length; i++) {
          const currentNode = allNodes[i];
          if (currentNode.getType() !== "text") {
            if (currentNode.getType() !== firstBlockNode.getType() ||
            // The other side of the || operator compares heading tag types.
            // In Lexical, only heading nodes have a "__tag" property on them, which is probably an oversight
            (currentNode as HeadingNode).__tag !== (currentNode as HeadingNode).__tag) {
              setTextType(undefined);
              return;
            }
          }
        }
        if ($isHeadingNode(firstBlockNode)) {
          setTextType(firstBlockNode.__tag);
          return;
        }
        if ($isParagraphNode(firstBlockNode)) {
          setTextType("p");
          return;
        }
        setTextType(firstBlockNode.getType());
      }
    }

  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        })
      }),
      editor.registerCommand(CAN_UNDO_COMMAND, payload => false, LowPriority),
      editor.registerCommand(CAN_REDO_COMMAND, payload => false, LowPriority),
    );
  }, [editor, updateToolbar])

  return (
    <div style={{ border: '2px solid gray', padding: 3 }}>
      {/* <Button.Group>
        <ActionIcon variant="default"><IconArrowBackUp /></ActionIcon>
        <ActionIcon variant="default"><IconArrowForwardUp /></ActionIcon>
      </Button.Group> */}
      <Group gap={1}>
        <ActionIcon variant="default"><IconArrowBackUp /></ActionIcon>
        <ActionIcon variant="default"><IconArrowForwardUp /></ActionIcon>
        <Divider orientation="vertical" />
        {/* <Button variant="default" rightSection={<IconTriangleInvertedFilled size={10} />}>Text</Button> */}
        <Menu withArrow>
          <Menu.Target>
            <Button>
            {textType === ""
              ? textElementOptions[0].domElement
              : textElementOptions[textElementOptions.findIndex(item => item.tag === textType)]?.domElement}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {textElementOptions.map(item => {
              return (
                <Menu.Item key={item.label} onClick={() => formatTextElementType(item.tag)}>
                  <Group>
                    <>{item.domElement}</>
                    <span>{item.label}</span>
                  </Group>
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
        <FontSizeMenu fontSize={"12"} onInputChange={(value) => console.log('value:', value)} />
        <ActionIcon style={{ }} onClick={handleFormatBold} variant="default"><IconBold /></ActionIcon>
        {/* <Menu>
          <Menu.Item>item 1</Menu.Item>
        </Menu> */}
      </Group>
    </div>
  )
}
