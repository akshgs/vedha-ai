import type { Conversation } from "@/services/messages";
import PresenceIndicator from "./PresenceIndicator";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  return (
    <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
      {conversations.map((conv) => {
        const isSelected = selectedId === conv.id;
        return (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition select-none ${
              isSelected
                ? "border-cyan-500 bg-cyan-500/5 text-cyan-300 shadow-inner"
                : "border-slate-850 bg-slate-900/20 text-slate-350 hover:border-slate-750 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">
                  {conv.recipient.name[0]}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <PresenceIndicator status={conv.recipient.presence} size="sm" />
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{conv.recipient.name}</h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
              </div>
            </div>

            <div className="text-right shrink-0 ml-2">
              <span className="text-[8px] text-slate-600 block">{conv.timestamp}</span>
              {conv.unreadCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[8px] font-black text-white mt-1">
                  {conv.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
