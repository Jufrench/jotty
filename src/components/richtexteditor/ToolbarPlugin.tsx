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

import FontSizeMenu from './FontSizeMenu';

const LowPriority: CommandListenerPriority = 1;

const textElementOptions = [
  { label: "Paragraph", identifier: "p", domElement: <IconParkingCircle /> },
  { label: "Heading 1", identifier: "h1", domElement: <IconH1 /> },
  { label: "Heading 2", identifier: "h2", domElement: <IconH2 /> },
  { label: "Heading 3", identifier: "h3", domElement: <IconH3 /> },
  { label: "Heading 4", identifier: "h4", domElement: <IconH4 /> },
  { label: "Heading 5", identifier: "h5", domElement: <IconH5 /> },
  { label: "Heading 6", identifier: "h6", domElement: <IconH6 /> },
];

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  
  // ACTIVE STATES FOR BUTTONS
  // =========================
  const [isBoldActive, setIsBoldActive] = useState<boolean>(false);


  // HANDLE FORMATTING OF TEXT
  // =========================
  const handleFormatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }

  // UPDATE TOOLBAR ACTIVE STATES
  // =========================
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if (selection && $isRangeSelection(selection)) {
      const parent = selection.anchor.getNode().getParent();

      setIsBoldActive(selection.hasFormat("bold"));
      console.log('update toolbar yo!')
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
    <div style={{ border: '2px solid gray' }}>
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
            <Button>Text Element</Button>
          </Menu.Target>
          <Menu.Dropdown>
            {textElementOptions.map(item => {
              return (
                <Menu.Item key={item.label}>
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
