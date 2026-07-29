"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Bell, Lock, AlertTriangle, Check, Trash2 } from "lucide-react";
import { Button, Input, Card, Alert, Modal, Switch } from "@/components/ui";

type SettingsTab = "profile" | "notifications" | "security" | "danger";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  /* ── 1. Profile State ── */
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex@hawkeye.dev");
  const [profileSuccess, setProfileSuccess] = useState(false);

  /* ── 2. Notifications State ── */
  const [notifComplete, setNotifComplete] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  /* ── 3. Security State ── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  /* ── 4. Danger Zone Modal State ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  /* ── Handlers ── */
  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  }

  function handleSaveNotifications(e: React.FormEvent) {
    e.preventDefault();
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 3000);
  }

  function handleSaveSecurity(e: React.FormEvent) {
    e.preventDefault();
    setSecurityError(null);

    if (!currentPassword) {
      setSecurityError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setSecurityError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityError("New passwords do not match.");
      return;
    }

    setSecuritySuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecuritySuccess(false), 3000);
  }

  function handleConfirmDelete() {
    if (deleteInput.trim().toUpperCase() === "DELETE") {
      setDeleteModalOpen(false);
      router.push("/login");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ── Page Header ── */}
      <header>
        <p className="font-mono text-xs text-feather/60 tracking-widest mb-1">
          SYS::CONFIG
        </p>
        <h1 className="font-display text-3xl lg:text-4xl text-bone tracking-wide">
          SETTINGS
        </h1>
        <p className="font-body text-sm text-feather mt-1">
          Manage your account preferences, notifications, and security.
        </p>
      </header>

      {/* ── Tab Navigation Bar ── */}
      <div className="border-b border-border">
        <nav
          className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-px"
          role="tablist"
          aria-label="Settings sections"
        >
          <button
            role="tab"
            aria-selected={activeTab === "profile"}
            aria-controls="panel-profile"
            id="tab-profile"
            onClick={() => setActiveTab("profile")}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono tracking-wider transition-colors cursor-pointer border-b-2 font-medium shrink-0
              ${
                activeTab === "profile"
                  ? "border-talon text-talon bg-talon/5"
                  : "border-transparent text-feather hover:text-bone hover:bg-raised/40"
              }
            `}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "notifications"}
            aria-controls="panel-notifications"
            id="tab-notifications"
            onClick={() => setActiveTab("notifications")}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono tracking-wider transition-colors cursor-pointer border-b-2 font-medium shrink-0
              ${
                activeTab === "notifications"
                  ? "border-talon text-talon bg-talon/5"
                  : "border-transparent text-feather hover:text-bone hover:bg-raised/40"
              }
            `}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "security"}
            aria-controls="panel-security"
            id="tab-security"
            onClick={() => setActiveTab("security")}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono tracking-wider transition-colors cursor-pointer border-b-2 font-medium shrink-0
              ${
                activeTab === "security"
                  ? "border-talon text-talon bg-talon/5"
                  : "border-transparent text-feather hover:text-bone hover:bg-raised/40"
              }
            `}
          >
            <Lock className="w-4 h-4" />
            <span>Security</span>
          </button>

          <button
            role="tab"
            aria-selected={activeTab === "danger"}
            aria-controls="panel-danger"
            id="tab-danger"
            onClick={() => setActiveTab("danger")}
            className={`
              flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-mono tracking-wider transition-colors cursor-pointer border-b-2 font-medium shrink-0
              ${
                activeTab === "danger"
                  ? "border-critical text-critical bg-critical/5"
                  : "border-transparent text-critical/70 hover:text-critical hover:bg-critical/5"
              }
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone</span>
          </button>
        </nav>
      </div>

      {/* ── TAB 1: PROFILE ── */}
      {activeTab === "profile" && (
        <div role="tabpanel" id="panel-profile" aria-labelledby="tab-profile">
          <Card padding="lg" className="space-y-6">
            <Card.Header
              title="Profile Settings"
              subtitle="SYS::USER"
            />

            {profileSuccess && (
              <Alert variant="success" icon={Check}>
                Profile information updated successfully.
              </Alert>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
              {/* Avatar Preview */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-dusk border border-talon/40 flex items-center justify-center text-talon font-display text-xl font-bold shrink-0">
                  AM
                </div>
                <div>
                  <p className="font-mono text-sm text-bone font-medium">Avatar</p>
                  <p className="font-body text-xs text-feather/70 mt-0.5">
                    Initials are generated automatically from your display name.
                  </p>
                </div>
              </div>

              <Input
                label="Display Name"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="Primary email used for scan alerts and account recovery."
                required
              />

              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* ── TAB 2: NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div role="tabpanel" id="panel-notifications" aria-labelledby="tab-notifications">
          <Card padding="lg" className="space-y-6">
            <Card.Header
              title="Notification Preferences"
              subtitle="SYS::PREFS"
            />

            {notifSuccess && (
              <Alert variant="success" icon={Check}>
                Notification preferences saved.
              </Alert>
            )}

            <form onSubmit={handleSaveNotifications} className="space-y-4 max-w-xl">
              <Switch
                checked={notifComplete}
                onChange={setNotifComplete}
                label="Scan Completion Alerts"
                description="Receive an email notification immediately after an automated security scan completes."
              />

              <Switch
                checked={notifCritical}
                onChange={setNotifCritical}
                label="Critical Finding Alerts"
                description="Get notified immediately when critical security vulnerabilities (<40 score) are detected."
              />

              <Switch
                checked={notifWeekly}
                onChange={setNotifWeekly}
                label="Weekly Security Digest"
                description="Receive a consolidated weekly email summarizing target health scores and scan trends."
              />

              <div className="pt-4">
                <Button type="submit" variant="primary" size="md">
                  Save Preferences
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ── TAB 3: SECURITY ── */}
      {activeTab === "security" && (
        <div role="tabpanel" id="panel-security" aria-labelledby="tab-security">
          <Card padding="lg" className="space-y-6">
            <Card.Header
              title="Security & Password"
              subtitle="SYS::AUTH"
            />

            {securityError && (
              <Alert variant="error">
                {securityError}
              </Alert>
            )}

            {securitySuccess && (
              <Alert variant="success" icon={Check}>
                Password updated successfully.
              </Alert>
            )}

            <form onSubmit={handleSaveSecurity} className="space-y-5 max-w-xl">
              <Input
                label="Current Password"
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Input
                label="New Password"
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                helperText="Minimum 8 characters."
                required
              />

              <Input
                label="Confirm New Password"
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <Button type="submit" variant="primary" size="md">
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* ── TAB 4: DANGER ZONE ── */}
      {activeTab === "danger" && (
        <div role="tabpanel" id="panel-danger" aria-labelledby="tab-danger">
          <Card padding="lg" className="border-critical/40 bg-critical/5 space-y-6">
            <Card.Header
              title="Danger Zone"
              subtitle="SYS::DESTRUCTIVE"
            />

            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded-lg bg-raised border border-border space-y-2">
                <h4 className="font-mono text-sm font-bold text-critical">
                  Delete Hawkeye Account
                </h4>
                <p className="font-body text-xs text-feather/80 leading-relaxed">
                  Permanently remove your account, scan history, saved report documents, and configuration preferences. This action cannot be undone.
                </p>
              </div>

              <Button
                variant="primary"
                size="md"
                leftIcon={Trash2}
                onClick={() => {
                  setDeleteInput("");
                  setDeleteModalOpen(true);
                }}
                className="bg-critical text-bone hover:bg-critical/90 border-transparent"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Delete Account Confirmation Modal ── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="primary"
              disabled={deleteInput.trim().toUpperCase() !== "DELETE"}
              onClick={handleConfirmDelete}
              className="bg-critical text-bone hover:bg-critical/90 border-transparent"
            >
              Confirm Permanent Deletion
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="font-body text-sm text-bone">
            This action will permanently delete your Hawkeye account and all associated security scan history.
          </p>

          <p className="font-body text-xs text-feather">
            Please type <span className="font-mono font-bold text-critical">DELETE</span> below to confirm.
          </p>

          <Input
            id="delete-confirm-input"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder="DELETE"
            autoFocus
          />
        </div>
      </Modal>
    </div>
  );
}
