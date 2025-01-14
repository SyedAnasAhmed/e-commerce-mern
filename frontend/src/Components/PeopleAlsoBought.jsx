import React from 'react'
import ProductCard from './ProductCard'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

const PeopleAlsoBought = () => {

  const [recommendations, setRecommendations] = useState([])
  const [isloading, setIsLoading] = useState(true)

  useEffect(()=>{
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recomendation")
      setRecommendations(res.data)
      setIsLoading(true)
      } catch (error) {
        toast.error("An error occured")
      }
      finally{
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  },[])

  if(isloading) return <LoadingSpinner/>

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400 '>People Also Bought</h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {recommendations.map((product) => (
            <ProductCard  key={product._id} product={product} />
          ))}
      </div>
    </div>
  )
}

export default PeopleAlsoBought
