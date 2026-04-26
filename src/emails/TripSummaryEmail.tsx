import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface TripSummaryEmailProps {
  title: string;
  destination: string;
}

export default function TripSummaryEmail({ title, destination }: TripSummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your custom itinerary for {destination} is ready!</Preview>
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", margin: "40px auto" }}>
          <Heading style={{ color: "#333", fontSize: "24px" }}>{title}</Heading>
          <Text style={{ color: "#555", fontSize: "16px", lineHeight: "1.5" }}>
            Great news! Your detailed AI-generated itinerary for {destination} has been planned.
            You can view, edit, and collaborate with your travel buddies right from your dashboard.
          </Text>
          <Button
            href="https://yourdomain.com/dashboard"
            style={{
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "5px",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            View Full Itinerary
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
