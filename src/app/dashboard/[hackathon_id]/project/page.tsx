"use client"

import React from 'react'
import { useParams } from 'next/navigation'

function Project() {
    const params = useParams();
    const hackathon_id = params?.hackathon_id as string;



  return (
    <div>Project</div>
  )
}

export default Project