import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Alert,
  Amount,
  Avatar,
  Badge,
  Box,
  Button,
  ChatInput,
  ChatMessage as BladeChatMessage,
  Chip,
  ChipGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  EmptyState,
  Heading,
  Indicator,
  ShoppingCartIcon,
  StarIcon,
  Text,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import avatarImg from "@/assets/ai-assistant-avatar.png";
import { type Product } from "@/lib/catalog";
import {
  bestForLabel,
  getAssistantReply,
  quickChips,
  samplePrompts,
  type ChatMessage,
} from "@/lib/ai-chat-script";

type Props = {
  isOpen: boolean;
  onDismiss: () => void;
  product?: Product | undefined;
};

function ChatProductCard({
  item,
  onOpen,
  onAdd,
}: {
  item: Product;
  onOpen: () => void;
  onAdd: () => void;
}) {
  return (
    <Box
      minWidth="164px"
      maxWidth="200px"
      flex="1"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
      backgroundColor="surface.background.gray.intense"
      padding="spacing.4"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
    >
      {item.badge ? (
        <Badge size="xsmall" color={item.badge === "New" ? "information" : "positive"}>
          {item.badge}
        </Badge>
      ) : null}
      <Box height="72px" display="flex" alignItems="center" justifyContent="center">
        <img
          src={item.img}
          alt={item.name}
          loading="lazy"
          style={{ maxHeight: "72px", maxWidth: "100%", objectFit: "contain" }}
        />
      </Box>
      <Text size="small" weight="semibold">
        {item.name}
      </Text>
      <Amount value={item.price} size="small" type="heading" suffix="none" />
      <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
        <StarIcon size="small" color="feedback.icon.notice.intense" />
        <Text size="xsmall" color="surface.text.gray.muted">
          {`${item.rating} (${item.reviews})`}
        </Text>
      </Box>
      <Indicator size="small" color={item.stock === "In stock" ? "positive" : "notice"}>
        {item.stock}
      </Indicator>
      <Box display="flex" flexDirection="row" gap="spacing.3">
        <Box flex="1">
          <Button variant="secondary" size="xsmall" isFullWidth onClick={onOpen}>
            View
          </Button>
        </Box>
        <Button variant="primary" size="xsmall" icon={ShoppingCartIcon} onClick={onAdd} />
      </Box>
    </Box>
  );
}

function CompareBlock({ items }: { items: Product[] }) {
  const best = [...items].sort((a, b) => b.rating - a.rating)[0];
  return (
    <Box
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
      backgroundColor="surface.background.gray.subtle"
      padding="spacing.4"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
    >
      <Text size="small" weight="semibold">
        Comparison
      </Text>
      {items.map((item) => (
        <Box key={item.slug} display="flex" flexDirection="column" gap="spacing.2">
          <Divider />
          <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.3">
            <Text size="small" weight="medium">
              {item.name}
            </Text>
            <Amount value={item.price} size="small" type="body" suffix="none" />
          </Box>
          <Text size="xsmall" color="surface.text.gray.muted">
            {`${item.subtitle} · ${item.rating}★`}
          </Text>
          <Box>
            <Badge size="xsmall" color="information">
              {`Best for: ${bestForLabel(item, items)}`}
            </Badge>
          </Box>
        </Box>
      ))}
      {best ? (
        <Alert
          color="positive"
          emphasis="subtle"
          isFullWidth
          isDismissible={false}
          title="AI recommendation"
          description={`${best.name} offers the best balance of rating, price and everyday performance.`}
        />
      ) : null}
    </Box>
  );
}

export default function AiChatDrawer({ isOpen, onDismiss, product }: Props) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [value, setValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const lastSuggested = useRef<Product[]>([]);
  const lastInput = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => (timer.current ? clearTimeout(timer.current) : undefined), []);

  const respond = (text: string) => {
    lastInput.current = text;
    setError(null);
    setIsThinking(true);
    timer.current = setTimeout(() => {
      try {
        const reply = getAssistantReply(text, lastSuggested.current);
        if (reply.products?.length) lastSuggested.current = reply.products;
        if (reply.compare?.length) lastSuggested.current = reply.compare;
        setMessages((prev) => [...prev, reply]);
      } catch {
        setError("The assistant could not respond just now.");
      } finally {
        setIsThinking(false);
      }
    }, 700);
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "self", text: trimmed },
    ]);
    setValue("");
    respond(trimmed);
  };

  const openProduct = (item: Product) => {
    onDismiss();
    void navigate({ to: "/products/$slug", params: { slug: item.slug } });
  };

  const addToCart = (item: Product) => {
    setCart((prev) => [...prev, item]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <BladeRoot>
      <Drawer isOpen={isOpen} onDismiss={onDismiss} accessibilityLabel="Acme AI shopping assistant">
        <DrawerHeader
          title="Acme AI Assistant"
          subtitle="Ask me anything about products, comparisons, or buying help."
          leading={<Avatar size="medium" name="AI Assistant" src={avatarImg} />}
          titleSuffix={
            <Indicator color="positive" size="small">
              Online
            </Indicator>
          }
        />

        <DrawerBody>
          <Box display="flex" flexDirection="column" gap="spacing.5" paddingBottom="spacing.4">
            {product ? (
              <Box
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                borderRadius="medium"
                padding="spacing.4"
                display="flex"
                flexDirection="row"
                gap="spacing.4"
                alignItems="center"
                backgroundColor="surface.background.gray.subtle"
              >
                <img
                  src={product.img}
                  alt={product.name}
                  loading="lazy"
                  style={{ width: "44px", height: "44px", objectFit: "contain" }}
                />
                <Box flex="1">
                  <Text size="xsmall" color="surface.text.gray.muted">
                    You're viewing
                  </Text>
                  <Text size="small" weight="semibold">
                    {product.name}
                  </Text>
                </Box>
                <Amount value={product.price} size="small" type="heading" suffix="none" />
              </Box>
            ) : null}

            {messages.length === 0 && !isThinking ? (
              <EmptyState
                size="small"
                title="Your shopping assistant"
                description="I can suggest products, compare options and answer questions about specs, delivery and returns."
                asset={
                  <img
                    src={avatarImg}
                    alt="AI assistant"
                    width={72}
                    height={72}
                    loading="lazy"
                  />
                }
              >
                <ChipGroup
                  accessibilityLabel="Sample prompts"
                  selectionType="single"
                  size="small"
                  value=""
                  onChange={({ values }) => values[0] && send(values[0])}
                >
                  {samplePrompts.map((p) => (
                    <Chip key={p} value={p}>
                      {p}
                    </Chip>
                  ))}
                </ChipGroup>
              </EmptyState>
            ) : null}

            {messages.map((message) => (
              <Box key={message.id} display="flex" flexDirection="column" gap="spacing.3">
                <BladeChatMessage senderType={message.sender}>
                  {message.text ?? ""}
                </BladeChatMessage>

                {message.products?.length ? (
                  <Box display="flex" flexDirection="row" gap="spacing.3" flexWrap="wrap">
                    {message.products.map((item) => (
                      <ChatProductCard
                        key={item.slug}
                        item={item}
                        onOpen={() => openProduct(item)}
                        onAdd={() => addToCart(item)}
                      />
                    ))}
                  </Box>
                ) : null}

                {message.compare?.length ? <CompareBlock items={message.compare} /> : null}

                {message.sender === "other" && message.chips?.length ? (
                  <ChipGroup
                    accessibilityLabel="Quick replies"
                    selectionType="single"
                    size="xsmall"
                    value=""
                    onChange={({ values }) => values[0] && send(values[0])}
                  >
                    {message.chips.map((chip) => (
                      <Chip key={chip} value={chip}>
                        {chip}
                      </Chip>
                    ))}
                  </ChipGroup>
                ) : null}
              </Box>
            ))}

            {isThinking ? (
              <BladeChatMessage
                senderType="other"
                isLoading
                loadingText={["Thinking…", "Checking the catalogue…", "Comparing options…"]}
              />
            ) : null}

            {error ? (
              <Alert
                color="negative"
                emphasis="subtle"
                isFullWidth
                isDismissible={false}
                title="Couldn't get a reply"
                description={error}
                actions={{
                  primary: { text: "Retry", onClick: () => respond(lastInput.current) },
                }}
              />
            ) : null}

            {cart.length ? (
              <Box
                borderWidth="thin"
                borderColor="surface.border.gray.muted"
                borderRadius="medium"
                padding="spacing.4"
                display="flex"
                flexDirection="column"
                gap="spacing.3"
                backgroundColor="surface.background.gray.subtle"
              >
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Heading size="small">{`Cart (${cart.length})`}</Heading>
                  <Amount value={cartTotal} size="small" type="heading" suffix="none" />
                </Box>
                {cart.map((item, i) => (
                  <Box
                    key={`${item.slug}-${i}`}
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    gap="spacing.3"
                  >
                    <Text size="xsmall" color="surface.text.gray.muted">
                      {item.name}
                    </Text>
                    <Amount value={item.price} size="xsmall" type="body" suffix="none" />
                  </Box>
                ))}
                <Button variant="primary" size="small" icon={ZapIcon} isFullWidth>
                  Continue to checkout
                </Button>
              </Box>
            ) : null}
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <ChipGroup
              accessibilityLabel="Suggested actions"
              selectionType="single"
              size="xsmall"
              value=""
              onChange={({ values }) => values[0] && send(values[0])}
            >
              {quickChips.map((chip) => (
                <Chip key={chip} value={chip}>
                  {chip}
                </Chip>
              ))}
            </ChipGroup>
            <ChatInput
              value={value}
              onChange={({ value: v }) => setValue(v)}
              onSubmit={({ value: v }) => send(v)}
              placeholder="Ask anything about products…"
              suggestions={samplePrompts}
              isGenerating={isThinking}
              hideFileUpload
              accessibilityLabel="Message the AI shopping assistant"
            />
          </Box>
        </DrawerFooter>
      </Drawer>
    </BladeRoot>
  );
}
