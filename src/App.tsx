import "@mantine/core/styles.css";
import { ActionIcon, Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";

import RichTextEditor from './components/richtexteditor/RichTextEditor';
import SideDrawer from "./components/sidedrawer/SideDrawer";
import { IconMenu2 } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [isOpen, { open, close }] = useDisclosure(false);
  const handleCloseDrawer = () => close();

  return (
    <MantineProvider theme={theme}>
      <Container>
        <ActionIcon
          onClick={open}
          size='lg'
          style={{
            position: 'fixed', left: '6px', top: '6px',
            background: theme.colors?.myGreen?.[7]
          }}
          variant="filled">
          <IconMenu2 />
        </ActionIcon>
        <SideDrawer closeDrawer={handleCloseDrawer} isOpen={isOpen} />
        <RichTextEditor />
      </Container>
    </MantineProvider>
  );
}
