import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Save, X, Activity, MousePointerClick, Eye, Lock } from "lucide-react";

interface Ad {
  id: number;
  title: string;
  type: string;
  imageUrl: string;
  targetUrl: string;
  position: string;
  isActive: number;
  impressions: number;
  clicks: number;
  createdAt: string;
  customCode?: string;
}

export function Admin() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Ad>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");

  const fetchAds = async () => {
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      if (data.success) {
        setAds(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch ads", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAds();
    }
  }, [isAuthenticated]);

  const handleSave = async (id?: number) => {
    try {
      const url = id ? `/api/admin/ads/${id}` : "/api/admin/ads";
      const method = id ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      
      setIsEditing(null);
      setIsCreating(false);
      setEditForm({});
      fetchAds();
    } catch (e) {
      console.error("Failed to save ad", e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
      fetchAds();
    } catch (e) {
      console.error("Failed to delete ad", e);
    }
  };

  const startEdit = (ad: Ad) => {
    setIsEditing(ad.id);
    setEditForm(ad);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setIsEditing(null);
    setEditForm({
      title: "",
      type: "banner",
      imageUrl: "",
      targetUrl: "",
      position: "top",
      isActive: 1,
      customCode: ""
    });
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setIsCreating(false);
    setEditForm({});
  };

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
    } else {
      alert("Password salah!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 p-4 rounded-full">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-red-500 outline-none transition-all"
                placeholder="Masukkan password..."
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-2"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">Ad Management</h1>
            <p className="text-slate-400 font-medium">Manage your banner, direct, and third-party script advertisements</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
            <button 
              onClick={startCreate}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-red-600/20"
            >
              <Plus className="w-5 h-5" />
              Create New Ad
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <Eye className="w-5 h-5" />
              <h3 className="font-medium">Total Impressions</h3>
            </div>
            <p className="text-3xl font-bold">{totalImpressions.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <MousePointerClick className="w-5 h-5" />
              <h3 className="font-medium">Total Clicks</h3>
            </div>
            <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <Activity className="w-5 h-5" />
              <h3 className="font-medium">Average CTR</h3>
            </div>
            <p className="text-3xl font-bold">{ctr}%</p>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || isEditing !== null) && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-bold mb-4">{isCreating ? "Create New Ad" : "Edit Ad"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input 
                  type="text" 
                  value={editForm.title || ""} 
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="e.g., Summer Sale Banner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                <select 
                  value={editForm.type || "banner"} 
                  onChange={e => setEditForm({...editForm, type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="banner">Banner Image</option>
                  <option value="direct">Direct Link / Text</option>
                  <option value="script">Custom Script (AdSense, MGID, etc.)</option>
                </select>
              </div>
              
              {editForm.type !== "script" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Target URL</label>
                    <input 
                      type="text" 
                      value={editForm.targetUrl || ""} 
                      onChange={e => setEditForm({...editForm, targetUrl: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                  {editForm.type === "banner" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
                      <input 
                        type="text" 
                        value={editForm.imageUrl || ""} 
                        onChange={e => setEditForm({...editForm, imageUrl: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  )}
                </>
              )}

              {editForm.type === "script" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Custom HTML / JS Code</label>
                  <textarea 
                    value={editForm.customCode || ""} 
                    onChange={e => setEditForm({...editForm, customCode: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm min-h-[150px]"
                    placeholder="<script async src='...'></script><ins class='adsbygoogle' ...></ins><script>...</script>"
                  />
                  <p className="text-xs text-slate-500 mt-1">Paste your third-party ad network code here (e.g., Google AdSense, MGID).</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Position</label>
                <select 
                  value={editForm.position || "top"} 
                  onChange={e => setEditForm({...editForm, position: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="top">Top Banner</option>
                  <option value="bottom">Bottom Banner</option>
                  <option value="player_overlay">Player Overlay</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input 
                    type="checkbox" 
                    checked={editForm.isActive === 1} 
                    onChange={e => setEditForm({...editForm, isActive: e.target.checked ? 1 : 0})}
                    className="w-5 h-5 rounded border-slate-800 text-red-600 focus:ring-red-600 bg-slate-950"
                  />
                  <span className="text-sm font-medium text-slate-300">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={cancelEdit}
                className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave(isEditing || undefined)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Ad
              </button>
            </div>
          </div>
        )}

        {/* Ads List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-slate-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Ad Details</th>
                  <th className="px-6 py-4">Type / Position</th>
                  <th className="px-6 py-4">Performance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading ads...</td>
                  </tr>
                ) : ads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No ads found. Create one to get started.</td>
                  </tr>
                ) : (
                  ads.map(ad => (
                    <tr key={ad.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white mb-1">{ad.title}</div>
                        {ad.type === 'script' ? (
                          <span className="text-xs text-slate-500">Custom Script</span>
                        ) : (
                          <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate max-w-[200px] block">
                            {ad.targetUrl}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="capitalize mb-1">{ad.type}</div>
                        <div className="text-xs text-slate-500 capitalize">{ad.position.replace('_', ' ')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div title="Impressions" className="flex items-center gap-1"><Eye className="w-3 h-3 text-slate-500"/> {ad.impressions}</div>
                          <div title="Clicks" className="flex items-center gap-1"><MousePointerClick className="w-3 h-3 text-slate-500"/> {ad.clicks}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ad.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'}`}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => startEdit(ad)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(ad.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
