"use client";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SimpleMdeEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface ticket {
  title: string;
  description: string;
}

const NewTicketPage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<ticket>();
  const [error, setError] = useState(false);
  return (
    <>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            await fetch("/api/tickets", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }).then((res) => {
              if (!res.ok) throw new Error();
              return res.json();
            });
            router.push("/tickets");
          } catch (e) {
            setError(true);
          }
        })}
        className="mt-10 ml-10"
      >
        <div className="form-control max-w-xl">
          {error && (
            <div role="alert" className="alert alert-error mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                onClick={() => setError(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error Creating Ticket, Please Check your Inputs Again</span>
            </div>
          )}
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered mb-5"
            {...register("title")}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <SimpleMdeEditor
                className="max-w-xl"
                placeholder="Description"
                {...field}
              ></SimpleMdeEditor>
            )}
          ></Controller>
        </div>
        <button className="btn btn-primary mt-5 w-1/6">Submit</button>
      </form>
    </>
  );
};

export default NewTicketPage;
