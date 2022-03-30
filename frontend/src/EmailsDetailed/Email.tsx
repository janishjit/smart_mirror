import { Badge, Card, Group, Text } from "@mantine/core";
import { GoogleMessage } from "../types";
import he from "he";
type EmailProps = {
  email: GoogleMessage;
};

const findHeader = (headers: any[], name: string) => {
  return headers.find((header: any) => header.name === name);
}

const Email = ({ email }: EmailProps) => {

  return (
    <Card shadow="sm" p={ "lg" } m="xs">
      <Group position="apart">
        { <Text weight={ 500 } size="lg">{ findHeader(email.result.payload.headers, "Subject")?.value }</Text> }
        { <Text weight={ 500 } size="md">{ findHeader(email.result.payload.headers, "From")?.value }</Text> }
        <Text weight={ 300 } size="xs">{ he.decode(email.result.snippet) }</Text>
      </Group>
    </Card>
  );
}

export default Email;