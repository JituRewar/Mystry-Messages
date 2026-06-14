"use client";

import { Message } from "@/model/User";
import { AccecptMessageSchema } from "@/schemas/accepetMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CardMessage from "@/components/ui/CardMessage";
import { Loader2, RefreshCw, Copy, Check, ExternalLink, Inbox, Shield } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [profileURL, setProfileURL] = useState("");

  const { data: session, status } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => (message._id as any) !== messageId),
    );
  };

  const form = useForm({
    resolver: zodResolver(AccecptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("accecptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("accecptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "failed to fetch message settings",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);
      try {
        const response = await axios.get("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success("showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "failed to fetch messages",
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  const user = session?.user as User;
  const username = user?.username;

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      const baseURL = `${window.location.protocol}//${window.location.host}`;
      setProfileURL(`${baseURL}/u/${username}`);
    }
  }, [username]);

  //handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessages
      });
      setValue('accecptMessages', !acceptMessages);
      toast.success(
        response?.data.message || "Handle Switched",
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "failed to switch handle",
      );
    }
  };

  // copy to clipboard
  const copyToClipboard = () => {
    if (!profileURL) return;
    navigator.clipboard.writeText(profileURL);
    setIsCopied(true);
    toast.success("Profile URL copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-slate-900 text-white min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl opacity-50 pointer-events-none" />
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin relative z-10" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-slate-900 text-white px-4 min-h-[calc(100vh-4rem)] relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl opacity-50 pointer-events-none" />
        
        <div className="w-full max-w-md p-8 bg-slate-950/65 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-purple-600/10 rounded-full border border-purple-500/20 mb-2">
            <Shield className="h-10 w-10 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Access Denied</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Please log in to access your mystery message dashboard and view your messages.
          </p>
          <Link href="/sign-in" className="block w-full">
            <Button className="w-full h-10 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md transition-all cursor-pointer rounded-lg">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-900 text-white min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto space-y-8 p-6 sm:p-8 bg-slate-950/65 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-indigo-200 to-white">
              User Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your profile link and read your anonymous messages
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            disabled={isLoading}
            className="h-10 px-4 self-start sm:self-auto bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer rounded-lg flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            ) : (
              <RefreshCw className="h-4 w-4 text-purple-400" />
            )}
            <span>Refresh Messages</span>
          </Button>
        </div>

        <Separator className="bg-slate-800/80" />

        {/* Dashboard Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Unique Link Copy Card */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4 shadow-md">
            <div>
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Your Unique Feedback Link
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Share this link on your social media to receive anonymous messages.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={profileURL}
                  readOnly
                  className="w-full h-10 pr-10 bg-slate-950/80 border-slate-800/80 text-purple-300 placeholder-slate-500 font-mono text-sm selection:bg-purple-500/30 rounded-lg"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Link"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none h-10 px-5 rounded-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </Button>
                
                {profileURL && (
                  <a 
                    href={profileURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none"
                  >
                    <Button 
                      variant="outline"
                      className="w-full h-10 px-4 rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4 text-purple-400" />
                      <span className="sm:hidden lg:inline">View Profile</span>
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Settings Toggle Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 flex flex-col justify-between shadow-md">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Receiving Settings
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Toggle message reception to turn your anonymous inbox on or off.
              </p>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">
                  Accept Messages
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                  Status: {acceptMessages ? (
                    <span className="text-green-400">On</span>
                  ) : (
                    <span className="text-rose-400">Off</span>
                  )}
                </span>
              </div>
              <Switch
                {...register('accecptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="cursor-pointer"
              />
            </div>
          </div>

        </div>

        <Separator className="bg-slate-800/80" />

        {/* Messages section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Anonymous Inbox
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
              {messages.length} {messages.length === 1 ? "Message" : "Messages"}
            </span>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((message) => (
                <CardMessage
                  key={(message._id as any).toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-dashed border-slate-800 rounded-xl text-center space-y-4">
              <div className="p-4 bg-slate-950/50 rounded-full border border-slate-800/80">
                <Inbox className="h-8 w-8 text-slate-600 animate-pulse" />
              </div>
              <div className="max-w-sm space-y-1">
                <h3 className="text-lg font-semibold text-slate-300">No messages yet</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  You haven&apos;t received any anonymous messages yet. Copy your unique link and share it to get started!
                </p>
              </div>
              <Button 
                onClick={copyToClipboard}
                variant="outline"
                className="h-9 px-4 rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-2 text-xs"
              >
                <Copy className="h-3.5 w-3.5 text-purple-400" />
                <span>Copy Share Link</span>
              </Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Page;
