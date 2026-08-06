import { useState } from "react";
import { Users, ShieldCheck, Trash2, Mail, Briefcase } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import Card from "@/components/ui/card/Card";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/input/Input";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: "Recruiter" | "Manager" | "Admin";
  status: "Active" | "Pending";
}

export default function Employees() {
  const [team, setTeam] = useState<TeamMember[]>([
    { id: 1, name: "Amit Shah", email: "amit.shah@company.com", role: "Recruiter", status: "Active" },
    { id: 2, name: "Neha Sen", email: "neha.sen@company.com", role: "Manager", status: "Active" },
    { id: 3, name: "Pranav M.", email: "pranav.m@company.com", role: "Recruiter", status: "Pending" },
  ]);

  // Form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Recruiter" | "Manager" | "Admin">("Recruiter");

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Please provide name and email.");
      return;
    }
    const mock: TeamMember = {
      id: Math.floor(Math.random() * 1000),
      name,
      email,
      role,
      status: "Pending",
    };
    setTeam([...team, mock]);
    setName("");
    setEmail("");
    toast.success(`Invitation dispatched to ${email}!`);
  }

  function handleRemove(id: number) {
    setTeam(team.filter((member) => member.id !== id));
    toast.info("Team member access revoked.");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="text-cyan-400" />
            Corporate Team Directory
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Manage company recruiter accounts, invite hiring managers, and configure permission levels.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            <Card variant="glass" className="p-6">
              <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Active Team Registry</h3>
              <div className="space-y-4">
                {team.map((member) => (
                  <div key={member.id} className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    <div>
                      <h4 className="font-bold text-white text-sm">{member.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Mail size={12} /> {member.email}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1"><Briefcase size={10} /> Role: {member.role}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        member.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {member.status}
                      </span>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="text-slate-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Invitation wizard */}
          <div>
            <Card variant="glass" className="p-6 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2 mb-4">Invite Team Member</h3>
              <form onSubmit={handleInvite} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  placeholder="e.g. john.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Permission Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Recruiter">Recruiter</option>
                    <option value="Manager">Hiring Manager</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <Button type="submit" className="w-full flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} />
                  Send Invitation
                </Button>
              </form>
            </Card>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
