import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Mail,
  Calendar,
  Trash2,
  CheckCheck,
  Circle,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";
import GlassCard from "../components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export default function AdminMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => base44.entities.ContactMessage.list("-created_date", 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      base44.entities.ContactMessage.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast({
        description: "Message deleted",
        variant: "default",
      });
      setDeleteId(null);
    },
  });

  const markAsRead = (message) => {
    if (message.status === "unread") {
      updateMutation.mutate({ id: message.id, data: { status: "read" } });
    }
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    markAsRead(message);
  };

  const unreadCount =
    messages?.filter((m) => m.status === "unread").length || 0;

  const statusColors = {
    unread: "bg-amber-500/20 text-amber-400",
    read: "bg-slate-700/50 text-slate-400",
    replied: "bg-green-500/20 text-green-400",
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Messages
          </h1>
          <p className="text-slate-400 mt-1">
            {messages?.length || 0} messages • {unreadCount} unread
          </p>
        </div>

        {/* Messages List */}
        <GlassCard className="overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : messages?.length > 0 ? (
            <div className="divide-y divide-slate-800">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => openMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                    message.status === "unread" ? "bg-slate-800/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.status === "unread"
                          ? "bg-gradient-to-br from-amber-500 to-yellow-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          message.status === "unread"
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {message.name?.[0]?.toUpperCase() || "A"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`font-medium truncate ${
                            message.status === "unread"
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        >
                          {message.name}
                        </span>
                        <Badge
                          className={`${statusColors[message.status || "unread"]} border-0 text-xs`}
                        >
                          {message.status || "unread"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 truncate">
                        {message.email}
                      </p>
                      {message.subject && (
                        <p
                          className={`text-sm mt-1 truncate ${
                            message.status === "unread"
                              ? "text-white font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {message.subject}
                        </p>
                      )}
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-slate-500 hidden sm:block">
                        {message.created_date
                          ? format(new Date(message.created_date), "MMM d")
                          : ""}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(message);
                            }}
                            className="cursor-pointer"
                          >
                            <CheckCheck className="w-4 h-4 mr-2" /> Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${message.email}`;
                            }}
                            className="cursor-pointer"
                          >
                            <Mail className="w-4 h-4 mr-2" /> Reply via Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(message.id);
                            }}
                            className="text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No messages yet</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-900">
                    {selectedMessage.name?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {selectedMessage.name}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              {selectedMessage.subject && (
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <p className="text-xs text-slate-500 mb-1">Subject</p>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-800/50">
                <p className="text-xs text-slate-500 mb-2">Message</p>
                <p className="text-slate-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedMessage.created_date
                    ? format(
                        new Date(selectedMessage.created_date),
                        "MMMM d, yyyy at h:mm a",
                      )
                    : "Unknown date"}
                </span>
                <Badge
                  className={`${statusColors[selectedMessage.status || "unread"]} border-0`}
                >
                  {selectedMessage.status || "unread"}
                </Badge>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                  className="flex-1"
                >
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                    <Mail className="w-4 h-4 mr-2" />
                    Reply via Email
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMessage(null);
                    setDeleteId(selectedMessage.id);
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Message
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleteId)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
