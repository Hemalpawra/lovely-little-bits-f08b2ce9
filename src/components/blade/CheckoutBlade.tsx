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
  CalendarIcon,
  CheckCircleIcon,
  Divider,
  Heading,
  HeadsetIcon,
  InfoIcon,
  LockIcon,
  MailIcon,
  MapPinIcon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PackageIcon,
  PhoneIcon,
  PlusIcon,
  Radio,
  RadioGroup,
  RefreshIcon,
  SearchIcon,
  ShieldIcon,
  Text,
  TextInput,
  TrashIcon,
  EditIcon,
  ZapIcon,
} from "@razorpay/blade/components";

import { BladeRoot } from "./BladeRoot";
import { getProduct } from "@/lib/catalog";

type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
};

const initialAddresses: Address[] = [
  {
    id: "home",
    label: "Home",
    name: "Hemal Singh",
    phone: "+91 98765 43210",
    email: "hemal.singh@example.com",
    line1: "12-5-98/A, Road No. 3, Banjara Hills",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500034",
  },
  {
    id: "work",
    label: "Work",
    name: "Hemal Singh",
    phone: "+91 98765 43210",
    email: "hemal.work@example.com",
    line1: "91 Springboard, 2nd Floor, Hitech City",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
  },
];

const shippingMethods = [
  {
    id: "standard",
    icon: PackageIcon,
    title: "Standard Delivery",
    description: "Reliable and cost-effective delivery",
    eta: "Delivered by 24 - 27 May",
    price: 0,
  },
  {
    id: "express",
    icon: ZapIcon,
    title: "Express Delivery",
    description: "Faster delivery for urgent orders",
    eta: "Delivered by 21 - 22 May",
    price: 149,
  },
  {
    id: "priority",
    icon: ShieldIcon,
    title: "Priority Delivery",
    description: "Fastest delivery with priority handling",
    eta: "Delivered by 20 - 21 May",
    price: 249,
  },
] as const;

const trustItems = [
  {
    icon: ShieldIcon,
    title: "Secure Payments",
    sub: "Your payments are protected with industry-standard security.",
  },
  { icon: PackageIcon, title: "Easy Returns", sub: "Not satisfied? Return within 10 days of delivery." },
  { icon: HeadsetIcon, title: "24/7 Support", sub: "We're here to help you anytime, any day." },
  { icon: SearchIcon, title: "Order Tracking", sub: "Track your order in real-time from dispatch to delivery." },
];

const cartSlugs: { slug: string; qty: number }[] = [
  { slug: "sony-wh-1000xm5", qty: 1 },
  { slug: "boat-airdopes-131-pro", qty: 1 },
  { slug: "jbl-tune-770nc", qty: 1 },
];

const emptyForm = {
  label: "Home",
  name: "",
  phone: "",
  email: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function AddressCard({
  address,
  isSelected,
  onEdit,
  onRemove,
}: {
  address: Address;
  isSelected: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <Box
      flex="1"
      minWidth="280px"
      borderWidth="thin"
      borderColor={isSelected ? "interactive.border.primary.default" : "surface.border.gray.muted"}
      backgroundColor={isSelected ? "surface.background.primary.subtle" : "surface.background.gray.intense"}
      borderRadius="medium"
      padding="spacing.5"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
    >
      <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
        <Radio value={address.id}>{address.name}</Radio>
        <Badge color="primary" size="small">
          {address.label}
        </Badge>
      </Box>



      <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center" flexWrap="wrap">
        <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
          <PhoneIcon size="small" color="surface.icon.gray.muted" />
          <Text size="small" color="surface.text.gray.muted">
            {address.phone}
          </Text>
        </Box>
        <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
          <MailIcon size="small" color="surface.icon.gray.muted" />
          <Text size="small" color="surface.text.gray.muted">
            {address.email}
          </Text>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="flex-start">
        <MapPinIcon size="small" color="surface.icon.gray.muted" />
        <Text size="small" color="surface.text.gray.muted">
          {`${address.line1}, ${address.city}, ${address.state} - ${address.pincode}, India`}
        </Text>
      </Box>

      <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="center">
        <Button variant="tertiary" size="xsmall" icon={EditIcon} onClick={onEdit}>
          Edit
        </Button>
        <Divider orientation="vertical" height="16px" />
        <Button variant="tertiary" size="xsmall" color="negative" icon={TrashIcon} onClick={onRemove}>
          Remove
        </Button>
      </Box>
    </Box>
  );
}

export default function CheckoutBlade() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<string>("home");
  const [shipping, setShipping] = useState<string>("standard");
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<{ type: "positive" | "negative"; text: string } | null>(null);

  const method = shippingMethods.find((m) => m.id === shipping) ?? shippingMethods[0];

  const orderTotal = useMemo(() => {
    const subtotal = cartSlugs.reduce((sum, { slug, qty }) => {
      const p = getProduct(slug);
      return sum + (p ? p.price * qty : 0);
    }, 0);
    return subtotal + Math.round(subtotal * 0.18) + method.price;
  }, [method.price]);

  const current = addresses.find((a) => a.id === selectedAddress);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (a: Address) => {
    setEditingId(a.id);
    setForm({
      label: a.label,
      name: a.name,
      phone: a.phone,
      email: a.email,
      line1: a.line1,
      city: a.city,
      state: a.state,
      pincode: a.pincode,
    });
    setFormOpen(true);
  };

  const saveAddress = () => {
    if (editingId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
    } else {
      const id = `addr-${Date.now()}`;
      setAddresses((prev) => [...prev, { id, ...form }]);
      setSelectedAddress(id);
    }
    setFormOpen(false);
  };

  const payWithRazorpay = async () => {
    setStatus(null);
    const ok = await loadRazorpay();
    const key = import.meta.env["VITE_RAZORPAY_KEY_ID"] ?? "rzp_test_1DP5mmOlF5G5ag";
    const RazorpayCtor = (window as unknown as { Razorpay?: new (options: unknown) => { open: () => void } })
      .Razorpay;
    if (!ok || !RazorpayCtor) {
      setStatus({ type: "negative", text: "Could not reach Razorpay Checkout. Please try again." });
      return;
    }
    const rzp = new RazorpayCtor({
      key,
      amount: orderTotal * 100,
      currency: "INR",
      name: "Acme Store",
      description: `${method.title} · ${method.eta}`,
      prefill: {
        name: current?.name ?? "",
        email: current?.email ?? "",
        contact: current?.phone?.replace(/\s/g, "") ?? "",
      },
      notes: { shipping: method.title, pincode: current?.pincode ?? "" },
      theme: { color: "#0f62fe" },
      handler: () => setStatus({ type: "positive", text: "Payment successful. Your order is confirmed." }),
    });
    rzp.open();
  };

  const field = (
    label: string,
    key: keyof typeof form,
    placeholder: string,
    type: "text" | "email" | "telephone" | "number" = "text",
  ) => (
    <Box flex="1" minWidth="200px">
      <TextInput
        label={label}
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={({ value }) => setForm((f) => ({ ...f, [key]: value ?? "" }))}
      />
    </Box>
  );

  return (
    <BladeRoot>
      <Box backgroundColor="surface.background.gray.subtle" paddingX="spacing.7" paddingY="spacing.7">
        <Box
          maxWidth="1200px"
          margin="auto"
          display="flex"
          flexDirection="row"
          gap="spacing.6"
          flexWrap="wrap"
          alignItems="flex-start"
        >
          {/* Left */}
          <Box flex="2" minWidth="320px" display="flex" flexDirection="column" gap="spacing.6">
            {status ? (
              <Alert
                color={status.type}
                isFullWidth
                isDismissible
                description={status.text}
                onDismiss={() => setStatus(null)}
              />
            ) : null}

            {/* Delivery address */}
            <Card elevation="lowRaised" padding="spacing.7">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.5">
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap="spacing.4"
                    flexWrap="wrap"
                  >
                    <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="flex-start">
                      <MapPinIcon size="large" color="interactive.icon.primary.normal" />
                      <Box>
                        <Heading size="small" as="h2">
                          1. Delivery Address
                        </Heading>
                        <Text size="small" color="surface.text.gray.muted">
                          Select a delivery address or add a new one
                        </Text>
                      </Box>
                    </Box>
                    <Button variant="secondary" size="small" icon={PlusIcon} onClick={openAdd}>
                      Add new address
                    </Button>
                  </Box>

                  {addresses.length === 0 ? (
                    <Box
                      borderWidth="thin"
                      borderColor="surface.border.gray.muted"
                      borderRadius="medium"
                      padding="spacing.7"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      gap="spacing.4"
                    >
                      <MapPinIcon size="2xlarge" color="surface.icon.gray.muted" />
                      <Text size="small" color="surface.text.gray.muted">
                        No saved addresses yet. Add one to continue.
                      </Text>
                      <Button variant="primary" size="small" icon={PlusIcon} onClick={openAdd}>
                        Add new address
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <RadioGroup
                        label=""
                        accessibilityLabel="Delivery address"
                        value={selectedAddress}
                        onChange={({ value }) => setSelectedAddress(value)}
                        orientation="horizontal"
                        flexWrap="wrap"
                      >
                        {addresses.map((a) => (
                          <AddressCard
                            key={a.id}
                            address={a}
                            isSelected={selectedAddress === a.id}
                            onEdit={() => openEdit(a)}
                            onRemove={() =>
                              setAddresses((prev) => prev.filter((x) => x.id !== a.id))
                            }
                          />
                        ))}
                      </RadioGroup>

                      <Button variant="tertiary" isFullWidth icon={PlusIcon} onClick={openAdd}>
                        Add a new delivery address
                      </Button>
                    </>
                  )}
                </Box>
              </CardBody>
            </Card>

            {/* Shipping method */}
            <Card elevation="lowRaised" padding="spacing.7">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.5">
                  <Box display="flex" flexDirection="row" gap="spacing.4" alignItems="flex-start">
                    <BoxIcon size="large" color="interactive.icon.primary.normal" />
                    <Box>
                      <Heading size="small" as="h2">
                        2. Shipping Method
                      </Heading>
                      <Text size="small" color="surface.text.gray.muted">
                        Select a shipping method for your order
                      </Text>
                    </Box>
                  </Box>

                  <RadioGroup
                    label=""
                    accessibilityLabel="Shipping method"
                    value={shipping}
                    onChange={({ value }) => setShipping(value)}
                  >
                    {shippingMethods.map(({ id, icon: Icon, title, description, eta, price }) => (
                      <Box
                        key={id}
                        borderWidth="thin"
                        borderColor={
                          shipping === id
                            ? "interactive.border.primary.default"
                            : "surface.border.gray.muted"
                        }
                        backgroundColor={
                          shipping === id
                            ? "surface.background.primary.subtle"
                            : "surface.background.gray.intense"
                        }
                        borderRadius="medium"
                        padding="spacing.5"
                        marginBottom="spacing.4"
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        gap="spacing.4"
                        flexWrap="wrap"
                      >
                        <Radio value={id}>{""}</Radio>
                        <Icon size="medium" color="surface.icon.gray.subtle" />
                        <Box flex="1" minWidth="180px">
                          <Text size="medium" weight="semibold">
                            {title}
                          </Text>
                          <Text size="small" color="surface.text.gray.muted">
                            {description}
                          </Text>
                        </Box>
                        <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
                          <CalendarIcon size="small" color="feedback.icon.positive.intense" />
                          <Text size="small" color="feedback.text.positive.intense">
                            {eta}
                          </Text>
                        </Box>
                        {price === 0 ? (
                          <Text size="small" weight="semibold" color="feedback.text.positive.intense">
                            FREE
                          </Text>
                        ) : (
                          <Amount value={price} size="small" suffix="none" />
                        )}
                      </Box>
                    ))}
                  </RadioGroup>

                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.3"
                    alignItems="center"
                    backgroundColor="surface.background.gray.subtle"
                    borderRadius="medium"
                    padding="spacing.4"
                    flexWrap="wrap"
                  >
                    <InfoIcon size="small" color="surface.icon.gray.muted" />
                    <Text size="small" color="surface.text.gray.muted">
                      {`Delivery times are based on your pincode ${current?.pincode ?? "—"}.`}
                    </Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>

            {/* Pay CTA */}
            <Card elevation="lowRaised" padding="spacing.7">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.4">
                  <Button
                    variant="primary"
                    size="large"
                    icon={LockIcon}
                    isFullWidth
                    isDisabled={!current}
                    onClick={payWithRazorpay}
                  >
                    {`Pay with Razorpay · ₹${orderTotal.toLocaleString("en-IN")}`}
                  </Button>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.3"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <ShieldIcon size="small" color="surface.icon.gray.muted" />
                    <Text size="xsmall" color="surface.text.gray.muted">
                      You will be redirected to Razorpay Secure Checkout.
                    </Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* Right helper */}
          <Box flex="1" minWidth="280px">
            <Card elevation="lowRaised" padding="spacing.7">
              <CardBody>
                <Box display="flex" flexDirection="column" gap="spacing.5">
                  <Heading size="small" as="h2">
                    Shopping with confidence
                  </Heading>
                  {trustItems.map(({ icon: Icon, title, sub }) => (
                    <Box key={title} display="flex" flexDirection="row" gap="spacing.4" alignItems="flex-start">
                      <Icon size="medium" color="surface.icon.gray.subtle" />
                      <Box>
                        <Text size="small" weight="semibold">
                          {title}
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {sub}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                  <Divider />
                  <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center" justifyContent="center">
                    <CheckCircleIcon size="small" color="surface.icon.gray.muted" />
                    <Text size="xsmall" color="surface.text.gray.muted">
                      Powered by Razorpay
                    </Text>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isFormOpen} onDismiss={() => setFormOpen(false)} size="medium">
        <ModalHeader
          title={editingId ? "Edit address" : "Add new address"}
          subtitle="Enter the delivery details for this order"
        />
        <ModalBody>
          <Box display="flex" flexDirection="column" gap="spacing.5">
            <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
              {field("Full name", "name", "Hemal Singh")}
              {field("Label", "label", "Home")}
            </Box>
            <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
              {field("Phone number", "phone", "+91 98765 43210", "telephone")}
              {field("Email", "email", "you@example.com", "email")}
            </Box>
            {field("Address", "line1", "Flat / building, street, area")}
            <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
              {field("City", "city", "Hyderabad")}
              {field("State", "state", "Telangana")}
              {field("Pincode", "pincode", "500034")}
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" flexDirection="row" gap="spacing.4" justifyContent="flex-end">
            <Button variant="secondary" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveAddress} isDisabled={!form.name || !form.line1}>
              Save address
            </Button>
          </Box>
        </ModalFooter>
      </Modal>
    </BladeRoot>
  );
}
