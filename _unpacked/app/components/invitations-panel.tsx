import { useEffect, useState } from "react";

const PROJECT_REF = "aqvgmrpjkhsazihndccx";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdmdtcnBqa2hzYXppaG5kY2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDA4MzYsImV4cCI6MjA4NTExNjgzNn0.sexkodMncOQL7Exrd2g4QHPhWrsN7J3Twfxj0ChiN-s";


const BASE_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/make-server-c7f3f823`;

type Invitation = {
  id: string;
  email: string;
  hostel_name: string;
  status: string;
};

const buildHeaders = (token: string, json = false) => ({
  Authorization: `Bearer ${token}`,
  apikey: ANON_KEY,
  ...(json ? { "Content-Type": "application/json" } : {}),
});

export default function InvitationsPanel({ accessToken }: { accessToken: string }) {
  const [items, setItems] = useState<Invitation[]>([]);

  const load = async () => {
    const res = await fetch(`${BASE_URL}/admin/invitations/my`, {
      headers: buildHeaders(accessToken),
    });
    const json = await res.json();
    setItems(json.invitations || []);
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id: string, action: "accept" | "reject") => {
    await fetch(`${BASE_URL}/admin/invitations/${id}/${action}`, {
      method: "POST",
      headers: buildHeaders(accessToken, true),
    });
    load();
  };

  return (
    <div className="rounded-xl border p-4">
      <h3 className="mb-3 font-semibold">Invitațiile mele</h3>

      {items.map((i) => (
        <div key={i.id} className="mb-2 rounded border p-2">
          <div className="text-sm font-medium">{i.email}</div>
          <div className="text-xs opacity-70">
            {i.hostel_name} – {i.status}
          </div>

          {i.status === "pending" && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => act(i.id, "reject")}
                className="rounded border px-2 py-1 text-sm"
              >
                Respinge
              </button>
              <button
                onClick={() => act(i.id, "accept")}
                className="rounded bg-primary px-2 py-1 text-sm text-primary-foreground"
              >
                Acceptă
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
