import Avatar from "@mui/material/Avatar";
type UserAvatarProps = {
  name: string;
  src?: string;
  sx : any;
};


function stringAvatar(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return {
    children: initials,
  };
}



export default function UserAvatar({ name, src,sx }: UserAvatarProps) {
  return (
    <Avatar {...(src ? { src } : stringAvatar(name))} alt={name}  sx={sx}/>
  );
}