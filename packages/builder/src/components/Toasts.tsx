import React, { useEffect, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { FlashMessage } from "..";
import t from "../translations";
import { RxCross2 } from "react-icons/rx";

export default function ToastMessage(props: { toast: FlashMessage }) {
  const [open, changeOpen] = useState(true);
  useEffect(() => {
    changeOpen(true);
  }, [props.toast]);
  const bgColor =
    props.toast.type === "success" ? "bg-emerald-600" : "bg-red-600";
  return (
    <Toast.Provider>
      <Toast.Root
        className={`${bgColor} text-white font-bold max-w-md mx-auto mt-2 transition-opacity rounded border border-color-slate-600 p-2 flex`}
        open={open}
        onOpenChange={changeOpen}
      >
        <Toast.Title>{props.toast.title}</Toast.Title>
        <Toast.Description asChild>{props.toast.description}</Toast.Description>
        <Toast.Action
          className="ml-auto my-auto"
          altText={t("toastClose")}
          asChild
        >
          <button
            type="button"
            className="cursor-pointer hover:bg-emerald-900"
            onClick={() => changeOpen(false)}
          >
            <RxCross2 />
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed w-full z-10" />
    </Toast.Provider>
  );
}
