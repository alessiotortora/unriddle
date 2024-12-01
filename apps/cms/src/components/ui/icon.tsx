import {
  FileText,
  FileVideo,
  Folder,
  House,
  Images,
  LogOut,
  LucideIcon,
  Settings,
  SquarePlus,
  Trash,
  User,
  X,
} from 'lucide-react';

interface IconProps {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  className?: string;
  color?: string;
}

const icons: { [key: string]: LucideIcon } = {
  house: House,
  settings: Settings,
  folder: Folder,
  user: User,
  logout: LogOut,
  images: Images,
  trash: Trash,
  x: X,
  squarePlus: SquarePlus,
  fileText: FileText,
  fileVideo: FileVideo,
};

export default function Icon({
  name,
  color,
  size = 21,
  strokeWidth = 1.5,
  className,
}: IconProps) {
  const LucideIcon = icons[name];
  return LucideIcon ? (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      color={color}
    />
  ) : null;
}
