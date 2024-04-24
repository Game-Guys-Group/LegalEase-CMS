import { useState, useEffect } from 'react'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/alert-dialog"
import { Combobox } from  "@/components/combo-box"


export const Route = createFileRoute('/dashboard/clients/add-file')({
  component: AddClient
})


function AddClient() {
  const router = useRouter()
  const [client, setClient] = useState<string | string []>("")
  const [clients, setClients] = useState([])

  useEffect(() => {

  const fetchClients = async () => {
      const response = await fetch(
        '/user/clients/get', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth_key")}`,
          }
        }
      )

      if (!response.ok) {
        let json = await response.json()
        throw new Error(json["detail"])
      }

      const value = await response.json()
      const cls = value.map((c: { id: number, name: string}) => {
        return {value: String(c["id"]), label: c["name"]}
      })

      console.log(cls)
      setClients(cls)

  }

  fetchClients()
  }, [client])


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Add a New File
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400">Get started by filling out the form below.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>New file Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                  <div className="space-y-2">
                    <Label> Client </Label>
                    <Combobox
                      mode='single' //single or multiple
                      options={clients}
                      placeholder='Select option...'
                      selected={client} // string or array
                      onChange={(value) => setClient(value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseid">Case Id</Label>
                    <Input id="caseid" placeholder="001" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courtstation">Court Station</Label>
                    <Input id="courtstation" placeholder="station 001" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="casetype">Type Of Case</Label>
                    <Input id="casetype" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="case description" />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end gap-2">
                  <Alert
                    title='Are you Sure'
                    description='This action can not be undone'
                    buttonLabel='Cancel'
                    onConfirm={() => router.history.back()}
                    onCancel={() => {}}
                  />
                  <Button type="submit">Save File</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
