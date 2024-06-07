import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, FileIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients/client/$fileId")({
  component: Component,
});

import { Button } from "@/components/ui/button";
import { FileProps, map_file, useAuth } from "@/api-helper";

export default function Component() {
  const { fileId } = Route.useParams();
  const { error, isFetching, getData } = useAuth<FileProps>({
    url: `/file/get/${fileId}`,
    parseFn: map_file,
  });

  const [data, setData] = useState<FileProps | null>(null);

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });
  }, [fileId]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container mx-auto w-full my-8 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Case ID</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {data?.caseId}
          </p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Court Station</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {data?.courtStation}
          </p>
        </div>
        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Type of Case</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {data?.typeOfCase}
          </p>
        </div>

        <div className="md:col-span-2 sm:col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {data?.description}
          </p>
        </div>

        <div className="col-span-1 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-4 mt-8 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium">Police Report.pdf</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: April 15, 2023
                  </p>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <DownloadIcon className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="font-medium">Witness Statements.pdf</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: April 20, 2023
                  </p>
                </div>
              </div>
              <Button size="icon" variant="ghost">
                <DownloadIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 col-span-2 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                aria-hidden="true"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label
                  className="relative cursor-pointer bg-muted rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2"
                  htmlFor="attachments"
                >
                  <span>Upload a file</span>
                  <input
                    className="sr-only"
                    id="attachments"
                    name="attachments"
                    type="file"
                  />
                </label>
                <p className="pl-2">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>

          <Button className="mt-8">Upload</Button>
        </div>
      </div>
    </main>
  );
}
