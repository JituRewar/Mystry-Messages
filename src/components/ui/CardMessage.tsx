"use client";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./button";
import { X, Clock } from "lucide-react";
import { Message } from "@/model/User";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProp = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const CardMessage = ({message, onMessageDelete}: MessageCardProp) => {

    const handleDeleteConfirm = async () => {
       try {
           const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
           toast.success(response.data.message || "Message Deleted Successfully")
           onMessageDelete((message._id as any).toString())
       } catch (error) {
           console.error("Error deleting message:", error)
           toast.error("Failed to delete message")
       }
    }

    return (
    <Card className="border border-slate-800/80 bg-slate-900/30 hover:bg-slate-900/60 transition-all duration-300 shadow-md hover:shadow-lg hover:border-purple-500/30 rounded-xl group/msgcard relative overflow-hidden">
      {/* Subtle corner accent on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-purple-600/10 to-transparent opacity-0 group-hover/msgcard:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <CardHeader className="p-5">
        <CardTitle className="text-slate-100 font-medium wrap-break-word leading-relaxed pr-8 text-base">
          {message.content}
        </CardTitle>
        
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 bg-rose-950/20 hover:bg-rose-600 border border-rose-500/10 text-rose-300 hover:text-white transition-all cursor-pointer rounded-lg shadow-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-950 border border-slate-800 text-slate-100 max-w-[90vw] sm:max-w-md rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400 text-sm">
                  Are you sure you want to delete this message? This action is permanent and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 mt-4">
                <AlertDialogCancel className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer rounded-lg">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteConfirm} 
                  className="bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer rounded-lg"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
        
        <CardDescription className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-normal">
          <Clock className="h-3.5 w-3.5 text-slate-600" />
          <span>
            {new Date(message.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default CardMessage;
