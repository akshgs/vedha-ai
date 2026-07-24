import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Building, Save, RefreshCw, Globe, MapPin, Users } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { getCompanyProfile, createCompanyProfile, updateCompanyProfile, type CompanyProfile } from "@/services/company";

interface ProfileFormData {
  company_name: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  company_size: string;
  founded_year: number;
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>();

  async function loadProfile() {
    try {
      setLoading(true);
      const data = await getCompanyProfile();
      setProfile(data);
      // set values in form
      setValue("company_name", data.company_name);
      setValue("industry", data.industry);
      setValue("website", data.website ?? "");
      setValue("location", data.location);
      setValue("description", data.description);
      setValue("company_size", data.company_size);
      setValue("founded_year", data.founded_year ?? 2020);
      setIsEditMode(false);
    } catch (err: any) {
      console.log("Profile not found or failed to load. Will create standard new profile if needed.");
      // 404 implies profile does not exist yet.
      setIsEditMode(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function onSubmit(data: ProfileFormData) {
    try {
      const payload = {
        ...data,
        founded_year: Number(data.founded_year) || null,
        website: data.website ? data.website : null,
      };

      if (profile) {
        // Update Profile
        const updated = await updateCompanyProfile(payload);
        setProfile(updated);
        toast.success("Company profile updated successfully!");
      } else {
        // Create Profile
        const created = await createCompanyProfile(payload);
        setProfile(created);
        toast.success("Company profile created successfully!");
      }
      setIsEditMode(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.detail ?? "Failed to save company profile.");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin mr-2" />
          Loading company details...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="mt-2 text-slate-400">
              Manage your company information to attract qualified candidates.
            </p>
          </div>
          {profile && !isEditMode && (
            <Button onClick={() => setIsEditMode(true)} className="bg-emerald-600 hover:bg-emerald-500">
              Edit Details
            </Button>
          )}
        </div>

        {isEditMode ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-800 pb-4">
              <Building className="text-emerald-400" size={22} />
              <h2 className="text-lg font-bold">Company Information</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    {...register("company_name", { required: true })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Technology, Software Development"
                    {...register("industry")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://acme.org"
                    {...register("website")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, Karnataka"
                    {...register("location")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Company Size</label>
                  <select
                    {...register("company_size")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-emerald-500"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201-500">201 - 500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-300">Founded Year</label>
                  <input
                    type="number"
                    min={1800}
                    max={2026}
                    placeholder="2015"
                    {...register("founded_year")}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-300">About Company</label>
                <textarea
                  rows={4}
                  placeholder="Describe your company, products, work culture..."
                  {...register("description")}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3">
                {profile && (
                  <Button
                    type="button"
                    onClick={() => {
                      reset();
                      setIsEditMode(false);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2">
                  {isSubmitting ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl backdrop-blur-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 font-extrabold text-2xl text-white shadow-lg">
                {profile?.company_name?.charAt(0).toUpperCase() ?? "C"}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.company_name}</h2>
                <p className="text-sm text-emerald-400 mt-1">{profile?.industry || "Industry Not Specified"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-slate-800 py-6">
              <div className="flex items-center gap-3">
                <MapPin className="text-slate-400" size={18} />
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="text-sm font-semibold">{profile?.location || "Not Set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="text-slate-400" size={18} />
                <div>
                  <p className="text-xs text-slate-500">Website</p>
                  {profile?.website ? (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-emerald-400 hover:underline">
                      Visit Website
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-slate-400">Not Set</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-slate-400" size={18} />
                <div>
                  <p className="text-xs text-slate-500">Employees</p>
                  <p className="text-sm font-semibold">{profile?.company_size || "Not Set"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">About Us</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {profile?.description || "No description provided yet."}
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
