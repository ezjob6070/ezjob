import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob, calculatePayoutPreview, JobRow } from "@/hooks/data/useJobs";
import { useTechnicians } from "@/hooks/data/useTechnicians";
import { useJobSources } from "@/hooks/data/useJobSources";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const empty = {
  title: "", client_name: "", client_phone: "", client_email: "", address: "",
  description: "", technician_id: "", job_source_id: "", scheduled_date: "",
  status: "scheduled" as const, amount: 0, actual_amount: 0, payment_status: "unpaid" as const,
  payment_method: "", notes: "",
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-purple-100 text-purple-700",
};

const Jobs = () => {
  const { data: jobs = [], isLoading } = useJobs();
  const { data: techs = [] } = useTechnicians();
  const { data: sources = [] } = useJobSources();
  const { canEdit } = useAuth();
  const create = useCreateJob();
  const update = useUpdateJob();
  const del = useDeleteJob();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [form, setForm] = useState<any>(empty);

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (j: JobRow) => {
    setEditing(j);
    setForm({
      title: j.title, client_name: j.client_name, client_phone: j.client_phone ?? "",
      client_email: j.client_email ?? "", address: j.address ?? "", description: j.description ?? "",
      technician_id: j.technician_id ?? "", job_source_id: j.job_source_id ?? "",
      scheduled_date: j.scheduled_date ? j.scheduled_date.slice(0, 16) : "",
      status: j.status, amount: j.amount, actual_amount: j.actual_amount ?? j.amount,
      payment_status: j.payment_status ?? "unpaid", payment_method: j.payment_method ?? "", notes: j.notes ?? "",
    });
    setOpen(true);
  };

  const submit = async () => {
    const payload: any = {
      ...form,
      technician_id: form.technician_id || null,
      job_source_id: form.job_source_id || null,
      scheduled_date: form.scheduled_date ? new Date(form.scheduled_date).toISOString() : null,
      amount: Number(form.amount) || 0,
      actual_amount: form.actual_amount ? Number(form.actual_amount) : null,
    };
    if (editing) await update.mutateAsync({ id: editing.id, ...payload });
    else await create.mutateAsync(payload);
    setOpen(false);
  };

  const preview = useMemo(() => {
    const tech = techs.find((t) => t.id === form.technician_id);
    const src = sources.find((s) => s.id === form.job_source_id);
    const base = Number(form.actual_amount || form.amount) || 0;
    return calculatePayoutPreview({
      amount: base,
      techPaymentType: tech?.payment_type,
      techRate: tech?.payment_rate,
      srcPaymentType: src?.payment_type,
      srcValue: src?.payment_value,
    });
  }, [form.amount, form.actual_amount, form.technician_id, form.job_source_id, techs, sources]);

  const totals = useMemo(() => {
    let revenue = 0, payouts = 0, commissions = 0, profit = 0, completed = 0;
    jobs.forEach((j) => {
      if (j.status === "completed") {
        completed++;
        revenue += Number(j.actual_amount ?? j.amount);
        payouts += Number(j.technician_payout);
        commissions += Number(j.job_source_payout);
        profit += Number(j.company_profit);
      }
    });
    return { revenue, payouts, commissions, profit, completed, total: jobs.length };
  }, [jobs]);

  const techMap = Object.fromEntries(techs.map((t) => [t.id, t.name]));
  const srcMap = Object.fromEntries(sources.map((s) => [s.id, s.name]));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-muted-foreground text-sm">{totals.total} total · {totals.completed} completed</p>
        </div>
        {canEdit && <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />New Job</Button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Revenue</p><p className="text-2xl font-bold">${totals.revenue.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Tech payouts</p><p className="text-2xl font-bold text-blue-600">${totals.payouts.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Source commissions</p><p className="text-2xl font-bold text-orange-600">${totals.commissions.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Company profit</p><p className="text-2xl font-bold text-green-600">${totals.profit.toFixed(2)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">All Jobs</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground">Loading…</p> : jobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No jobs yet. Add technicians and job sources first, then create a job.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Tech</TableHead>
                    <TableHead className="text-right">Src</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    {canEdit && <TableHead></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id} className="cursor-pointer" onClick={() => canEdit && openEdit(j)}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>{j.client_name}</TableCell>
                      <TableCell>{j.technician_id ? techMap[j.technician_id] ?? "—" : "—"}</TableCell>
                      <TableCell>{j.job_source_id ? srcMap[j.job_source_id] ?? "—" : "—"}</TableCell>
                      <TableCell><Badge className={statusColors[j.status]}>{j.status}</Badge></TableCell>
                      <TableCell className="text-right">${Number(j.actual_amount ?? j.amount).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-blue-600">${Number(j.technician_payout).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-orange-600">${Number(j.job_source_payout).toFixed(2)}</TableCell>
                      <TableCell className="text-right text-green-600 font-medium">${Number(j.company_profit).toFixed(2)}</TableCell>
                      {canEdit && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost"><Trash2 className="h-3 w-3" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete job?</AlertDialogTitle>
                                <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => del.mutate(j.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Job" : "New Job"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AC Repair" /></div>
              <div><Label>Client name *</Label><Input value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} /></div>
            </div>
            <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Technician</Label>
                <Select value={form.technician_id || "none"} onValueChange={(v) => setForm({ ...form, technician_id: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {techs.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.payment_type === "percentage" ? `${t.payment_rate}%` : `$${t.payment_rate}`})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job source</Label>
                <Select value={form.job_source_id || "none"} onValueChange={(v) => setForm({ ...form, job_source_id: v === "none" ? "" : v })}>
                  <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {sources.filter((s) => s.is_active).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.payment_type === "percentage" ? `${s.payment_value}%` : `$${s.payment_value}`})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Scheduled date</Label><Input type="datetime-local" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quoted amount</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              <div><Label>Actual collected</Label><Input type="number" value={form.actual_amount} onChange={(e) => setForm({ ...form, actual_amount: e.target.value })} placeholder="Leave blank to use quoted" /></div>
            </div>

            <Card className="bg-muted/40">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-2">Live payout preview</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-xs text-muted-foreground">Technician</p><p className="text-lg font-bold text-blue-600">${preview.tech.toFixed(2)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Job source</p><p className="text-lg font-bold text-orange-600">${preview.src.toFixed(2)}</p></div>
                  <div><p className="text-xs text-muted-foreground">Company keeps</p><p className="text-lg font-bold text-green-600">${preview.profit.toFixed(2)}</p></div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Payment status</Label>
                <Select value={form.payment_status} onValueChange={(v) => setForm({ ...form, payment_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Payment method</Label><Input value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} placeholder="Cash, card, Zelle…" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!form.title || !form.client_name}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
