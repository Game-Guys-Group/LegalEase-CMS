import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DownloadIcon, FileIcon } from "lucide-react";

export const Route = createFileRoute("/dashboard/clients/client/$fileId")({
  component: Component,
});

import { Button } from "@/components/ui/button";
import { FileProps, getAuthToken, map_file, useAuth } from "@/api-helper";
import { useToast } from "@/components/ui/use-toast";

import { Document, Page } from "react-pdf";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface Attachment {
  id: number;
  file_id: number;
  url: string;
  attachment_name: string;
}

interface Viewer {
  attachment: Attachment | undefined;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

interface AttachmentProps {
  attachment?: Attachment;
  onView: (attachment: Attachment | undefined) => void;
}

function ViewFile(view: Viewer) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<Blob | undefined>(undefined);

  const get_file = async () => {
    if (!view.attachment) return;
    const token = await getAuthToken();
    fetch(`/file/attachment/get/${view.attachment.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((b) => {
        setFile(b);
      });
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    get_file();
  }, [view.isOpen]);

  return (
    <Drawer open={view.isOpen} onOpenChange={view.setIsOpen}>
      <DrawerContent className="w-full h-5/6 flex">
        <DrawerHeader>
          <DrawerTitle> {view.attachment?.attachment_name} </DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="flex w-full items-center justify-center">
          {view.attachment?.attachment_name.endsWith("png") && file && (
            <img src={URL.createObjectURL(file)} alt="attachment" />
          )}

          {!view.attachment?.attachment_name.endsWith("png") && (
            <>
              <Document
                className="p-8 flex w-full h-full items-center justify-center"
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={pageNumber} />
              </Document>
              <p>
                Page {pageNumber} of {numPages}
              </p>
            </>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}

function AttachmentComponent({ attachment, onView }: AttachmentProps) {
  const submit = async () => {
    if (!attachment) return;
    const token = await getAuthToken();
    fetch(`/file/attachment/get/${attachment.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((b) => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.setAttribute("download", attachment.attachment_name);
        a.click();
      });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        <div>
          <p className="font-medium">{attachment?.attachment_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            uploaded on: April 15, 2023
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          size="icon"
          variant="secondary"
          className="px-16"
          onClick={() => onView(attachment)}
        >
          preview
        </Button>

        <Button size="icon" variant="ghost" onClick={submit}>
          <DownloadIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function Component() {
  const { fileId } = Route.useParams();

  const { error, isFetching, getData } = useAuth<FileProps>({
    url: `/file/get/${fileId}`,
    parseFn: map_file,
  });

  const attachments = useAuth<Attachment[]>({
    url: `/files/attachments/get/${fileId}`,
    parseFn: (data) => data,
  });

  const [data, setData] = useState<FileProps | null>(null);

  const [file, setFile] = useState<File | undefined>(undefined);

  const [attachmentsData, setAttachmentsData] = useState<Attachment[] | null>(
    null,
  );

  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();

  const upload = async () => {
    if (isUploading) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("attachment", file as Blob);

    const token = await getAuthToken();

    fetch(`/files/attachments/create/${fileId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: "multipart/form-data",
        Accept: "application/json",
      },
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        toast({
          title: "Attachment uploaded",
          description: "The attachment has been uploaded successfully",
        });

        setIsUploading(false);
        setFile(undefined);

        attachments.getData().then((data) => {
          setAttachmentsData(data);
        });
      });
  };

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });

    attachments.getData().then((data) => {
      setAttachmentsData(data);
    });
  }, [fileId]);

  const [ata, setAta] = useState<Attachment | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const ataClick = (at: Attachment | undefined) => {
    console.log(at);
    setAta(at);
    setIsOpen(true);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isOpen) {
    return <ViewFile attachment={ata} isOpen={isOpen} setIsOpen={setIsOpen} />;
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-4 mt-8 rounded-lg border  p-6 shadow-sm bg-muted/60">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <div className="mt-4 space-y-4">
            {attachmentsData?.map((attachment) => (
              <AttachmentComponent
                key={attachment.id}
                attachment={attachment}
                onView={(at) => ataClick(at)}
              />
            ))}
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

              {!file && (
                <div>
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
                        onChange={(val) => {
                          setFile(val.target.files?.[0]);
                        }}
                      />
                    </label>
                    <p className="pl-2">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              )}

              {file && !isUploading && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {file.size}
                  </p>
                  <Button className="mt-8" onClick={upload}>
                    Upload
                  </Button>
                </div>
              )}

              {isUploading && <p>Uploading...</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
