import { useState } from "react";

import { Button, Group, Menu, useMantineTheme } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { IconTriangleFilled, IconTriangleInvertedFilled } from "@tabler/icons-react";

interface MenuDropdownProps {
  menuItems: Record<string, any>[];
  onClick: (type: string) => void;
  selectedItem: string | undefined;
}

export default function MenuDropdown(props: MenuDropdownProps) {
  const theme = useMantineTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useClickOutside(() => setIsOpen(false));

  const handleClickMenuItem = (type: string) => {
    props.onClick(type);
    setIsOpen(false);
  };

  return (
    <Menu opened={isOpen}>
      <Menu.Target>
        <Button
          color={theme.black}
          onClick={() => setIsOpen(!isOpen)}
          rightSection={isOpen ? <IconTriangleFilled size={8} /> : <IconTriangleInvertedFilled size={8} />}
          size='xs'
          variant='transparent'>
        {props.selectedItem === ""
          ? props.menuItems[0].domElement
          : props.menuItems[props.menuItems.findIndex(item => item.type === props.selectedItem)]?.domElement}
        </Button>
      </Menu.Target>
      {isOpen &&
        <Menu.Dropdown ref={menuRef} style={{ background: theme.colors.myGreen[1] }}>
          {props.menuItems.map(item => {
            return (
              <Menu.Item key={item.type} onClick={() => handleClickMenuItem(item.type)}>
                <Group>
                  <>{item.domElement}</>
                  <span>{item.label}</span>
                </Group>
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>}
    </Menu>
  )
}