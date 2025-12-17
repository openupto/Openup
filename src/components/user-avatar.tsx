import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "./ui/utils";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "../auth-context";

interface UserData {
  name?: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  [key: string]: any;
}

interface UserAvatarProps {
  user?: UserData | null;
  className?: string;
  fallbackClassName?: string;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export function UserAvatar({ user, className, fallbackClassName, isLoading, isSuccess }: UserAvatarProps) {
  const name = user?.name || user?.full_name || "Utilisateur";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative inline-block">
        <Avatar className={cn("border-2 border-white/10 bg-slate-800 transition-all duration-300", className)}>
          {isLoading ? (
             <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Loader2 className="h-1/3 w-1/3 animate-spin text-slate-400" />
             </div>
          ) : (
             <>
                <AvatarImage 
                    src={user?.avatar_url} 
                    alt={name} 
                    className="object-cover w-full h-full" 
                />
                <AvatarFallback 
                    className={cn(
                    "bg-gradient-to-br from-[#0A5BFF] to-[#004ecb] text-white font-bold flex items-center justify-center w-full h-full", 
                    fallbackClassName
                    )}
                >
                    {initial}
                </AvatarFallback>
             </>
          )}
        </Avatar>
        
        {/* Success Indicator Overlay */}
        {isSuccess && !isLoading && (
            <div className="absolute -bottom-1 -right-1 flex h-[30%] w-[30%] min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-in zoom-in duration-300 shadow-lg">
                <Check className="h-2/3 w-2/3 text-white" strokeWidth={3} />
            </div>
        )}
    </div>
  );
}

export function GlobalUserAvatar({ className, fallbackClassName }: { className?: string; fallbackClassName?: string }) {
    const { profile, user, loading } = useAuth();
    
    // Prioritize profile data, fallback to user metadata
    const displayUser = profile ? {
        name: profile.full_name,
        email: profile.email || user?.email,
        avatar_url: profile.avatar_url
    } : user ? {
        name: user.user_metadata?.full_name || 'Utilisateur',
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url
    } : null;

    // Use internal loading state if auth is initializing, but usually we just want to show fallback if not ready
    // We pass loading only if strictly auth loading
    return <UserAvatar user={displayUser} className={className} fallbackClassName={fallbackClassName} />;
}
