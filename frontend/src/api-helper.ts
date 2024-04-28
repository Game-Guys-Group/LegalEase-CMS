import { useState } from "react";

export interface FileProps {
  id: number;
  caseId: string;
  clientId: number;
  description: string;
  courtStation: string;
  typeOfCase: string;
}

export const map_file = (file: any): FileProps => {
  return {
    id: file.id,
    caseId: file.case_id,
    clientId: file.client_id,
    description: file.description,
    courtStation: file.court_station,
    typeOfCase: file.type_of_case,
  };
};

export const map_file_data = (data: any) => {
  return data.map(map_file);
};

export async function login(
  email: string,
  password: string,
): Promise<string | null> {
  let response = await fetch("/token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${email}&password=${password}&`,
  });

  if (response.ok) {
    let data = await response.json();
    return data.access_token;
  }

  return null;
}

export async function signup(
  email: string,
  password: string,
): Promise<string | null> {
  let response = await fetch("/users/create", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (!response.ok) {
    const j = await response.json();
    return j["detail"];
  }

  return null;
}

interface UseAuthResult<T> {
  error: string | null;
  isFetching: boolean;
  getData: () => Promise<T | null>;
}

interface UseAuthOptions<T> {
  url: string;
  parseFn: (data: any) => T;
  method?: string;
  body?: any;
}

export function useAuth<T>({
  url,
  parseFn,
  method = "GET",
  body = {},
}: UseAuthOptions<T>): UseAuthResult<T> {
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const do_fetch = async () => {
    setIsFetching(true);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_key")}`,
      },
      body: method != "GET" ? JSON.stringify(body) : null,
    });

    setIsFetching(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data);
      return null;
    }

    return parseFn(await response.json());
  };

  return { error, isFetching, getData: do_fetch };
}
