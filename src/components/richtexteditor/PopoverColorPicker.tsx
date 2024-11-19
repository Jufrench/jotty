import { ActionIcon, ColorPicker, Popover, useMantineTheme } from '@mantine/core';
import { IconTextColor } from '@tabler/icons-react';

interface PopoverColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClick: () => void;
  opened: boolean;
}

export default function PopoverColorPicker(props: PopoverColorPickerProps) {
  const theme = useMantineTheme();

  // const [isOpen, setIsOpen] = useState(false);
  // const menuRef = useClickOutside(() => setIsOpen(false));

  // const handleClickMenuItem = (type: string) => {
  //   props.onClick(type);
  //   setIsOpen(false);
  // };

  return (
    <Popover
      opened={props.opened}
      position="bottom">
      <Popover.Target>
        <ActionIcon
            color={theme.black}
            onClick={props.onClick}
            variant='transparent'>
            <IconTextColor />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown style={{ background: 'none', padding: 0 }}>
        <ColorPicker />
      </Popover.Dropdown>
    </Popover>
  );
}