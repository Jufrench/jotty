import { useState } from 'react';

import { Button, Input, Menu, TextInput } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface FontSizeMenuProps {
  fontSize: string | null;
  fontSizeOptions?: string[];
  style?: React.CSSProperties | {} | undefined;
  onInputChange: (fontSize: string, hasCustomValue?: boolean) => void;
  onClose?: (reason: string) => void;
}

const fontSizeOptions: Array<string> = [
  "8", "9", "10", "11", "12",
  "14", "15", "18", "24", "30",
  "36", "48", "60", "72", "96",
];

export default function FontSizeMenu(props: FontSizeMenuProps) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Menu opened={opened} onChange={setOpened} trapFocus={false}>
      <Menu.Target>
        {/* <FontInput /> */}
        {/* <Button>Button</Button> */}
        <TextInput
          onChange={(newValue: any) => {
            props.onInputChange(newValue.currentTarget.value);
            setValue(newValue);
          }}
          onClick={() => {
            // setOpened(true);
            // console.log('inputRef:', inputRef)
            // if (inputRef.current) {
            //   inputRef.current.focus();
            // }
          }}
          size='xs'
          styles={{ input: { width: '50px' } }}
          // value={value}
          />
      </Menu.Target>
      <Menu.Dropdown>
        {fontSizeOptions.map(item => {
          return (
            <Menu.Item
              key={item}
              onClick={() => {
                setValue(item);
              }}>
                {item}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  )

  // return (
  //   <TextInput
  //     placeholder="Focus me!"
  //     inputContainer={(children) => (
  //      <Menu>
  //         <Menu.Item>Hello</Menu.Item>
  //      </Menu>
  //     )}/>
  // );

  // return (
  //   <Menu withArrow>
  //     <Menu.Target>
  //       {/* <InputButton /> */}
  //       <Input />
  //     </Menu.Target>
  //   </Menu>
  // )
  
  // return (
  //   <Input
  //     component="select"
  //     rightSection={<IconChevronDown size={14} stroke={1.5} />}
  //     pointer
  //     mt="md"
  //   >
  //     <option value="1">1</option>
  //     <option value="2">2</option>
  //   </Input>
  // );
}