import Head from 'next/head'
import {useForm} from 'react-hook-form'
import {useState} from 'react'
import useSWR, { useSWRInfinite } from 'swr'
import Router from 'next/router'

const faker = require('faker')

const fetcher = (url) => fetch(url).then((r) => r.json())

async function swrFetcher(path) {
  const res = await fetch(path)
  return res.json()
}


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

  const limit = 6
  // const cursor = 'abc'

  const getKey = (pageIndex, prevPageData) => {

    if (prevPageData) console.log(prevPageData.after)

    if (pageIndex === 0) return `/api/users?limit=7`

    if (prevPageData.length < limit) {
      console.log('End of the list')
      return null
    }

    // prevPageData.after.map((d) => {
    //   console.log(`/api/users?limit=5&cursor=${d['@ref'].id}`)

    //   return `/api/users?limit=5&cursor=${d['@ref'].id}`
    // })

    return `/api/users?limit=7&cursor=${prevPageData.after[0]['@ref'].id}`
  }

  const {data, error, mutate, size, setSize} = useSWRInfinite(getKey, swrFetcher)
  console.log(size)
  // let users = null
  // if (data) {
  //   data.map((d) => {
  //     console.log(d.data)
  //   })
  // }
  
  let users = null

  if (data) {
    users = []
    for (const pageData of data) {
      // console.log(pageData.data)
      users = [...users, ...pageData.data]
    }
  }


  // const {data, error} = useSWR(`/api/users?limit=5&cursor=abc`, fetcher)

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
          {users ? (
            users.map((d, index) => {
              return (
                <div 
                  className='flex p-6 m-1 bg-white rounded-lg'
                  key={d.ref['@ref'].id}
                >{index} {d.data.name}</div>
                
              )
            })
          ) : (
            <div>loading...</div>
          )}

        {/* {data ? (
            data.data.map((d, index) => {
              return (
                <div 
                  className='flex p-6 m-1 bg-white rounded-lg'
                  key={d.ref['@ref'].id}
                >{index} {d.data.name}</div>
                
              )
            })
          ) : (
            <div>loading...</div>
          )}

          {data ? (
            data.after.map((d) => {
              return (
                <div>{d['@ref'].id}</div>
              )
            })
          ) : (
            <div>loading the after...</div>
          )} */}

          <button
            onClick={(e) => {
                e.preventDefault()
                setSize(size + 1)
              }
            } 
            className='bg-blue-200'>
            Load more...
          </button>
        </div>

      </main>
    </div>
  )
}
