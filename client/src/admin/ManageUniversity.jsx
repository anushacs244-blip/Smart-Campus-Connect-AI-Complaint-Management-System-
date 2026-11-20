/**
 * CampusConnect AI - Manage University Details Component (Admin)
 * Author: SPA
 */

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Building2, Save } from "lucide-react";

export default function ManageUniversity() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    chancellor: "",
    viceChancellor: "",
    location: "",
    establishedYear: "",
    accreditation: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    about: "",
    vision: "",
    mission: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  const loadUniversity = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/university");
      if (res.data) {
        setForm(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load university details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversity();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("/api/university", form, token);
      toast.success("University details saved successfully!");
      loadUniversity();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save university details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Loading university details...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="text-indigo-600 dark:text-indigo-400" size={28} />
        <div>
          <h3 className="text-xl font-bold">University & Campus Profile</h3>
          <p className="text-xs text-slate-500">
            Configure institutional details used by students and the AI Assistant knowledge base
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">University / College Name</label>
            <input
              type="text"
              required
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Institution Code</label>
            <input
              type="text"
              value={form.code || ""}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Chancellor</label>
            <input
              type="text"
              value={form.chancellor || ""}
              onChange={(e) => setForm({ ...form, chancellor: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Vice Chancellor (VC)</label>
            <input
              type="text"
              value={form.viceChancellor || ""}
              onChange={(e) => setForm({ ...form, viceChancellor: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Established Year</label>
            <input
              type="text"
              value={form.establishedYear || ""}
              onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Accreditation & Grading</label>
            <input
              type="text"
              value={form.accreditation || ""}
              onChange={(e) => setForm({ ...form, accreditation: e.target.value })}
              placeholder="e.g., NAAC A++ Grade, AICTE Approved"
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Official Website</label>
            <input
              type="text"
              value={form.website || ""}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://..."
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Contact Email</label>
            <input
              type="email"
              value={form.contactEmail || ""}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Contact Phone</label>
            <input
              type="text"
              value={form.contactPhone || ""}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Campus Location</label>
            <input
              type="text"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">About the University</label>
          <textarea
            rows={3}
            value={form.about || ""}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
          ></textarea>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Vision Statement</label>
            <textarea
              rows={2}
              value={form.vision || ""}
              onChange={(e) => setForm({ ...form, vision: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Mission Statement</label>
            <textarea
              rows={2}
              value={form.mission || ""}
              onChange={(e) => setForm({ ...form, mission: e.target.value })}
              className="w-full text-sm px-4 py-2.5 border rounded-xl outline-none bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition shadow disabled:bg-slate-400"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save University Details"}
        </button>
      </form>
    </div>
  );
}

