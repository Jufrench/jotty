import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import { ActionIcon, Button, Divider, Group, Menu, Popover, Stack, TextInput, useMantineTheme } from '@mantine/core';
import { IconArrowBackUp, IconArrowForwardUp, IconBold, IconItalic, IconH1, IconH2, IconH3,
  IconH4, IconH5, IconH6, IconParkingCircle, IconStrikethrough,
  IconTriangleInvertedFilled, IconTriangleFilled, IconUnderline, IconHighlight, IconLink,
  IconAlignLeft, IconAlignCenter, IconAlignRight, IconAlignJustified, /* IconList, IconListNumbers, */
  IconClearFormatting, IconCheck, IconX, IconLetterCaseUpper, IconLetterCaseLower,
  IconLetterCase } from '@tabler/icons-react';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getSelection, $isParagraphNode, $isRangeSelection, $isTextNode, $createTextNode, /* $setSelection, */
  CAN_REDO_COMMAND, CAN_UNDO_COMMAND, CommandListenerPriority, ElementFormatType, LexicalNode,
  FORMAT_ELEMENT_COMMAND, FORMAT_TEXT_COMMAND, /* INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND, UNDO_COMMAND */ } from "lexical";
import { mergeRegister, $getNearestBlockElementAncestorOrThrow, $getNearestNodeOfType } from "@lexical/utils";
import { $createHeadingNode, $isHeadingNode, HeadingNode, HeadingTagType, /* $createQuoteNode */ } from "@lexical/rich-text";
import { $setBlocksType, $getSelectionStyleValueForProperty, $patchStyleText } from "@lexical/selection";
import { $isListItemNode, /* ListType, */ ListNode, /* INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND */ } from "@lexical/list";
import { $createLinkNode } from '@lexical/link';

// import FontSizeMenu from './FontSizeMenu';
import PopoverColorPicker from './PopoverColorPicker';
// import { useClickOutside } from '@mantine/hooks';
import MenuDropdown from './MenuDropdown';

const LowPriority: CommandListenerPriority = 1;

const textElementOptions = [
  { label: "Paragraph", type: "p", domElement: <IconParkingCircle /> },
  { label: "Heading 1", type: "h1", domElement: <IconH1 /> },
  { label: "Heading 2", type: "h2", domElement: <IconH2 /> },
  { label: "Heading 3", type: "h3", domElement: <IconH3 /> },
  { label: "Heading 4", type: "h4", domElement: <IconH4 /> },
  { label: "Heading 5", type: "h5", domElement: <IconH5 /> },
  { label: "Heading 6", type: "h6", domElement: <IconH6 /> },
];

const textAlignOptions = [
  { label: "left", type: "left", domElement: <IconAlignLeft /> },
  { label: "center", type: "center", domElement: <IconAlignCenter /> },
  { label: "right", type: "right", domElement: <IconAlignRight /> },
  { label: "justify", type: "justify", domElement: <IconAlignJustified /> },
];

const textCaseOptions = [
  { label: "uppercase", type: "uppercase", domElement: <IconLetterCaseUpper /> },
  { label: "lowercase", type: "lowercase", domElement: <IconLetterCaseLower /> },
  { label: "capitalize", type: "capitalize", domElement: <IconLetterCase /> },
];

// const listTypeOptions = [
//   { type: "bullet", domElement: <IconList /> },
//   { type: "number", domElement: <IconListNumbers /> },
// ];

export default function ToolbarPlugin() {
  const theme = useMantineTheme();
  const [editor] = useLexicalComposerContext();
  
  // BUTTONS ACTIVE/INACTIVE STATES
  // =========================
  const [textType, setTextType] = useState<string | undefined>("p");
  const [isBoldActive, setIsBoldActive] = useState<boolean>(false);
  const [isItalicActive, setIsItalicActive] = useState<boolean>(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState<boolean>(false);
  const [isStrikethroughActive, setIsStrikethroughActive] = useState<boolean>(false);
  const [urlLinkInput, setUrlLinkInput] = useState("");
  const [/* urlLink */, setUrlLink] = useState("");
  const [textColor, setTextColor] = useState<string>("");
  const [isTextColorPickerOpen, setIsTextColorPickerOpen] = useState<boolean>(false);
  // const [opened, { close, open }] = useDisclosure(false);
  const [textAlign, setTextAlign] = useState<string>("left");
  const [textCase, setTextCase] = useState<string>("uppercase");
  const [/* listType */, setListType] = useState<string>("bullet");

  // MENU OPEN/CLOSE STATES
  const [isTextElOpen, setIsTextElOpen] = useState<boolean>(false);
  const [isTextAlignOpen, setIsTextAlignOpen] = useState<boolean>(false);

  const toggleTextColor = () => {
    setIsTextColorPickerOpen(!isTextColorPickerOpen);
  };

  // CLICKAWAYS FOR MENUS
  // const textElRef = useClickOutside(() => setIsTextElOpen(false));
  // let textElRef = null;
  // let alignRef = null;
  // const basicMenuRef = 

  // Considering dynamically creating menu refs
  // const menuRefs = [textElRef, alignRef];

  // const handleClickOutside = (refEl: any) => {
  //   refEl = useClickOutside(() => setIsTextElOpen(false));
  // }


  // HANDLE FORMATTING OF TEXT
  // =========================
  const handleFormatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  const handleFormatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  const handleFormatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  const handleFormatStrikethrough = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");

  const handleAddLink = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const selectionAnchorKey = selection.anchor.getNode().__key;
        const selectionDOMElement = editor.getElementByKey(selectionAnchorKey);
        // selection is always a span, so we check to see if the parent is an anchor element
        const currentLink = selectionDOMElement?.parentElement?.getAttribute("href")?.split("https://")[1] ?? "";
        setUrlLink(currentLink);
      }
    });
  };

  const handleSaveInsertLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection) && urlLinkInput.length > 0) {          
        console.log('%chandleSaveInsertLink - selection', 'color:tomato', selection)
        const linkText = selection?.getTextContent().length > 0 ?
          selection?.getTextContent() : `https://${urlLinkInput}`;
        const linkNode = $createLinkNode(`https://${urlLinkInput}`,
          {rel: "noopener noreferrer", target: "_blank", title: ""}
        ).append($createTextNode(linkText));

        selection.insertNodes([linkNode]);
        console.log('yo!', linkNode)
      }
    });
  };

  const handleTextColorChange = (color: any) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $patchStyleText(selection, {"color": color as string});
    });
    setTextColor(color as string);
  };

  const formatTextElementType = (tag: string | HeadingTagType) => {
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

  const formatTextAlign = (identifier: string | ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, identifier as ElementFormatType);
  };

  const formatTextCase = (caseType: string) => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        // Considered going this route, but more code than necessary
        // selectedNodes.forEach(node => {
        //   if ($isTextNode(node)) {
        //     console.log('node:', node)
        //     node.setTextContent('hey');
        //   }
        // });

        if (caseType === 'uppercase') {
          selection.insertText(selection.getTextContent().toUpperCase());
        }
        if (caseType === 'lowercase') {
          selection.insertText(selection.getTextContent().toLowerCase());
        }
        if (caseType === 'capitalize') {
          let textContent = selection.getTextContent();
          const capitalizedText = textContent.charAt(0).toUpperCase() + textContent.slice(1).toLowerCase();
          selection.insertText(capitalizedText);
        }

        setTextCase(caseType);
      }
    });
  };

  const handleClearFormat = () => {
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();

        // if nothing is selected/highlighted do nothing
        if (selection.isCollapsed()) {
          return;
        }

        nodes.forEach(node => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            if (!$isHeadingNode(node.getParent())) {
              node.getParent()?.replace($createParagraphNode(), true);
            }
          }
        });
      }
    });
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
      setTextColor($getSelectionStyleValueForProperty(selection, "color", textColor));
      // setFontSize($getSelectionStyleValueForProperty(selection, "font-size", `${theme.typography.body1.fontSize}`).replace("px", ""));
      // setTextHighlightColor($getSelectionStyleValueForProperty(selection, "background-color", textHighlightColor));

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
      editor.registerCommand(CAN_UNDO_COMMAND, (/* payload */) => false, LowPriority),
      editor.registerCommand(CAN_REDO_COMMAND, (/* payload */) => false, LowPriority),
    );
  }, [editor, updateToolbar])

  const activeButtonStyle = {
    background: theme.colors.myGreen[7],
    color: theme.white,
  };

  return (
    <div style={{ border: `2px solid ${theme.colors.myGreen[7]}`, padding: 3, background: theme.colors.myGreen[0] }}>
      <Group gap={2}>
        <ActionIcon color={theme.black} variant='transparent'><IconArrowBackUp /></ActionIcon>
        <ActionIcon color={theme.black} variant='transparent'><IconArrowForwardUp /></ActionIcon>
        <Divider orientation='vertical' color='#99a0ca' />

        {/* TEXT ELEMENT MENU SELECTION */}
        <MenuDropdown
          menuItems={textElementOptions}
          onClick={newValue => formatTextElementType(newValue)}
          selectedItem={textType} />
        {/* <Menu opened={isTextElOpen}>
          <Menu.Target>
            <Button
              color={theme.black}
              onClick={() => setIsTextElOpen(!isTextElOpen)}
              rightSection={isTextElOpen ? <IconTriangleFilled size={8} /> : <IconTriangleInvertedFilled size={8} />}
              size='xs'
              variant='transparent'>
            {textType === ""
              ? textElementOptions[0].domElement
              : textElementOptions[textElementOptions.findIndex(item => item.type === textType)]?.domElement}
            </Button>
          </Menu.Target>
          {isTextElOpen &&
            <Menu.Dropdown style={{ background: theme.colors.myGreen[1] }}>
              {textElementOptions.map(item => {
                return (
                  <Menu.Item key={item.label} onClick={() => formatTextElementType(item.type)}>
                    <Group>
                      <>{item.domElement}</>
                      <span>{item.label}</span>
                    </Group>
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>}
        </Menu> */}

        {/* Font Size Menu Selection */}
        {/* <FontSizeMenu fontSize={"12"} onInputChange={(value) => console.log('value:', value)} /> */}
        <Divider orientation='vertical' color='#99a0ca' ml={4} />
        <ActionIcon color={theme.black} style={isBoldActive ? activeButtonStyle : {}} onClick={handleFormatBold} variant='transparent'><IconBold /></ActionIcon>
        <ActionIcon color={theme.black} style={isItalicActive ? activeButtonStyle : {}} onClick={handleFormatItalic} variant='transparent'><IconItalic /></ActionIcon>
        <ActionIcon color={theme.black} style={isUnderlineActive ? activeButtonStyle : {}} onClick={handleFormatUnderline} variant='transparent'><IconUnderline /></ActionIcon>
        <ActionIcon color={theme.black} style={isStrikethroughActive ? activeButtonStyle : {}} onClick={handleFormatStrikethrough} variant='transparent'><IconStrikethrough /></ActionIcon>

        {/* Text Color */}
        <PopoverColorPicker
          color={textColor}
          onChange={handleTextColorChange}
          onClick={toggleTextColor}
          opened={isTextColorPickerOpen} />
        <ActionIcon
          color={theme.black}
          onClick={() => {
            handleTextColorChange(textColor);
            // setIsColorPickerOpen(!isColorPickerOpen);
          }}
          variant='transparent'>
            <IconHighlight />
        </ActionIcon>
        {/* <PopoverColorPicker opened={isColorPickerOpen} /> */}
        <Divider orientation='vertical' color='#99a0ca' />

        {/* TEXT ALIGN MENU SELECTION */}
        <MenuDropdown
          menuItems={textAlignOptions}
          onClick={newValue => formatTextAlign(newValue)}
          selectedItem={textAlign} />

        {/* <Menu opened={isTextAlignOpen}>
          <Menu.Target>
              <Button
                color={theme.black}
                onClick={() => setIsTextAlignOpen(!isTextAlignOpen)}
                rightSection={isTextAlignOpen ? <IconTriangleFilled size={8} /> : <IconTriangleInvertedFilled size={8} />}
                size='xs'
                variant='transparent'
              >
              {textAlign === ""
                ? textAlignOptions[0].domElement
                : textAlignOptions[textAlignOptions.findIndex(item => item.type === textAlign)]?.domElement}
              </Button>
            </Menu.Target>
          <Menu.Dropdown style={{ background: theme.colors.myGreen[1] }}>
            {textAlignOptions.map(item => {
              return (
                <Menu.Item key={item.type} onClick={() => formatTextAlign(item.type)}>
                  <Group>
                    {item.domElement}
                    <span>{item.label}</span>
                  </Group>
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu> */}

        {/* TEXT CASE MENU SELECTION */}
        <MenuDropdown
          menuItems={textCaseOptions}
          onClick={newValue => formatTextCase(newValue)}
          selectedItem={textCase} />
        {/* <Menu>
          <Menu.Target>
            <Button
              color={theme.black}
              rightSection={isTextElOpen ? <IconTriangleFilled size={8} /> : <IconTriangleInvertedFilled size={8} />}
              size='xs'
              variant='transparent'>
              {textCase === ""
                ? textCaseOptions[0].domElement
                : textCaseOptions[textCaseOptions.findIndex(item => item.type === textCase)]?.domElement}
            </Button>
          </Menu.Target>
          <Menu.Dropdown style={{ background: theme.colors.myGreen[1] }}>
            {textCaseOptions.map(item => {
                return (
                  <Menu.Item key={item.type} onClick={() => formatTextCase(item.type)}>
                    <Group>
                      {item.domElement}
                      <span>{item.label}</span>
                    </Group>
                  </Menu.Item>
                );
              })}
          </Menu.Dropdown>
        </Menu> */}

        {/* Add Link */}
        <Popover>
          <Popover.Target>
            <ActionIcon
              color={theme.black}
              onClick={handleAddLink}
              variant='transparent'>
              <IconLink />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap={8}>
              {/* <TextInput placeholder='Text' /> */}
              <TextInput
                onChange={(event: ChangeEvent<HTMLInputElement>) => setUrlLinkInput(event?.target.value)}
                placeholder='URL'
                // value={link === '' ? '' : link}
                value={undefined}
                />
              <Group justify='space-between'>
                <ActionIcon color="indianred" style={{ flexGrow: 1 }} variant='outline'><IconX /></ActionIcon>
                <ActionIcon
                  color={theme.colors.myGreen[6]}
                  onClick={handleSaveInsertLink}
                  style={{ flexGrow: 2 }}>
                    <IconCheck />
                </ActionIcon>
              </Group>
            </Stack>
          </Popover.Dropdown>
        </Popover>
        
        <Divider orientation='vertical' color='#99a0ca' />
        <ActionIcon color={theme.black} style={{ }} onClick={handleClearFormat} variant='transparent'><IconClearFormatting /></ActionIcon>
      </Group>
    </div>
  )
}
