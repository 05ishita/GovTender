import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  MessageCircle,
  Send,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const Messages = () => {
  const { user } = useAuth();
  const { userId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadConversations = async () => {
    try {
      const response = await api.get("/messages");
      setConversations(response.data.conversations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load conversations."
      );
    }
  };

  const loadConversation = async (id) => {
    try {
      const response = await api.get(`/messages/${id}`);

      setSelectedUser(response.data.user);
      setMessages(response.data.messages || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load conversation."
      );
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await loadConversations();

      if (userId) {
        await loadConversation(userId);
      }

      setLoading(false);
    };

    load();
  }, [userId]);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!text.trim() || !selectedUser) return;

    try {
      setSending(true);

      const response = await api.post("/messages", {
        receiverId: selectedUser._id,
        message: text.trim(),
      });

      setMessages((current) => [
        ...current,
        response.data.message,
      ]);

      setText("");
      await loadConversations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={35} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Communication
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Messages
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Communicate directly with contractors and bid writers.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid min-h-[600px] overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-[300px_1fr]">
        <aside className="border-b border-slate-200 lg:border-b-0 lg:border-r">
          <div className="border-b p-4">
            <h2 className="font-bold">Conversations</h2>
          </div>

          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="mx-auto text-slate-300" size={35} />
              <p className="mt-3 text-sm text-slate-500">
                No conversations yet.
              </p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Link
                key={conversation.user._id}
                to={`/messages/${conversation.user._id}`}
                className={`block border-b p-4 hover:bg-slate-50 ${
                  selectedUser?._id === conversation.user._id
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                    {conversation.user.name
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">
                      {conversation.user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {conversation.lastMessage?.message}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </aside>

        <section className="flex min-h-[600px] flex-col">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-3 border-b p-4">
                <Link
                  to="/messages"
                  className="lg:hidden"
                >
                  <ArrowLeft size={18} />
                </Link>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                  {selectedUser.name
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <div>
                  <h2 className="font-bold">
                    {selectedUser.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedUser.role}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-5">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <UserRound className="mx-auto text-slate-300" size={40} />
                      <p className="mt-3 text-sm text-slate-500">
                        Start the conversation.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const mine =
                      String(message.sender?._id) ===
                      String(user?._id);

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          mine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                            mine
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-800 shadow-sm"
                          }`}
                        >
                          {message.message}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="flex gap-3 border-t bg-white p-4"
              >
                <input
                  value={text}
                  onChange={(event) =>
                    setText(event.target.value)
                  }
                  placeholder="Write a message..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <button
                  disabled={sending || !text.trim()}
                  className="rounded-xl bg-blue-600 px-5 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex h-full min-h-[600px] items-center justify-center text-center">
              <div>
                <MessageCircle
                  className="mx-auto text-slate-300"
                  size={55}
                />
                <h2 className="mt-4 text-lg font-bold">
                  Select a conversation
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choose a contractor or bid writer to start messaging.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
