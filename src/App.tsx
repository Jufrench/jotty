import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import RichTextEditor from './components/richtexteditor/RichTextEditor';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <div style={{ padding: '100px' }}>
        <RichTextEditor />
      </div>
    </MantineProvider>
  );
}
