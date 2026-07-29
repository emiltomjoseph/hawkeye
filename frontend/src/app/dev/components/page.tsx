"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Card,
  Badge,
  Alert,
  Modal,
  Spinner,
  EmptyState,
} from "@/components/ui";
import { Plus, Search, Shield, Globe, Terminal, RefreshCw } from "lucide-react";

export default function ComponentShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  return (
    <div className="min-h-screen bg-deep text-bone p-6 lg:p-12 space-y-12 max-w-6xl mx-auto">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-xs text-talon tracking-widest uppercase mb-1">
          DEV::UI_SHOWCASE
        </p>
        <h1 className="font-display text-4xl text-bone">
          HAWKEYE COMPONENT LIBRARY
        </h1>
        <p className="font-body text-feather text-sm mt-2">
          Visual test harness for all shared UI primitives in every variant and state.
        </p>
      </header>

      {/* 1. BUTTONS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          1. BUTTONS
        </h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
            <Button variant="primary" leftIcon={Plus}>With Left Icon</Button>
            <Button variant="primary" rightIcon={Shield} isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="secondary" size="sm">Secondary SM</Button>
            <Button variant="secondary" size="md">Secondary MD</Button>
            <Button variant="secondary" size="lg">Secondary LG</Button>
            <Button variant="secondary" leftIcon={Globe}>With Icon</Button>
            <Button variant="secondary" isLoading>Loading</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="ghost" size="sm">Ghost SM</Button>
            <Button variant="ghost" size="md">Ghost MD</Button>
            <Button variant="ghost" size="lg">Ghost LG</Button>
            <Button variant="ghost" leftIcon={Terminal}>With Icon</Button>
            <Button variant="ghost" disabled>Disabled</Button>
          </div>
        </div>
      </section>

      {/* 2. INPUTS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          2. INPUTS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Standard Input"
            placeholder="Enter target domain..."
            helperText="Supports IPv4, IPv6 or standard URLs."
          />
          <Input
            label="With Leading Icon"
            icon={Search}
            placeholder="Search security reports..."
          />
          <Input
            label="Error State"
            icon={Globe}
            defaultValue="invalid-url-string"
            error="Must be a valid HTTP or HTTPS URL format."
          />
          <Input
            label="Disabled Input"
            icon={Terminal}
            disabled
            value="https://locked-target.internal"
          />
        </div>
      </section>

      {/* 3. CARDS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          3. CARDS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="sm">
            <Card.Header subtitle="CARD::SMALL" title="Small Padding" />
            <Card.Body>Compact layout for dense dashboard rows.</Card.Body>
          </Card>

          <Card padding="md" hover>
            <Card.Header
              subtitle="CARD::HOVER"
              title="Hover Interactive"
              action={<Badge variant="pass">Active</Badge>}
            />
            <Card.Body>Hover state with highlighted border transition.</Card.Body>
            <Card.Footer>
              <Button size="sm" variant="secondary">View Details</Button>
            </Card.Footer>
          </Card>

          <Card padding="lg">
            <Card.Header subtitle="CARD::LARGE" title="Large Padding" />
            <Card.Body>Generous padding suited for modal content or hero cards.</Card.Body>
          </Card>
        </div>
      </section>

      {/* 4. BADGES */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          4. BADGES
        </h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="pass">Pass Status</Badge>
          <Badge variant="warning">Warning Notice</Badge>
          <Badge variant="critical">Critical Issue</Badge>
          <Badge variant="signal">Live Scanning</Badge>
          <Badge variant="pass" dot={false}>No Dot Badge</Badge>
        </div>
      </section>

      {/* 5. ALERTS */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          5. ALERTS
        </h2>
        <div className="space-y-4">
          <Alert variant="info" title="Information Notice">
            System maintenance scheduled for midnight UTC.
          </Alert>

          <Alert variant="success" title="Scan Complete">
            Target https://example.com analyzed with 0 critical issues found.
          </Alert>

          <Alert variant="warning" title="SSL Certificate Expiring">
            Certificate for target domain expires in 4 days.
          </Alert>

          {!alertDismissed ? (
            <Alert
              variant="error"
              title="Connection Timeout"
              dismissible
              onDismiss={() => setAlertDismissed(true)}
            >
              Unable to reach target host. Click X to dismiss this alert.
            </Alert>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setAlertDismissed(false)}>
              Reset Dismissed Error Alert
            </Button>
          )}
        </div>
      </section>

      {/* 6. MODAL & SPINNER */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          6. MODAL & SPINNER
        </h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open Interactive Modal
          </Button>

          <div className="flex items-center gap-4 border border-border bg-raised p-4 rounded-lg">
            <span className="font-mono text-xs text-feather">Spinners:</span>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Security Scan Settings"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>

              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Save Changes
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p>
              Configure scanner depth and timeout settings for automated security probes.
            </p>
            <Input label="Max Scan Depth" defaultValue="3" />
            <Input label="Timeout (Seconds)" defaultValue="30" />
          </div>
        </Modal>
      </section>

      {/* 7. EMPTY STATE */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl text-bone border-b border-border/50 pb-2">
          7. EMPTY STATE
        </h2>
        <EmptyState
          icon={RefreshCw}
          title="No Reports Generated"
          description="Run a new scan to generate comprehensive security header and SSL analysis reports."
          action={
            <Button variant="primary" leftIcon={Plus}>
              Run First Scan
            </Button>
          }
        />
      </section>
    </div>
  );
}
