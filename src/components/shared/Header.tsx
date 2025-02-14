import React from 'react'

const Header = ({title,subtitle=""}:{title:string,subtitle?:string}) => {
  return (
    <>
    <h1 className='h2-bold text-dark-600'>
        {title}
    </h1>
    {subtitle && <p className='p-16-ragular mt-4'>{subtitle}</p>}
    </>
  )
}

export default Header