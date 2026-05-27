import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useTechnicians, useCreateTechnician, useUpdateTechnician, useDeleteTechnician, useTechnicianStats, TechnicianRow } from "@/hooks/data/useTechnicians";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const empty = {
  name: "", email: "", phone: "", role: "technician" as const,
  status: "active" as const, payment_type: "percentage" as const,
  payment_rate: 40, hourly_rate: 0, specialty: "", notes: "",
};

const Technicians = () => {
  const { data: techs = [], isLoading } = useTechnicians();
  const { data: stats = {} } = useTechnicianStats();
  const { canEdit } = useAuth();
  const create = useCreateTechnician();
  const update = useUpdateTechnician();
  const del = useDeleteTechnician();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TechnicianRow | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [search, setSearch] = useState("");

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (t: TechnicianRow) => {
    setEditing(t);
    setForm({
      name: t.name, email: t.email ?? "", phone: t.phone ?? "", role: t.role,
      status: t.status, payment_type: t.payment_type, payment_rate: t.payment_rate,
      hourly_rate: t.hourly_rate ?? 0, specialty: t.specialty ?? "", notes: t.notes ?? "",
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload = { ...form, payment_rate: Number(form.payment_rate), hourly_rate: Number(form.hourly_rate) };
    if (editing) await update.mutateAsync({ id: editing.id, ...payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  const filtered = techs.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.email ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Technicians</h1>
          <p className="text-muted-foreground text-sm">Manage your team and their payment rules</p>
        </div>
        {canEdit && (
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Add Technician</Button>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          {techs.length === 0 ? "No technicians yet. Add your first one to get started." : "No matches."}
        </CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const s = stats[t.id] ?? { jobsTotal: 0, jobsCompleted: 0, revenue: 0, earned: 0 };
            return (
              <Card key={t.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{t.email}</p>
                    </div>
                    <Badge variant={t.status === "active" ? "default" : "secondary"}>{t.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="capitalize">{t.role}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pay</span>
                    <span>
                      {t.payment_type === "percentage" ? `${t.payment_rate}%`
                       : t.payment_type === "flat" ? `$${t.payment_rate}/job`
                       : t.payment_type === "hourly" ? `$${t.hourly_rate}/hr`
                       : `$${t.payment_rate} salary`}
                    </span>
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jobs completed</span>
                      <span className="font-medium">{s.jobsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue generated</span>
                      <span className="font-medium">${s.revenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total earned</span>
                      <span className="font-medium text-primary">${s.earned.toFixed(2)}</span>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(t)}>
                        <Pencil className="h-3 w-3 mr-1" />Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline"><Trash2 className="h-3 w-3" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {t.name}?</AlertDialogTitle>
                            <AlertDialogDescription>This can't be undone. Jobs assigned to them will keep their data but lose the link.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => del.mutate(t.id)}>Delete</AlertDialogAction>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Technician" : "Add Technician"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Payment Type</Label>
                <Select value={form.payment_type} onValueChange={(v) => setForm({ ...form, payment_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">% of Job</SelectItem>
                    <SelectItem value="flat">Flat per Job</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>
                  {form.payment_type === "percentage" ? "Percentage (%)"
                   : form.payment_type === "flat" ? "Amount per job ($)"
                   : form.payment_type === "hourly" ? "Hourly rate ($)" : "Salary ($)"}
                </Label>
                <Input type="number" value={form.payment_type === "hourly" ? form.hourly_rate : form.payment_rate}
                  onChange={(e) => setForm({
                    ...form,
                    [form.payment_type === "hourly" ? "hourly_rate" : "payment_rate"]: e.target.value,
                  })}
                />
              </div>
            </div>
            <div><Label>Specialty</Label><Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="HVAC, Plumbing…" /></div>
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

export default Technicians;
