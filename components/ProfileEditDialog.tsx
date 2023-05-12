import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { UserCog } from "lucide-react";

interface ProfileEditDialogProps {
  username: string;
  //   bio: string;
}

export default function ProfileEditDialog({
  username,
}: //   bio,
ProfileEditDialogProps) {
  return (
    <Dialog>
      <DialogTrigger className="hover:scale-110">
        <UserCog></UserCog>
      </DialogTrigger>
      <DialogContent className="text-slate-800 dark:text-slate-200">
        <DialogHeader>
          <DialogTitle className="justify-center">
            <h2>Edit Profile</h2>
          </DialogTitle>
          <DialogDescription>
            <div>
              <label className="Label" htmlFor="name">
                Name
              </label>
              <input
                className="m-3 rounded-md bg-slate-700 p-1"
                id="name"
                defaultValue={username}
              />
            </div>
            <div>
              <label className="Label" htmlFor="name">
                Bio
              </label>
              <input // How to make this wrap ?????
                className="ml-3 h-20 w-5/6 whitespace-normal rounded-md bg-slate-700 p-1"
                id="name"
                defaultValue="test"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
