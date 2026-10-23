import { createClient } from "@/lib/supabase/server";
import MessagesInbox, { MessageItem } from "./MessagesInbox";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  let messageList: MessageItem[] = [];
  try {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) messageList = data;
  } catch {
    // fallback
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Messages Inbox</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review inquiries, project requests, and messages submitted via the public contact form.
        </p>
      </div>

      <MessagesInbox initialMessages={messageList} />
    </div>
  );
}
