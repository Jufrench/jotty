import { Accordion, List, Title } from "@mantine/core";

export default function RoadMap() {
  const roadMapList = [
    'Persist data',
    'Show saved history with date & time',
    'Add google fonts',
    'Add clickaway feature for menu items',
    'Toggle UI themes'
  ];

  return (
    // <div style={{ padding: "20px 20px 0 20px" }}>
    //   <Title order={4}>Road Map</Title>
    // </div>
    <Accordion style={{ padding: "20px 20px 0 20px" }}>
      <Accordion.Item value="Road Map">
        <Accordion.Control>Road Map</Accordion.Control>
        <Accordion.Panel>
          <List>
          {roadMapList.map(item => {
            return (
              <List.Item>{item}</List.Item>
            )
          })}
          </List>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}