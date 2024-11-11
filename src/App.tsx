import "@mantine/core/styles.css";
import { Container, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import RichTextEditor from './components/richtexteditor/RichTextEditor';
import RoadMap from "./components/RoadMap";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container>
        <RoadMap />
        <RichTextEditor />
      </Container>
    </MantineProvider>
  );
}
