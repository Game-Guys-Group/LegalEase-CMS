export async function login(email: string, password: string): Promise<string | null>  {
  let response = await fetch("/token", {
    method: "POST",
    headers: {
      'accept': "application/json",
      'Content-Type': "application/x-www-form-urlencoded",
    },
    body: `username=${email}&password=${password}&`
    });

  if (response.ok) {
    let data = await response.json();
    return data.access_token;
  }

  return null;
}



export async function signup(email: string, password: string): Promise<string | null> {
  let response = await fetch('/users/create', {
    method: 'POST',
    headers: {
      'accept': "application/json",
      'Content-Type': "application/json",
    },
    body: JSON.stringify({ email: email, password: password})
  })


  if (!response.ok) {
    const j = await response.json()
    return j["detail"]
  }

  return null
}
