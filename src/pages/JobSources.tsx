import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useJobSources, useCreateJobSource, useUpdateJobSource, useDeleteJobSource, useJobSourceStats, JobSourceRow } from "@/hooks/data/useJobSources";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const empty = {
  name: "", type: "", payment_type: "percentage" as const, payment_value: 0,
  contact_person: "", email: "", phone: "", website: "", is_active: true, notes: "",
};

const JobSources = () => {
  const { data: sources = [], isLoading } = useJobSources();
  const { data: stats = {} } = useJobSourceStats();
  const { canEdit } = useAuth();
  const create = useCreateJobSource();
  const update = useUpdateJobSource();
  const del = useDeleteJobSource();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JobSourceRow | null>(null);
  const [form, setForm] = useState<any>(empty);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (s: JobSourceRow) => {
    setEditing(s);
    setForm({
      name: s.name, type: s.type ?? "", payment_type: s.payment_type, payment_value: s.payment_value,
      contact_person: s.contact_person ?? "", email: s.email ?? "", phone: s.phone ?? "",
      website: s.website ?? "", is_active: s.is_active, notes: s.notes ?? "",
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload = { ...form, payment_value: Number(form.payment_value) };
    if (editing) await update.mutateAsync({ id: editing.id, ...payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Sources</h1>
          <p className="text-muted-foreground text-sm">Where jobs come from — set commission % or fixed amount per source</p>
        </div>
        {canEdit && <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Source</Button>}
      </div>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : sources.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          No job sources yet. Add Google Ads, referrals, walk-ins, etc.
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((s) => {
            const st = stats[s.id] ?? { jobs: 0, completed: 0, revenue: 0, commission: 0, profit: 0 };
            return (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{s.name}</CardTitle>
                      {s.type && <p className="text-xs text-muted-foreground mt-1">{s.type}</p>}
                    </div>
                    <Badge variant={s.is_active ? "default" : "secondary"}>{s.is_active ? "Active" : "Inactive"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Commission</span>
                    <span className="font-medium">
                      {s.payment_type === "percentage" ? `${s.payment_value}%` : `$${s.payment_value} flat`}
                    </span>
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jobs brought</span>
                      <span className="font-medium">{st.jobs} ({st.completed} done)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium">${st.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Commission owed</span>
                      <span className="font-medium text-orange-600">${st.commission.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Company profit</span>
                      <span className="font-medium text-green-600">${st.profit.toFixed(2)}</span>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(s)}>
                        <Pencil className="h-3 w-3 mr-1" />Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {s.name}?</AlertDialogTitle>
                            <AlertDialogDescription>Jobs from this source will keep their data but lose the link.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => del.mutate(s.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Job Source" : "Add Job Source"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Google Ads, John (referral)…" /></div>
            <div><Label>Type</Label><Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Online, Referral, Walk-in…" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Commission Type</Label>
                <Select value={form.payment_type} onValueChange={(v) => setForm({ ...form, payment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">% of Job</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{form.payment_type === "percentage" ? "Percentage (%)" : "Amount per job ($)"}</Label>
                <Input type="number" value={form.payment_value} onChange={(e) => setForm({ ...form, payment_value: e.target.value })} placeholder="0 for free sources" />
              </div>
            </div>
            <div><Label>Contact person</Label><Input value={form.contact_person} onChange={(e) => setForm({ ...form, contact_person: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div><Label>Website</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              <Label>Active</Label>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!form.name}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSources;
