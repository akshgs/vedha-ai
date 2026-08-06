import { useState } from "react";
import { Shield, Mail, Key, Award, Save } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

export default function AdminProfile() {
  const { user } = useAuth();
  const [roleDesc, setRoleDesc] = useState("System Administrator managing portal entities.");
  const [isEditing, setIsEditing] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Administrator description saved!");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <p className="mt-2 text-slate-400">
            System administration details and operations credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Info Card */}
          <div className="md:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm flex flex-col items-center text-center space-y-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 font-extrabold text-4xl text-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{user?.name ?? "Administrator"}</h2>
              <p className="text-xs text-rose-400 font-bold uppercase tracking-wider mt-1">{user?.role}</p>
            </div>

            <div className="w-full border-t border-slate-800 pt-6 space-y-3 text-left text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-rose-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-rose-400" />
                <span>Ecosystem Status: Verified</span>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Edit Details</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description / Bio</label>
                    <textarea
                      rows={4}
                      value={roleDesc}
                      onChange={(e) => setRoleDesc(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-rose-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-rose-600 hover:bg-rose-500 flex items-center gap-1.5">
                      <Save size={14} />
                      Save Details
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="text-rose-400" size={18} />
                    Console Security Context
                  </h3>
                  <Button onClick={() => setIsEditing(true)} className="text-xs bg-rose-600 hover:bg-rose-500">
                    Edit Context
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Focus</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 whitespace-pre-line">{roleDesc}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Policies</h4>
                    <div className="grid gap-2 grid-cols-2">
                      <div className="bg-slate-950/45 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                        <Key size={14} className="text-rose-400" />
                        <span>Database Read / Write</span>
                      </div>
                      <div className="bg-slate-950/45 p-3 rounded-xl border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                        <Shield size={14} className="text-rose-400" />
                        <span>Recruiter Verification Access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
