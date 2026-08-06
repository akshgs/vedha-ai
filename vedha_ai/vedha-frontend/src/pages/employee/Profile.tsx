import { useState } from "react";
import { Shield, Mail, Award, BookOpen, Save } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("Vedha Resident AI Mentor assisting team upskilling programs.");
  const [skills, setSkills] = useState("FastAPI, React, Deep Learning, DevOps");
  const [company, setCompany] = useState("Vedha AI");
  const [isEditing, setIsEditing] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Employee profile details updated!");
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8 font-sans">
        <div>
          <h1 className="text-3xl font-bold">Employee Profile</h1>
          <p className="mt-2 text-slate-400">
            Manage your professional mentor details and skill credentials.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Info Column */}
          <div className="md:col-span-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm space-y-6 flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 font-extrabold text-4xl text-white shadow-lg">
              {user?.name?.charAt(0).toUpperCase() ?? "E"}
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{user?.name ?? "Employee"}</h2>
              <p className="text-xs text-violet-400 font-bold uppercase tracking-wider mt-1">{user?.role}</p>
            </div>

            <div className="w-full border-t border-slate-800 pt-6 space-y-3 text-left text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-violet-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-violet-400" />
                <span>Account Status: Active</span>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-2 space-y-6">
            {isEditing ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Edit Details</h3>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Team</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Bio / Role Description</label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-white outline-none focus:border-violet-500 resize-none"
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
                    <Button type="submit" className="bg-violet-600 hover:bg-violet-500 flex items-center gap-1.5">
                      <Save size={14} />
                      Save Profile
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="text-violet-400" size={18} />
                    Mentor Credentials
                  </h3>
                  <Button onClick={() => setIsEditing(true)} className="text-xs bg-violet-600 hover:bg-violet-500">
                    Edit Profile
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company / Team</h4>
                    <p className="text-sm font-semibold text-white mt-1">{company}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Me / Bio</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1 whitespace-pre-line">{bio}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Technical Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.split(",").map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 text-xs text-violet-300 font-semibold"
                        >
                          <BookOpen size={10} />
                          {s.trim()}
                        </span>
                      ))}
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
