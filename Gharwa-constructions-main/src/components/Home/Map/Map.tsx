import React from 'react'

const Map = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      {/* Page Header */}
      <div className="text-center mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Our{' '}
              <span className="text-yellow-500">Location</span>
            </h2>
          <p className="text-gray-600">Find us easily with detailed directions</p>
        </div>

        {/* Map Container - Full Width */}
        <div className="w-full">
          <div className="relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.6773810218974!2d85.46672077478361!3d23.472098999404558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4fb3f1f1adb2b%3A0xf996dbc9b9b4c540!2sKisaan%20Complex!5e0!3m2!1sen!2sin!4v1758082645636!5m2!1sen!2sin" 
              width="100%" 
              height="600" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[600px]"
            />
          </div>
        </div>
    </div>
  )
}

export default Map