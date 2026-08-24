import { Box, Button, Heading, Text } from "@razorpay/blade/components";
import { BladeRoot } from "./BladeRoot";

export default function BladeSmoke() {
  return (
    <BladeRoot>
      <Box padding="spacing.7">
        <Heading size="large">Blade smoke</Heading>
        <Text>It renders.</Text>
        <Button>Buy Now</Button>
      </Box>
    </BladeRoot>
  );
}
