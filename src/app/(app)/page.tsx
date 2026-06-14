'use client';

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "../../messages.json";
import { Shield, Share2, Zap, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

const Page = () => {
  const { data: session } = useSession();

  return (
    <main className="flex-1 bg-slate-900 text-white min-h-[calc(100vh-4rem)] relative overflow-hidden flex flex-col justify-between">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-indigo-600/5 blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl opacity-50 pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center relative z-10 flex flex-col items-center gap-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/20 text-purple-300 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" />
          <span>100% Anonymous Feedback Platform</span>
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-indigo-200 to-white leading-tight max-w-4xl">
          Dive into the World of Anonymous Messages
        </h1>
        
        <p className="max-w-2xl text-slate-400 text-base sm:text-lg leading-relaxed">
          Mystery Message lets you share your personal feedback link on social media to receive honest thoughts, questions, and compliments from friends or fans. Fast, secure, and completely anonymous.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {session ? (
            <Link href="/dashboard">
              <Button className="h-12 px-6 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-up">
                <Button className="h-12 px-6 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2">
                  <span>Get Started for Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="h-12 px-6 rounded-xl bg-slate-950/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all duration-300 cursor-pointer">
                  Login to Account
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Carousel Section */}
      <section className="w-full max-w-xl mx-auto px-6 relative z-10 mb-16">
        <h2 className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          Sample Incoming Messages
        </h2>
        <Carousel
          plugins={[AutoPlay({ delay: 3000 })]}
          className="w-full"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="border border-slate-800/80 bg-slate-950/65 backdrop-blur-xl shadow-2xl rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-purple-500/30">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-purple-600/5 to-transparent pointer-events-none" />
                  <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 text-purple-400">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-purple-300">{message.title}</CardTitle>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{message.received}</span>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-slate-200 text-sm leading-relaxed font-normal">
                      &ldquo;{message.content}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white transition-colors" />
            <CarouselNext className="bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-400 hover:text-white transition-colors" />
          </div>
        </Carousel>
      </section>

      {/* Features Grid Section */}
      <section className="bg-slate-950/40 border-t border-slate-800/60 w-full py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Features Built for Engagement
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Simple steps, high privacy, and clean integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-purple-500/20 transition-all duration-300 group">
              <div className="p-3 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Complete Anonymity</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Senders are completely anonymous. No IP tracking, no profile logs. Express freely and securely.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-purple-500/20 transition-all duration-300 group">
              <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Share2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Instant Link Sharing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Copy your unique URL and attach it to your bio on Instagram, Snapchat, Facebook, or anywhere you hang out.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 hover:border-purple-500/20 transition-all duration-300 group">
              <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Real-Time Inbox</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Watch messages land instantly on your user dashboard. Toggle accepting new messages with a single switch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Get Started in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              1
            </div>
            <h3 className="font-semibold text-slate-200 text-lg">Create Your Account</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Sign up in seconds by choosing a username and setting up your secure password.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              2
            </div>
            <h3 className="font-semibold text-slate-200 text-lg">Share Your Feedback Link</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Copy your unique profile link from your dashboard and post it to your social media platforms.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3 relative z-10">
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
              3
            </div>
            <h3 className="font-semibold text-slate-200 text-lg">Receive & Reply</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Check your dashboard to read messages, delete unwanted spam, and accept feedback on your own terms.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500 relative z-10">
        <p>&copy; {new Date().getFullYear()} Mystery Message. Built with Next.js By Jitu Rewar.</p>
        <p className="mt-1 text-slate-600">Secure, encrypted anonymous portal.</p>
      </footer>
    </main>
  );
};

export default Page;

