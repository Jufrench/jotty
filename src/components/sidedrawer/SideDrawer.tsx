import { Drawer } from "@mantine/core";

import RoadMap from "../RoadMap";

export default function SideDrawer(props: { closeDrawer: () => void, isOpen: boolean }) {

  return (
    <Drawer opened={props.isOpen} onClose={props.closeDrawer}>
      <RoadMap />
    </Drawer>
  )
}