'use client'
import React from 'react'
import Hero from './Hero/Hero'
import OverView from './OverView/OverView'
import Feature from './Feature/Feature'
import Gallery from './Gallery/Gallery'
import ClientReview from './ClientReview/ClientReview'
import Map from './Map/Map'

const Home = () => {
  return (
    <div>
        <Hero/>
        <OverView/>
        <Feature/>
        <Gallery/>
        {/* <About/> */}
        <ClientReview/>
        <Map/>
    </div>
  )
}

export default Home