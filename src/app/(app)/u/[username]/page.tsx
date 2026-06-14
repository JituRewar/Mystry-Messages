"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { MessageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Sparkles, MessageSquareHeart, UserCheck, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const INITIAL_SUGGESTIONS = [
  "What is something or someone that always manages to brighten your day?",
  "Tell us about a memorable travel experience you've had.",
  "If you could learn any skill instantly, what would it be?"
];

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username;

  const [isSending, setIsSending] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  const content = watch("content");

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    if (!username) {
      toast.error("Invalid user profile link.");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      if (response.data.success) {
        toast.success("Message sent successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post<{ success: boolean; suggestions: string[] }>(
        "/api/suggest-messages"
      );
      if (response.data?.suggestions) {
        setSuggestions(response.data.suggestions);
        toast.success("Suggestions updated!");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast.error("Failed to fetch new suggestions. Using default prompts.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue("content", suggestion, { shouldValidate: true });
  };

  return (
    <div className="flex-1 bg-slate-900 text-white min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        
        {/* Page title */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <MessageSquareHeart className="h-3.5 w-3.5" />
            <span>Public Message Box</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-indigo-200 to-white">
            Send Anonymous Message
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Say something nice, ask a question, or leave honest feedback. Completely anonymous!
          </p>
        </div>

        {/* Message Input Card */}
        <Card className="bg-slate-950/65 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <CardHeader className="p-0 space-y-1">
            <div className="flex items-center gap-2 text-slate-300">
              <UserCheck className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Recipient Profile</span>
            </div>
            <CardTitle className="text-lg font-bold text-white">
              To: @{username || "user"}
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <textarea
                placeholder="Write your anonymous message here..."
                {...register("content")}
                className={`w-full p-4 min-h-30 rounded-xl bg-slate-950/80 border text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 resize-none font-sans text-sm ${
                  errors.content
                    ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500"
                    : "border-slate-800 focus:ring-purple-500/30 focus:border-purple-500/80"
                }`}
              />
              {errors.content ? (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1 font-medium">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{errors.content.message}</span>
                </div>
              ) : (
                <div className="text-right text-slate-500 text-xs font-medium">
                  {content ? content.length : 0} / 300 characters
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-11 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send It Anonymously</span>
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* AI Suggest Messages Card */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                <span>AI Message Suggestions</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1">
                Click on any message below to select it.
              </p>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={fetchSuggestions}
              disabled={isSuggesting}
              className="h-9 px-4 rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              {isSuggesting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  <span>Suggesting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Suggest Messages</span>
                </>
              )}
            </Button>
          </div>

          {/* Suggestions List in a card frame */}
          <div className="bg-slate-950/45 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-xl backdrop-blur-xl">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              Selectable Suggestions
            </h3>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-4 rounded-xl bg-slate-900/40 border border-slate-855 hover:border-purple-500/40 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-all duration-300 text-sm cursor-pointer shadow-xs active:scale-[0.99] group flex justify-between items-center gap-4"
                >
                  <span className="leading-relaxed">{suggestion}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800/60" />

        {/* Account promotion block */}
        <div className="bg-slate-950/45 border border-slate-800/80 rounded-2xl p-6 text-center space-y-4 shadow-xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-purple-600/5 to-transparent pointer-events-none" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-200">Want to receive anonymous messages too?</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
              Create your own mystery link, share it on your social bios, and read what people really think!
            </p>
          </div>
          <Link href="/sign-up" className="inline-block">
            <Button
              variant="outline"
              className="h-9 px-5 rounded-lg bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white transition-all cursor-pointer text-xs flex items-center justify-center gap-1.5"
            >
              <span>Get Your Own Message Board</span>
              <ArrowRight className="h-3.5 w-3.5 text-purple-400" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
