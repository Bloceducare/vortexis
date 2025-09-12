"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import useUser from "@/hooks/useUserProfile";


function SingleProfile() {
  const params = useParams()
  const userId = params?.id as string

  const { getPublicUser } = useUser()

  const { data } = getPublicUser(userId)

  console.log(data)



  return (
    <div>SingleProfile</div>
  )
}

export default SingleProfile