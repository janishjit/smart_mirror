import { Badge, Card, Group, Text } from "@mantine/core";
import { formatDateTime } from "../Schedule/Schedule";
import { GoogleEvent } from "../types";



type EventProps = {
  event: GoogleEvent;
};

const Event = ({ event }: EventProps) => {
  console.log(JSON.stringify(event));

  return (
    <Card shadow="sm" p={ "lg" } m="xs">
      <Group position="apart">
        <Text weight={ 500 }>{ event.event.summary }</Text>
        <Badge color={ (event.event.status === "confirmed") ? "green" : "pink" } variant="light">
          { event.event.status }
        </Badge>
      </Group>
      <Group position="apart">
        <Text weight={ 300 } size={ "sm" }>
          { formatDateTime(event.when) } - { formatDateTime(event.event.end.dateTime) }
        </Text>
      </Group>
      { event.event.location }
    </Card>
  );
}

export default Event;