import { ColorPicker, Popover, Text, Button } from '@mantine/core';

export default function PopoverColorPicker(props: { opened: boolean }) {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md" opened={props.opened}>
      {/* <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target> */}
      <Popover.Dropdown>
        <Text size="xs">This is uncontrolled popover, it is opened when button is clicked</Text>
        <ColorPicker />
      </Popover.Dropdown>
    </Popover>
  );
}