import "@mantine/core/styles.css";
import { Center, Divider, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import RichTextEditor from './components/richtexteditor/RichTextEditor';
import RoadMap from "./components/RoadMap";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Center style={{ flexDirection: 'column' }}>
        <RichTextEditor />
      </Center>
      <Divider style={{ marginTop: "50px" }}/>
      <RoadMap />
    </MantineProvider>
  );
}
