"use client"

import Button from '@/app/components/Button'
import Input from '@/app/components/Inputs/Input'
import Select from '@/app/components/Inputs/Select'
import Modal from '@/app/components/Modal'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
interface GroupChatModalProps{
    isOpen?:boolean
    onClose:()=>void
    users:User[]
}


const GroupChatModal:React.FC<GroupChatModalProps> = ({
    isOpen,
    onClose,
    users
}) => {

    const router = useRouter()
    const [isLoading,setIsLoading] = useState(false)


    const {
        register,
        handleSubmit,
        setValue,
        formState:{
            errors
        },
        watch
    } = useForm<FieldValues>({
        defaultValues:{
            name:'',
            members:[]
        }
    })

    const members = watch('message')

    const onSubmit: SubmitHandler<FieldValues>= (data)=>{

        axios.post('/api/conversations',{
            ...data,
            isGroup:true
        })
        .then(()=>{
            router.refresh()
            onClose()
        })
        .catch(()=>toast.error('Something went wrong'))
        .finally(()=>setIsLoading(false))

    }


  return (
    <Modal  isModalOpen={isOpen} onClose={onClose} >
        <form  onSubmit={handleSubmit(onSubmit)} >
            <div className='space-y-12' >
                <div className='border-b border-gray-900/10 pb-12'>
                    <h2  className='text-base font-semibold leading-7 text-gray-900'>Create a group chat</h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600' >Create a chat with more than 2 people.</p>
                    <div className='mt-10 flex flex-col gap-y-8' >
                    <Input register={register} label='Name' id='name' disabled={isLoading}  required errors={errors} />
                    <Select
                    disabled={isLoading}
                    label="Members"
                    options={users.map((user:any)=>(
                        {
                            value:user.id,
                            label: user.name,
                        }
                    ))}
                    onChange={(value:any)=>setValue('members',value,{
                        shouldValidate:true
                    })}
                    value={members}
                    />

                    </div>
                </div>
            </div>
            <div className='mt-6 flex items-center justify-end gap-x-6'>
                <Button  disabled={isLoading} onClick={onClose} type='button' secondary >Cancel</Button>
                <Button  disabled={isLoading} onClick={onClose} type='submit' >Create</Button>
          
            </div>
        </form>
    </Modal>
  )
}

export default GroupChatModal
