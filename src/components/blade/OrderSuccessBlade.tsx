import { useMemo, useState } from "react";
import {
  Alert,
  Amount,
  Badge,
  Box,
  Button,
  BoxIcon,
  Card,
  CardBody,
  CheckCircleIcon,
  ClockIcon,
  CopyIcon,
  Divider,
  DownloadIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Heading,
  HeadsetIcon,
  IconButton,
  ListIcon,
  MailIcon,
  MapPinIcon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PackageIcon,
  RefreshIcon,
  ShieldIcon,
  SparklesIcon,
  StepGroup,
  StepItem,
  StepItemIcon,
  Text,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { useAiChat } from "./AiChatProvider";
import { getProduct } from "@/lib/catalog";

const order = {
  id: "ACME-2025-000123",
  paymentId: "pay_Qr8X1Z3abcde45",
  invoiceNumber: "INV-2025-000123",
  invoiceDate: "20 May 2025",
  customer: "Hemal Singh",
  email: "hemal.singh@example.com",
  phone: "+91 98765 43210",
  method: "Paid via UPI",
  time: "20 May 2025, 11:28 AM",
  trackingId: "ACME1234567890",
  address: "12-5-98/A, Road No. 3, Banjara Hills, Hyderabad, Telangana - 500034, India",
  lines: [
    { slug: "sony-wh-1000xm5", qty: 1, variant: "Black" },
    { slug: "boat-airdopes-131-pro", qty: 1, variant: "Black" },
    { slug: "jbl-tune-770nc", qty: 1, variant: "Blue" },
  ],
};

const stages = [
  { title: "Preparing", status: "Completed", date: "20 May 2025", time: "11:30 AM", state: "done" },
  { title: "Packed", status: "Completed", date: "20 May 2025", time: "01:15 PM", state: "done" },
  { title: "Shipped", status: "In Transit", date: "20 May 2025", time: "04:20 PM", state: "current" },
  { title: "Out for Delivery", status: "Upcoming", date: "21 May 2025", time: "09:00 AM", state: "next" },
  { title: "Delivered", status: "Upcoming", date: "21 May 2025", time: "07:00 PM", state: "next" },
] as const;

const trust = [
  { icon: ShieldIcon, title: "Secure Payments", sub: "Powered by Razorpay" },
  { icon: RefreshIcon, title: "Easy Returns", sub: "10 days return policy" },
  { icon: HeadsetIcon, title: "24/7 Support", sub: "We're here to help" },
  { icon: MapPinIcon, title: "Order Tracking", sub: "Track in real-time" },
];

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.4" alignItems="flex-start">
    <Text size="small" color="surface.text.gray.muted">
      {label}
    </Text>
    <Box textAlign="right">{children}</Box>
  </Box>
);

export default function OrderSuccessBlade() {
  const { openChat } = useAiChat();
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [trackingExpanded, setTrackingExpanded] = useState(true);

  const items = useMemo(
    () =>
      order.lines
        .map((l) => ({ ...l, product: getProduct(l.slug) }))
        .filter((l): l is typeof l & { product: NonNullable<ReturnType<typeof getProduct>> } => Boolean(l.product)),
    [],
  );

  const subtotal = items.reduce((s, l) => s + l.product.price * l.qty, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const copy = async (value: string, what: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(`${what} copied to clipboard.`);
    } catch {
      setNotice(`Could not copy ${what}.`);
    }
  };

  const downloadInvoice = () => {
    const lines = [
      `Acme Store — Tax Invoice`,
      `Invoice Number: ${order.invoiceNumber}`,
      `Invoice Date: ${order.invoiceDate}`,
      `Order ID: ${order.id}`,
      `Payment ID: ${order.paymentId}`,
      `Customer: ${order.customer} (${order.email})`,
      `Shipping Address: ${order.address}`,
      ``,
      ...items.map((l) => `${l.product.name} x${l.qty} — ₹${(l.product.price * l.qty).toLocaleString("en-IN")}`),
      ``,
      `Subtotal: ₹${subtotal.toLocaleString("en-IN")}`,
      `Tax (GST 18%): ₹${tax.toLocaleString("en-IN")}`,
      `Total Paid: ₹${total.toLocaleString("en-IN")}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Invoice downloaded.");
  };

  return (
    <BladeRoot>
      <Box backgroundColor="surface.background.gray.subtle" paddingX="spacing.7" paddingY="spacing.7">
        <Box maxWidth="1200px" margin="auto" display="flex" flexDirection="column" gap="spacing.6">
          {notice ? (
            <Alert
              color="information"
              description={notice}
              isDismissible
              onDismiss={() => setNotice(null)}
              isFullWidth
            />
          ) : null}

          {/* Success banner */}
          <Card elevation="lowRaised" padding="spacing.0" backgroundColor="surface.background.gray.intense">
            <CardBody>
              <Box
                display="flex"
                flexDirection={{ base: "column", m: "row" }}
                alignItems={{ base: "flex-start", m: "center" }}
                gap="spacing.7"
                padding="spacing.7"
              >
                <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center" flex="1">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="56px"
                    height="56px"
                    borderRadius="max"
                    backgroundColor="feedback.background.positive.intense"
                    flexShrink={0}
                  >
                    <CheckCircleIcon size="xlarge" color="surface.icon.staticWhite.normal" />
                  </Box>
                  <Box>
                    <Heading size="large">Payment Successful!</Heading>
                    <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
                      Your payment was completed successfully.
                    </Text>
                    <Text size="small" color="surface.text.gray.muted">
                      Your order is confirmed and will be shipped soon.
                    </Text>
                  </Box>
                </Box>

                <Box display="flex" flexDirection="row" gap="spacing.8" flexWrap="wrap">
                  <Box>
                    <Text size="small" color="surface.text.gray.muted">
                      Amount Paid
                    </Text>
                    <Amount
                      value={total}
                      currency="INR"
                      size="large"
                      type="heading"
                      color="feedback.text.positive.intense"
                    />
                  </Box>
                  <Box>
                    <Text size="small" color="surface.text.gray.muted">
                      Order ID
                    </Text>
                    <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
                      <Text weight="semibold">{order.id}</Text>
                      <IconButton
                        icon={CopyIcon}
                        accessibilityLabel="Copy order ID"
                        onClick={() => void copy(order.id, "Order ID")}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Text size="small" color="surface.text.gray.muted">
                      Payment ID
                    </Text>
                    <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
                      <Text weight="semibold">{order.paymentId}</Text>
                      <IconButton
                        icon={CopyIcon}
                        accessibilityLabel="Copy payment ID"
                        onClick={() => void copy(order.paymentId, "Payment ID")}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Order details + Invoice */}
          <Box display="flex" flexDirection={{ base: "column", l: "row" }} gap="spacing.6" alignItems="stretch">
            <Box flex="2" minWidth="320px" display="flex">
              <Card elevation="lowRaised" padding="spacing.7" width="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5" width="100%">
                    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                      <ListIcon size="medium" color="surface.icon.gray.subtle" />
                      <Heading size="small">Order Details</Heading>
                    </Box>
                    <Divider />
                    <Box display="flex" flexDirection={{ base: "column", m: "row" }} gap="spacing.7">
                      <Box flex="1" display="flex" flexDirection="column" gap="spacing.4">
                        <Row label="Order ID">
                          <Text weight="semibold" size="small">
                            {order.id}
                          </Text>
                        </Row>
                        <Row label="Payment ID">
                          <Text weight="semibold" size="small">
                            {order.paymentId}
                          </Text>
                        </Row>
                        <Row label="Customer Name">
                          <Text weight="semibold" size="small">
                            {order.customer}
                          </Text>
                        </Row>
                        <Row label="Email">
                          <Text weight="semibold" size="small">
                            {order.email}
                          </Text>
                        </Row>
                        <Row label="Phone">
                          <Text weight="semibold" size="small">
                            {order.phone}
                          </Text>
                        </Row>
                        <Row label="Payment Method">
                          <Badge color="information" size="small">
                            {order.method}
                          </Badge>
                        </Row>
                        <Row label="Payment Time">
                          <Text weight="semibold" size="small">
                            {order.time}
                          </Text>
                        </Row>
                        <Row label="Shipping Address">
                          <Text size="small" weight="semibold">
                            {order.customer}
                          </Text>
                        </Row>
                        <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">
                          {order.address}
                        </Text>
                      </Box>

                      <Box flex="1" display="flex" flexDirection="column" gap="spacing.4">
                        <Text size="small" weight="semibold">
                          Items ({items.length})
                        </Text>
                        <Divider />
                        {items.map((l) => (
                          <Box
                            key={l.slug}
                            display="flex"
                            flexDirection="row"
                            gap="spacing.4"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                              <Box
                                width="56px"
                                height="56px"
                                borderRadius="medium"
                                borderWidth="thin"
                                borderColor="surface.border.gray.muted"
                                overflow="hidden"
                                flexShrink={0}
                                backgroundColor="surface.background.gray.intense"
                              >
                                <img
                                  src={l.product.img}
                                  alt={l.product.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </Box>
                              <Box>
                                <Text size="small" weight="semibold">
                                  {l.product.name}
                                </Text>
                                <Text size="xsmall" color="surface.text.gray.muted">
                                  {l.variant} · Qty: {l.qty}
                                </Text>
                              </Box>
                            </Box>
                            <Amount value={l.product.price * l.qty} currency="INR" size="small" weight="semibold" />
                          </Box>
                        ))}
                        <Divider />
                        <Row label="Subtotal">
                          <Amount value={subtotal} currency="INR" size="small" />
                        </Row>
                        <Row label="Tax (GST 18%)">
                          <Amount value={tax} currency="INR" size="small" />
                        </Row>
                        <Row label="Amount Paid">
                          <Amount value={total} currency="INR" size="medium" weight="semibold" />
                        </Row>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>

            <Box flex="1" minWidth="300px" display="flex">
              <Card elevation="lowRaised" padding="spacing.7" width="100%">
                <CardBody>
                  <Box display="flex" flexDirection="column" gap="spacing.5" width="100%">
                    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                      <FileTextIcon size="medium" color="surface.icon.gray.subtle" />
                      <Heading size="small">Invoice</Heading>
                    </Box>
                    <Divider />
                    <Row label="Invoice Number">
                      <Text size="small" weight="semibold">
                        {order.invoiceNumber}
                      </Text>
                    </Row>
                    <Row label="Status">
                      <Badge color="positive" size="small">
                        Generated
                      </Badge>
                    </Row>
                    <Row label="Invoice Date">
                      <Text size="small" weight="semibold">
                        {order.invoiceDate}
                      </Text>
                    </Row>
                    <Row label="Tax (GST 18%)">
                      <Amount value={tax} currency="INR" size="small" weight="semibold" />
                    </Row>
                    <Row label="Total Amount">
                      <Amount value={total} currency="INR" size="small" weight="semibold" />
                    </Row>
                    <Divider />
                    <Button isFullWidth variant="secondary" icon={DownloadIcon} onClick={downloadInvoice}>
                      Download Invoice
                    </Button>
                    <Box display="flex" flexDirection="row" gap="spacing.4">
                      <Box flex="1">
                        <Button isFullWidth variant="tertiary" onClick={() => setInvoiceOpen(true)}>
                          View Invoice
                        </Button>
                      </Box>
                      <Box flex="1">
                        <Button
                          isFullWidth
                          variant="tertiary"
                          icon={MailIcon}
                          onClick={() => setNotice(`Invoice re-sent to ${order.email}.`)}
                        >
                          Resend
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </Box>
          </Box>

          {/* Tracking */}
          <Card elevation="lowRaised" padding="spacing.7">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.6" width="100%">
                <Box
                  display="flex"
                  flexDirection="row"
                  gap="spacing.3"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                    <PackageIcon size="medium" color="surface.icon.gray.subtle" />
                    <Heading size="small">Order Tracking</Heading>
                    <Text size="small" color="surface.text.gray.muted">
                      (This is a demo / test order)
                    </Text>
                  </Box>
                  <Button
                    variant="tertiary"
                    size="small"
                    onClick={() => setTrackingExpanded((v) => !v)}
                  >
                    {trackingExpanded ? "Hide tracking" : "Track order"}
                  </Button>
                </Box>

                {trackingExpanded ? (
                  <>
                    <StepGroup orientation="horizontal" size="medium">
                      {stages.map((s) => (
                        <StepItem
                          key={s.title}
                          title={s.title}
                          timestamp={`${s.date} · ${s.time}`}
                          description={s.status}
                          stepProgress={s.state === "done" ? "full" : s.state === "current" ? "start" : "none"}
                          isSelected={s.state === "current"}
                          marker={
                            <StepItemIcon
                              icon={s.state === "done" ? CheckCircleIcon : s.state === "current" ? BoxIcon : ClockIcon}
                              color={s.state === "done" ? "positive" : s.state === "current" ? "information" : "neutral"}
                            />
                          }
                        />
                      ))}
                    </StepGroup>
                    <Box display="flex" justifyContent="center">
                      <Badge color="information" size="medium" icon={BoxIcon}>
                        Your order is on the way
                      </Badge>
                    </Box>
                    <Divider />
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap="spacing.4"
                      flexWrap="wrap"
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                        <Text size="small" color="surface.text.gray.muted">
                          Tracking ID: {order.trackingId}
                        </Text>
                        <IconButton
                          icon={CopyIcon}
                          accessibilityLabel="Copy tracking ID"
                          onClick={() => void copy(order.trackingId, "Tracking ID")}
                        />
                      </Box>
                      <Button variant="tertiary" icon={ExternalLinkIcon} iconPosition="right" onClick={() => setNotice("Courier tracking is simulated in test mode.")}>
                        Track with courier
                      </Button>
                    </Box>
                  </>
                ) : null}
              </Box>
            </CardBody>
          </Card>

          {/* What's next */}
          <Card elevation="lowRaised" padding="spacing.7">
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.6" width="100%">
                <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
                  <SparklesIcon size="medium" color="surface.icon.primary.normal" />
                  <Heading size="small">What's Next?</Heading>
                </Box>
                <Box display="flex" flexDirection={{ base: "column", m: "row" }} gap="spacing.5">
                  {[
                    {
                      icon: MapPinIcon,
                      title: "Track Your Order",
                      sub: "Real-time updates on your order",
                      cta: "Track Order",
                      onClick: () => setTrackingExpanded(true),
                    },
                    {
                      icon: FileTextIcon,
                      title: "View Invoice",
                      sub: "Download or view your invoice",
                      cta: "View Invoice",
                      onClick: () => setInvoiceOpen(true),
                    },
                    {
                      icon: ShoppingBagIcon,
                      title: "Continue Shopping",
                      sub: "Explore more products",
                      cta: "Shop Now",
                      onClick: () => {
                        window.location.href = "/products";
                      },
                    },
                    {
                      icon: SparklesIcon,
                      title: "Ask AI about this order",
                      sub: "Get help with your order",
                      cta: "Ask AI",
                      onClick: () => openChat(),
                    },
                  ].map((a) => (
                    <Box
                      key={a.title}
                      flex="1"
                      borderWidth="thin"
                      borderColor="surface.border.gray.muted"
                      borderRadius="medium"
                      padding="spacing.5"
                      display="flex"
                      flexDirection="column"
                      gap="spacing.4"
                    >
                      <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          width="36px"
                          height="36px"
                          borderRadius="round"
                          backgroundColor="surface.background.primary.subtle"
                          flexShrink={0}
                        >
                          <a.icon size="medium" color="surface.icon.primary.normal" />
                        </Box>
                        <Box>
                          <Text size="small" weight="semibold">
                            {a.title}
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            {a.sub}
                          </Text>
                        </Box>
                      </Box>
                      <Button isFullWidth variant="tertiary" size="small" onClick={a.onClick}>
                        {a.cta}
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Trust strip */}
          <Box
            backgroundColor="surface.background.gray.moderate"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
            padding="spacing.6"
            display="flex"
            flexDirection={{ base: "column", m: "row" }}
            gap="spacing.6"
          >
            {trust.map((t) => (
              <Box key={t.title} flex="1" display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
                <t.icon size="large" color="surface.icon.gray.subtle" />
                <Box>
                  <Text size="small" weight="semibold">
                    {t.title}
                  </Text>
                  <Text size="xsmall" color="surface.text.gray.muted">
                    {t.sub}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.4" paddingY="spacing.5">
            <Text weight="semibold">Thank you for shopping with Acme Store.</Text>
            <Text size="small" color="surface.text.gray.muted">
              We appreciate your trust and look forward to serving you again!
            </Text>
            <Button onClick={() => { window.location.href = "/products"; }}>Continue Shopping</Button>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={invoiceOpen} onDismiss={() => setInvoiceOpen(false)} size="medium">
        <ModalHeader title={`Invoice ${order.invoiceNumber}`} subtitle={`Order ${order.id}`} />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Row label="Invoice Date">
              <Text size="small" weight="semibold">
                {order.invoiceDate}
              </Text>
            </Row>
            <Row label="Billed To">
              <Text size="small" weight="semibold">
                {order.customer}
              </Text>
            </Row>
            <Text size="xsmall" color="surface.text.gray.muted" textAlign="right">
              {order.address}
            </Text>
            <Divider />
            {items.map((l) => (
              <Row key={l.slug} label={`${l.product.name} × ${l.qty}`}>
                <Amount value={l.product.price * l.qty} currency="INR" size="small" />
              </Row>
            ))}
            <Divider />
            <Row label="Subtotal">
              <Amount value={subtotal} currency="INR" size="small" />
            </Row>
            <Row label="Tax (GST 18%)">
              <Amount value={tax} currency="INR" size="small" />
            </Row>
            <Row label="Total Paid">
              <Amount value={total} currency="INR" size="medium" weight="semibold" />
            </Row>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" flexDirection="row" gap="spacing.4" justifyContent="flex-end">
            <Button variant="tertiary" onClick={() => setInvoiceOpen(false)}>
              Close
            </Button>
            <Button icon={DownloadIcon} onClick={downloadInvoice}>
              Download
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </BladeRoot>
  );
}
