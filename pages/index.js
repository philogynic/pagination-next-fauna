import Head from 'next/head'
import {useForm} from 'react-hook-form'
import {useState} from 'react'
import useSWR from 'swr'
import Router from 'next/router'

const faker = require('faker')
const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Home() {

  const [name, setName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const {handleSubmit, register, errors} = useForm()


  const onClick = () => {
    const randomName = faker.name.findName()
    setName(randomName)
  }

  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)
    if (errorMessage) setErrorMessage('')

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (res.status === 200) {
        Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message)
    }
  })

  const {data, error} = useSWR('/api/users', fetcher)

  if (error) return <div>failed to load</div>

  return (
    <div className='font-mono'>
      <Head>
        <title>Pagination</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex flex-col max-w-lg mx-auto h-screen'>
        <form className='flex flex-col border-2 p-2' onSubmit={onSubmit}>
          <label>name</label>
          <div>
            <input placeholder='name' defaultValue={name} name='name' ref={register}></input>
            <button onClick={onClick} type='button' className='bg-green-100'>create random</button>
          </div>
          <button className='text-2xl bg-blue-200'>submit</button>
        </form>

        <div className='flex-1 flex flex-col bg-gray-100 overflow-y-auto'>
          {data ? (
            data.map((d) => {
              return (
                <div 
                  className='flex p-2 m-1 bg-white rounded-lg'
                  key={d.ref['@ref'].id}
                >{d.data.name}</div>
              )
            }) 
          ) : (
            <div>loading...</div>
          )}
        </div>
      </main>
    </div>
  )
}
