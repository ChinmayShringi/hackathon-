import { useEffect, useMemo, useRef, useState } from "react";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Asset, UploadItem, getCdnUrl } from "@/lib/types";

const MAX_SIZE_BYTES = 100 * 1024 * 1024;
const ACCEPTED_PREFIXES = ['image/', 'video/', 'audio/', 'application/pdf', 'application/vnd'];

function isAccepted(file: File): boolean {
  if (file.size > MAX_SIZE_BYTES) return false;
  if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/')) return true;
  // PDFs and common doc types
  if (file.type === 'application/pdf') return true;
  if (file.type.startsWith('application/vnd')) return true;
  return false;
}

const PLACEHOLDERS: Record<number, string> = {
  1: '/icons/icon-256x256.png', // image fallback
  2: '/icons/icon-256x256.png', // video textual fallback; border differentiates
  3: '/icons/icon-256x256.png', // audio fallback
  4: '/icons/icon-256x256.png', // doc fallback
};

export default function MediaLibrary() {
  const qc = useQueryClient();
  const [type, setType] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [queue, setQueue] = useState<UploadItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/media-library/assets", { type, page, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.set("type", String(type));
      params.set("page", String(page));
      if (search) params.set("search", search);
      const res = await apiRequest("GET", `/api/media-library/assets?${params.toString()}`);
      return res.json();
    },
    placeholderData: keepPreviousData,
  });

  // WS live update for thumbnail_ready
  const { subscribeToMessage } = useWebSocket();
  useEffect(() => {
    return subscribeToMessage('thumbnail_ready', () => {
      qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] });
    });
  }, [subscribeToMessage]);

  // Polling fallback: for assets missing thumbnail, requery after a delay
  useEffect(() => {
    if (!data?.assets) return;
    const missing = (data.assets as Asset[]).some((a) => a.assetType === 2 && !a.thumbnailUrl);
    if (!missing) return;
    const id = setTimeout(() => qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] }), 5000);
    return () => clearTimeout(id);
  }, [data?.assets]);

  const processQueue = async () => {
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status !== 'queued') continue;
      try {
        setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, status: 'uploading', progress: 5, message: undefined } : it)));
        const file = item.file;
        const assetType = file.type.startsWith("video/") ? 2 : file.type.startsWith("audio/") ? 3 : file.type.startsWith("application/") ? 4 : 1;
        const presignRes = await apiRequest("POST", `/api/media-library/upload-url`, {
          filename: file.name,
          mimeType: file.type,
          assetType,
        });
        const presign = await presignRes.json();
        const xhr = new XMLHttpRequest();
        setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, xhr } : it)));
        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, progress: Math.max(5, Math.min(95, pct)) } : it)));
            }
          };
          xhr.onload = () => resolve();
          xhr.onerror = () => reject(new Error('Upload failed'));
          xhr.onabort = () => reject(new Error('Upload canceled'));
          xhr.open('PUT', presign.presign.url, true);
          Object.entries(presign.presign.headers || {}).forEach(([k, v]) => xhr.setRequestHeader(k, String(v)));
          xhr.send(file);
        });
        setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, status: 'finalizing', progress: 96 } : it)));
        await apiRequest("POST", `/api/media-library/finalize`, {
          assetId: presign.assetId,
          s3Key: presign.s3KeyPlanned,
          originalFilename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          assetType,
          cdnUrl: presign.cdnPreview,
        });
        setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, status: 'done', progress: 100, xhr: null } : it)));
      } catch (e: any) {
        const msg = e?.message || 'Error';
        const wasCanceled = msg.toLowerCase().includes('canceled');
        setQueue((q) => q.map((it, idx) => (idx === i ? { ...it, status: wasCanceled ? 'canceled' : 'error', message: msg } : it)));
      }
    }
    qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] });
  };

  useEffect(() => {
    if (queue.some((q) => q.status === 'queued')) {
      processQueue();
    }
  }, [queue]);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => { e.preventDefault(); el.classList.add('ring-2', 'ring-accent-blue'); };
    const onDragLeave = () => { el.classList.remove('ring-2', 'ring-accent-blue'); };
    const onDrop = (e: DragEvent) => {
      e.preventDefault(); el.classList.remove('ring-2', 'ring-accent-blue');
      const files = Array.from(e.dataTransfer?.files || []);
      addFiles(files);
    };
    el.addEventListener('dragover', onDragOver);
    el.addEventListener('dragleave', onDragLeave);
    el.addEventListener('drop', onDrop);
    return () => {
      el.removeEventListener('dragover', onDragOver);
      el.removeEventListener('dragleave', onDragLeave);
      el.removeEventListener('drop', onDrop);
    };
  }, []);

  const addFiles = (files: File[]) => {
    const errors: string[] = [];
    const accepted = files.filter((f) => {
      if (!isAccepted(f)) {
        errors.push(`${f.name}: unsupported type or > 100MB`);
        return false;
      }
      return true;
    });
    if (errors.length) setValidationErrors(errors);
    if (accepted.length) setQueue((q) => [...q, ...accepted.map((f) => ({ file: f, status: 'queued' as const, progress: 0, xhr: null }))]);
  };

  const addFilesFromPicker = (files: FileList | null) => {
    if (!files?.length) return;
    addFiles(Array.from(files));
  };

  const cancelItem = (idx: number) => {
    setQueue((q) => {
      const it = q[idx];
      try { it?.xhr?.abort?.(); } catch {}
      const copy = [...q];
      copy[idx] = { ...it, status: 'canceled', message: 'Canceled by user', xhr: null };
      return copy;
    });
  };

  const retryItem = (idx: number) => {
    setQueue((q) => {
      const it = q[idx];
      const copy = [...q];
      copy[idx] = { ...it, status: 'queued', progress: 0, message: undefined, xhr: null };
      return copy;
    });
  };

  const assets: Asset[] = data?.assets || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1 };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Media Library</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Input placeholder="Search..." value={search} onChange={async (e) => {
                const v = e.target.value;
                setSearch(v); setPage(1);
                if (v.length >= 2) {
                  try {
                    const sRes = await apiRequest("GET", `/api/media-library/search-suggestions?q=${encodeURIComponent(v)}`);
                    const s = await sRes.json();
                    setSuggestions(s.suggestions || []);
                  } catch { setSuggestions([]); }
                } else {
                  setSuggestions([]);
                }
              }} className="w-64" />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-64 bg-zinc-900 border border-zinc-700 rounded shadow">
                  {suggestions.map((s) => (
                    <div key={s} className="px-2 py-1 hover:bg-zinc-800 cursor-pointer" onClick={() => { setSearch(s); setSuggestions([]); }}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" className="hidden" multiple onChange={(e) => addFilesFromPicker(e.target.files)} />
            <Button onClick={() => fileInputRef.current?.click()}>Upload</Button>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="mb-4 text-xs text-red-400 space-y-1">
            {validationErrors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}

        <div ref={dropRef} className="border-2 border-dashed border-zinc-700 rounded-md p-6 mb-6 text-center text-sm text-gray-400">
          Drag & drop files here to upload (images, videos, audio, docs)
        </div>

        {queue.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-300 mb-2">Upload Queue</div>
            <div className="space-y-2">
              {queue.map((q, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="truncate w-1/2">{q.file.name}</div>
                  <div className="w-48 bg-zinc-800 rounded h-2 overflow-hidden">
                    <div className="bg-accent-blue h-2" style={{ width: `${q.progress}%` }} />
                  </div>
                  <div className="w-16 text-right text-gray-400">{q.progress}%</div>
                  <div className="w-24 text-gray-500">{q.status}</div>
                  {q.status === 'uploading' && (
                    <Button size="sm" variant="outline" onClick={() => cancelItem(i)}>Cancel</Button>
                  )}
                  {(q.status === 'error' || q.status === 'canceled') && (
                    <Button size="sm" variant="outline" onClick={() => retryItem(i)}>Retry</Button>
                  )}
                  {q.status === 'error' && <div className="text-red-400">{q.message}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <Tabs value={String(type ?? 0)} onValueChange={(v) => { setType(Number(v) || undefined); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="0">All</TabsTrigger>
            <TabsTrigger value="1">Images</TabsTrigger>
            <TabsTrigger value="2">Videos</TabsTrigger>
            <TabsTrigger value="3">Audio</TabsTrigger>
            <TabsTrigger value="4">Docs</TabsTrigger>
          </TabsList>
          <TabsContent value={String(type ?? 0)}>
            {isLoading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {assets.map((a) => (
                  <Card key={a.assetId} className={`bg-zinc-900 ${a.assetType === 2 ? 'border-2 border-blue-600' : a.assetType === 3 || a.assetType === 4 ? 'border border-zinc-600' : ''}`}>
                    <CardContent className="p-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="flex items-center gap-2 text-xs text-gray-400">
                          <input type="checkbox" checked={!!selected[a.assetId]} onChange={(e) => setSelected((m) => ({ ...m, [a.assetId]: e.target.checked }))} />
                          Select
                        </label>
                      </div>
                      <div className="aspect-square bg-zinc-800 mb-2 flex items-center justify-center overflow-hidden">
                        {a.assetType === 1 && (
                          <>
                            <img 
                              src={a.thumbnailUrl || getCdnUrl(a.cdnUrl, a.s3Key)} 
                              alt={a.displayName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-800">
                              <div className="text-center">
                                <div className="text-2xl mb-1">📁</div>
                                <div className="text-xs text-gray-500">Image</div>
                              </div>
                            </div>
                          </>
                        )}
                        {a.assetType === 2 && (
                          <img src={a.thumbnailUrl || PLACEHOLDERS[2]} alt={a.displayName} className="w-full h-full object-cover opacity-80" />
                        )}
                        {a.assetType === 3 && (
                          <div className="text-xs text-gray-400">Audio</div>
                        )}
                        {a.assetType === 4 && (
                          <div className="text-xs text-gray-400">Document</div>
                        )}
                      </div>
                      <div className="text-sm font-medium truncate" title={a.displayName}>{a.displayName}</div>
                      <div className="text-xs text-gray-500 truncate" title={a.originalFilename}>{a.originalFilename}</div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          const name = prompt('Rename display name', a.displayName) || a.displayName;
                          if (name && name !== a.displayName) apiRequest("PATCH", `/api/media-library/assets/${a.assetId}`, { displayName: name }).then(() => qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] }));
                        }}>Rename</Button>
                        <a href={getCdnUrl(a.cdnUrl, a.s3Key)} target="_blank" rel="noreferrer">
                          <Button size="sm">Open</Button>
                        </a>
                        <Button size="sm" variant="outline" onClick={async () => {
                          await apiRequest("POST", `/api/media-library/analyze/${a.assetId}`);
                          qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] });
                        }}>Analyze</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">Page {pagination.currentPage} / {pagination.totalPages}</div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={Object.values(selected).filter(Boolean).length === 0} onClick={async () => {
              const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
              await Promise.all(ids.map((id) => apiRequest(`/api/media-library/assets/${id}`, 'DELETE')));
              setSelected({});
              qc.invalidateQueries({ queryKey: ["/api/media-library/assets"] });
            }}>Delete Selected</Button>
            <Button variant="outline" disabled={pagination.currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button variant="outline" disabled={pagination.currentPage >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
