import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { createMediaUpload, registerMediaAsset, listMediaAssets, deleteMediaAsset } from "@/lib/admin/media.functions";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
});

function MediaLibrary() {
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["media", kind], queryFn: () => listMediaAssets({ data: { kind } }) });
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setBusy(true); setMsg(null);
    try {
      const isVideo = file.type.startsWith("video/");
      const k = isVideo ? "video" : "image";
      const { signedUrl, path } = await createMediaUpload({
        data: { kind: k, filename: file.name, mime: file.type, size: file.size },
      });
      const up = await fetch(signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!up.ok) throw new Error("Upload failed");
      await registerMediaAsset({ data: { kind: k, path, mime: file.type, size: file.size } });
      setMsg("Uploaded");
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e: any) { setMsg(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  }

  const del = useMutation({
    mutationFn: (id: string) => deleteMediaAsset({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });

  return (
    <>
      <PageHeader
        title="Media library"
        subtitle="Upload images (≤10 MB) and videos (≤100 MB). URLs are reusable across the site."
        right={
          <div className="flex items-center gap-2">
            <select value={kind} onChange={(e) => setKind(e.target.value as any)}
              className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm">
              <option value="all">All</option><option value="image">Images</option><option value="video">Videos</option>
            </select>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={busy}
              className="rounded-md bg-amber-500 text-white px-4 py-2 text-sm disabled:opacity-50">
              {busy ? "Uploading…" : "Upload"}
            </button>
          </div>
        }
      />
      {msg && <p className="mb-3 text-sm text-neutral-600">{msg}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(list.data?.items ?? []).map((m: any) => (
          <div key={m.id} className="group rounded-xl border border-neutral-200 bg-white overflow-hidden">
            <div className="aspect-video bg-neutral-100 grid place-items-center overflow-hidden">
              {m.kind === "image" ? (
                <img src={m.public_url} alt={m.alt ?? ""} className="w-full h-full object-cover" />
              ) : (
                <video src={m.public_url} muted loop playsInline className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-3 text-xs">
              <div className="truncate text-neutral-700">{m.storage_path.split("/").slice(-1)[0]}</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <button onClick={() => navigator.clipboard.writeText(m.public_url)}
                  className="text-amber-700 hover:underline">Copy URL</button>
                <button onClick={() => del.mutate(m.id)} className="text-rose-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {!list.data?.items.length && (
          <div className="col-span-full p-12 text-center text-sm text-neutral-500 border border-dashed rounded-xl">
            No media yet. Upload your first asset.
          </div>
        )}
      </div>
    </>
  );
}
