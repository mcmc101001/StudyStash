"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { UserCog } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { updateProfileType } from "@/pages/api/updateProfile";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface ProfileEditDialogProps {
  userId: string;
  username: string;
  bio: string;
}

export default function ProfileEditDialog({
  userId,
  username,
  bio,
}: ProfileEditDialogProps) {
  const [nameState, setNameState] = useState(username);
  const [bioState, setBioState] = useState(bio);

  const router = useRouter();

  async function updateProfile() {
    if (!userId) {
      return null;
    }
    // biostate check
    let body: updateProfileType = {
      userId: userId,
      username: nameState,
      bio: bioState,
    };

    try {
      let req = await axios.post("/api/updateProfile", body);
      toast.success("Profile updated.");
      router.refresh();
    } catch (error) {
      toast.error("Update unsuccessful. Please try again.");
    }
  }

  const [nameCharState, setNameCharState] = useState(nameState.length);
  const [bioCharState, setBioCharState] = useState(bioState.length);

  return (
    <Dialog>
      <DialogTrigger className="flex h-10 items-center justify-center rounded-md border-2 border-slate-500 py-2">
        <UserCog className="ml-2"></UserCog>
        <h2 className="w-24">Edit Profile</h2>
      </DialogTrigger>
      <DialogContent className="text-slate-800 dark:text-slate-200">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold">Edit Profile</h2>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="name">
                Name
              </label>
              <input
                autoComplete="off"
                onChange={({ target }) => {
                  setNameState(target?.value);
                  setNameCharState(target?.value.length);
                }}
                className="rounded-md bg-slate-300 p-1 dark:bg-slate-700"
                id="name"
                defaultValue={nameState}
                maxLength={30}
                spellCheck={false}
              />
              <div>
                <span className="float-right">{nameCharState}/30</span>
              </div>

              <label className="text-lg font-semibold" htmlFor="bio">
                Bio
              </label>
              <textarea
                autoComplete="off"
                onChange={({ target }) => {
                  setBioState(target?.value);
                  setBioCharState(target?.value.length);
                }}
                className="h-28 w-full resize-none whitespace-normal rounded-md bg-slate-300 p-1 dark:bg-slate-700"
                id="bio"
                defaultValue={bioState}
                maxLength={255}
                spellCheck={false}
              />
              <div>
                <span className="float-right">{bioCharState}/255</span>
              </div>
            </div>

            <button
              onClick={() => updateProfile()}
              className="rounded border border-black p-1 align-middle font-semibold dark:border-white"
              autoFocus={true}
            >
              Submit changes
            </button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
