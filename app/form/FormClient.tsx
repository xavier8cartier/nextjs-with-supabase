"use client";

import { useState } from "react";
import { TextInput, Button, Group, Box, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";

export default function FormClient() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      datetime: new Date(),
      text: "",
    },
    validate: {
      firstName: (value) => (value ? null : "First name required"),
      lastName: (value) => (value ? null : "Last name required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      phone: (value) =>
        value.length >= 6 ? null : "Phone number must be at least 6 digits",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Submitted values:", values);
    setSubmitted(true);
    form.reset();
  };

  return (
    <Box
      maw={500}
      mx="auto"
      mt="xl"
      p="lg"
      className="border rounded-lg shadow-sm bg-white"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Registration Form
      </h2>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          placeholder="Enter name"
          {...form.getInputProps("firstName")}
          mb="sm"
          required
        />
        <TextInput
          label="Last name"
          placeholder="Enter last name"
          {...form.getInputProps("lastName")}
          mb="sm"
          required
        />
        <TextInput
          label="E-mail"
          placeholder="Enter e-mail"
          {...form.getInputProps("email")}
          mb="sm"
          required
        />
        <TextInput
          label="Phone number"
          placeholder="+372 5555 5555"
          {...form.getInputProps("phone")}
          mb="sm"
        />
        <DateTimePicker
          label="Date and time"
          value={form.values.datetime}
          onChange={(value) =>
            form.setFieldValue("datetime", value || new Date())
          }
          mb="sm"
          required
        />
        <Textarea
          label="Text"
          placeholder="Enter text"
          minRows={3}
          {...form.getInputProps("text")}
          mb="md"
        />
        <Group position="center">
          <Button type="submit" color="indigo">
            Send
          </Button>
        </Group>
      </form>

      {submitted && (
        <p className="text-green-600 text-center mt-4">Form sent!</p>
      )}
    </Box>
  );
}
