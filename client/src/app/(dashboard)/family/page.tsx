"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamily } from "@/hooks/use-family";
import api from "@/lib/api";
import type { FamilyMember } from "@/types";

export default function FamilyPage() {
  const { data: members, mutate } = useFamily();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FamilyMember | null>(null);
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<string>("Other");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setRelation("Other");
    setEmail("");
    setEditing(null);
  };

  const openEdit = (member: FamilyMember) => {
    setEditing(member);
    setName(member.name);
    setRelation(member.relation);
    setEmail(member.email || "");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Name is required");
    setIsLoading(true);
    try {
      const payload = { name, relation, email: email || undefined };
      if (editing) {
        await api.patch(`/family/${editing._id}`, payload);
        toast.success("Member updated");
      } else {
        await api.post("/family", payload);
        toast.success("Member added");
      }
      mutate();
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this family member?")) return;
    try {
      await api.delete(`/family/${id}`);
      toast.success("Member deleted");
      mutate();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to delete";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Family Members</h1>
        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Member" : "Add Family Member"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              </div>
              <div className="space-y-2">
                <Label>Relation</Label>
                <Select value={relation} onValueChange={(val) => val && setRelation(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Self", "Spouse", "Child", "Parent", "Other"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Email (optional)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : editing ? "Update" : "Add"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members?.map((member) => (
          <Card key={member._id}>
            <CardContent className="p-4 flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  {member.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{member.name}</p>
                <p className="text-sm text-gray-500">{member.relation}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(member)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {member.relation !== "Self" && (
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(member._id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
