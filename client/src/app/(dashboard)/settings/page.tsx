"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";

export default function SettingsPage() {
  const { user } = useAuth();
  const [emergencyUrl, setEmergencyUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmergencyCard = async () => {
    setIsGenerating(true);
    try {
      const { data } = await api.post("/emergency-card/generate");
      setEmergencyUrl(data.url);
      toast.success("Emergency card generated!");
    } catch {
      toast.error("Failed to generate card");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Generate a shareable link with your critical document info. Items marked
            as &ldquo;emergency&rdquo; will be visible without login.
          </p>
          <Button onClick={generateEmergencyCard} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate Emergency Card"}
          </Button>
          {emergencyUrl && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Share this link:</p>
              <code className="text-sm text-indigo-600 break-all">{emergencyUrl}</code>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(emergencyUrl);
                  toast.success("Copied to clipboard!");
                }}
              >
                Copy Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
