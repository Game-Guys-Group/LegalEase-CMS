import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

import { useAuth, FileProps, map_file_data } from "@/api-helper";

export const Route = createFileRoute("/dashboard/clients/$clientId")({
  component: ViewClient,
});

interface Client {
  email: string;
  id: number;
  name: string;
  phone: string;
  id_number: string;
}

function File({
  id,
  caseId,
  description,
  courtStation,
  typeOfCase,
}: FileProps) {
  const navigate = Route.useNavigate();
  return (
    <TableRow
      onClick={() => {
        navigate({
          to: "/dashboard/clients/client/$fileId",
          params: { fileId: String(id) },
        });
      }}
    >
      <TableCell className="font-medium">{caseId}</TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>{courtStation}</TableCell>
      <TableCell>{typeOfCase}</TableCell>
    </TableRow>
  );
}

export default function Files({ clientId }: { clientId: number }) {
  const { error, isFetching, getData } = useAuth<FileProps[]>({
    url: `/files/get/${clientId}`,
    parseFn: map_file_data,
  });

  const [data, setData] = useState<FileProps[] | null>(null);

  useEffect(() => {
    getData().then((data) => {
      setData(data);
    });
  }, [clientId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Court Station</TableHead>
          <TableHead>Type of Case</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isFetching && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {data &&
          data.map((file: FileProps) => <File key={file.id} {...file} />)}
      </TableBody>
    </Table>
  );
}

function ViewClient() {
  const { clientId } = Route.useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const do_fetch = async () => {
      setIsFetching(true);
      const response = await fetch(`/user/clients/get/${clientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
        },
      });

      setIsFetching(false);
      if (!response.ok) {
        setError("Client not found");
        return;
      }
      const data = await response.json();
      setClient(data);
    };

    do_fetch();
  }, [clientId]);

  if (isFetching) {
    return (
      <div>
        Loading client info
        <div className="border-b-secondary-foreground  h-10 w-10 animate-spin rounded-full border-2 border-t-primary-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="flex max-h-screen w-full flex-col">
        <div className="w-full mb-8">
          <h1 className="text-3xl font-bold">{client?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View your client information and cases.
          </p>
          <Tabs className="border-b mt-6" defaultValue="info">
            <TabsList className="flex w-min">
              <TabsTrigger value="info">Client Info</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>
            <TabsContent className="p-6" value="info">
              <div className="mt-2 grid grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold mb-2">Personal Details</h2>
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-500 font-medium">
                        Full Name
                      </label>
                      <p>{client?.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 font-medium">
                        Date of Birth
                      </label>
                      <p>January 1, 1980</p>
                    </div>
                    <div>
                      <label className="text-gray-500 font-medium">
                        Gender
                      </label>
                      <p>Male</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-2">
                    Contact Information
                  </h2>
                  <div className="space-y-2">
                    <div>
                      <label className="text-gray-500 font-medium">Email</label>
                      <p>{client?.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 font-medium">Phone</label>
                      <p>{client?.phone}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 font-medium">
                        Id Number
                      </label>
                      <p>{client?.id_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent className="p-6" value="files">
              <Files clientId={Number(clientId)} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
