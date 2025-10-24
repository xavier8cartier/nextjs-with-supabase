"use client";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

export default function MantineProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider defaultColorScheme="light">{children}</MantineProvider>
    </>
  );
}
