import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Settings as SettingsIcon } from "lucide-react";

type HeaderProps = {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
  isMobile?: boolean;
};

const Header = ({}: HeaderProps = {}) => {
  const { user, signOut, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  const email = user?.email ?? "";
  const fullName =
    (user?.user_metadata as any)?.full_name ||
    (user?.user_metadata as any)?.name ||
    email;
  const initials = (fullName || email || "U")
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0]?.toUpperCase())
    .join("");
  const avatarUrl = (user?.user_metadata as any)?.avatar_url;
  const roleLabel = isAdmin ? "Admin" : isManager ? "Manager" : "Employee";

  return (
    <div className="flex items-center justify-end gap-3 p-2">
      {user && (
        <div className="hidden text-right md:block">
          <div className="text-sm font-medium leading-tight">{fullName}</div>
          <div className="text-xs text-muted-foreground leading-tight">{roleLabel}</div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative p-0 h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
              <AvatarFallback>{initials || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{fullName}</span>
              <span className="text-xs text-muted-foreground truncate">{email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <SettingsIcon className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;
