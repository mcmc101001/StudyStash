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
import { Toast } from "react-hot-toast"; // For confirmation of change or err
import { useState } from "react";
import { updateProfileType } from "@/pages/api/updateProfile";

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

  async function updateProfile() {
    if (!userId) {
      return null;
    }
    let body: updateProfileType = {
      userId: userId,
      username: nameState,
      bio: bioState,
    };
    let req = await axios.post("/api/updateProfile", body);
    return req;
  }

  return (
    <Dialog>
      <DialogTrigger className="rounded-md border-2 px-2 hover:scale-110 ">
        <UserCog></UserCog>
      </DialogTrigger>
      <DialogContent className="text-slate-800 dark:text-slate-200">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold ">Edit Profile</h2>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col">
              <label className="text-lg font-semibold" htmlFor="name">
                Name
              </label>
              <input
                autoComplete="off"
                onChange={({ target }) => setNameState(target?.value)}
                className="rounded-md bg-slate-700 p-1"
                id="name"
                defaultValue={nameState}
              />
              <label className="mt-2 text-lg font-semibold" htmlFor="bio">
                Bio
              </label>
              <textarea
                autoComplete="off"
                onChange={({ target }) => setBioState(target?.value)}
                className="h-32 w-full resize-none whitespace-normal rounded-md bg-slate-700 p-1"
                id="bio"
                defaultValue={bioState}
              />
            </div>

            <button
              onClick={() => updateProfile()}
              className="mt-1 rounded border border-white p-1 align-middle"
            >
              SUBMIT
            </button>

            <div className="my-2">
              <h1>for testing: </h1>
              <p>Name: {nameState}</p>
              <p>Bio: {bioState}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
