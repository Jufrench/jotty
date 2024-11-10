import { ColorPicker, Popover } from '@mantine/core';

export default function PopoverColorPicker(props: { opened: boolean }) {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md" opened={props.opened}>
      {/* <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target> */}
      <Popover.Dropdown>
        {/* <Stack style={{ justifyContent: 'center' }}> */}
          {/* <Button>X</Button> */}
          <ColorPicker />
        {/* </Stack> */}
      </Popover.Dropdown>
    </Popover>
  );
}