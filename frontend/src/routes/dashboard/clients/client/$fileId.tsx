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
    <main className="container mx-auto my-8 px-4 md:px-6 lg:px-8">
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

        <div className="col-span-2 rounded-lg border  p-6 shadow-sm bg-muted/60">
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
      <div className="mt-8 rounded-lg border  p-6 shadow-sm bg-muted/60">
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
        <div className="mt-6">
          <Button>Add Attachment</Button>
        </div>
      </div>
    </main>
  );
}
