import Head from 'next/head'
import {useForm} from 'react-hook-form'
import {useState} from 'react'

const faker = require('faker')

export default function Home() {


  const [name, setName] = useState('')
  const {handleSubmit, register, errors} = useForm()

  const onClick = () => {
    const randomName = faker.name.findName()
    setName(randomName)
  }

  const onSubmit = handleSubmit((formData) => {
    console.log(formData)
  })

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

        <div className='flex-1 bg-gray-100'>user cards</div>
      </main>
    </div>
  )
}
