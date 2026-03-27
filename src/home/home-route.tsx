import { Button, Container, Text, Title } from '@mantine/core';
import { useState } from 'react';

export default function HomeRoute() {
  const [counter, setCounter] = useState(0);
  const updateCounter = () => setCounter((prev) => prev + 1);
  return (
    <Container ta="center" mt="6rem">
      <Title my="xs">El Gordo React™</Title>
      <Text my="md" c="dimmed">
        La mejor template del universo.
      </Text>
      <Button onClick={updateCounter}>Clicks: {counter}</Button>
    </Container>
  );
}
