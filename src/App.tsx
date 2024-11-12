import "@mantine/core/styles.css";
import { ActionIcon, Card, Container, Group, MantineProvider } from "@mantine/core";
import { theme } from "./theme";

import RichTextEditor from './components/richtexteditor/RichTextEditor';
import SideDrawer from "./components/sidedrawer/SideDrawer";
import { IconBrandGithub, IconMenu2 } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [isOpen, { open, close }] = useDisclosure(false);
  const handleCloseDrawer = () => close();

  return (
    <MantineProvider theme={theme}>
      <Container>
        <Card>  
          <Group justify="space-between" style={{ backgroundColor: "#f8f8f8", padding: "10px 20px" }}>
            <ActionIcon
              onClick={open}
              style={{ background: theme.colors?.myGreen?.[7] }}
              variant="filled">
              <IconMenu2 />
            </ActionIcon>
            <Group>
              <ActionIcon
                component="a"
                href="https://github.com/jufrench"
                style={{ color: theme.colors?.myGreen?.[7] }}
                target="_blank"
                variant="transparent">
                <IconBrandGithub />
              </ActionIcon>
            </Group>
          </Group>
        </Card>
      </Container>
      <Container>
        <SideDrawer closeDrawer={handleCloseDrawer} isOpen={isOpen} />
        <RichTextEditor />
      </Container>
    </MantineProvider>
  );
}
