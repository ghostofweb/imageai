'use client'
import { useToast } from '@/hooks/use-toast'
import React from 'react'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { dataUrl, getImageSize } from '@/lib/utils'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

type MediaUploaderProps = {
    onValueChange: (value: string) => void;
    setImage: React.Dispatch<any>;
    image: any;
    publicId: string;
    type: string;
}
const MediaUploader = ({onValueChange,setImage,image,publicId,type}:MediaUploaderProps) => {
    const {toast} = useToast()
    
    const onUploadSuccessHandler = (result:any) => {
        setImage((prev:any)=>({
            ...prev,
            publicId:result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url
        }))
        onValueChange(result?.info?.public_id)

        toast({
            title: "Image Uploaded Successfully",
            description: "1 credit was deducted from your account",
            duration: 5000,
            className:'error-toast'
        })
    }
    const onUploadErrorHandler = () => {
        toast({
            title: "Something went wrong while uploading the image",
            description: "Please try again",
            duration: 5000,
            className:'error-toast'
        })
    }
  return (
    <div>
       <CldUploadWidget
       uploadPreset='imageai'
       options={{
        multiple:false,
        resourceType:"image",
       }}
       onSuccess={onUploadSuccessHandler}
       onError={onUploadErrorHandler}
       >
        {({open})=>(
            <div className='flex flex-col gap-4'>
                <h3 className='h3-bold text-dark-600'>
                    Original 
                </h3>
                {publicId ?(
                <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                <CldImage width={getImageSize(type,image,"width")} height={getImageSize(type,image,"height")} src={publicId} alt='Image' sizes={"(max-width: 767) 100vw, 50vw"} placeholder={dataUrl as PlaceholderValue}
                className='media-uploader_cldImage'
                />
                </div>
            ):(
            <div className='media-uploader_cta' onClick={()=>{
                open()
            }}>
           <div className='media-uploader_cta-image'>
                <Image src="/assets/icons/add.svg" alt='Add Image' width={24} height={24}/>
           </div>
                <p className='p-14-medium'>Click here to Upload the Image</p>
            </div>
        )}
            </div>
        )}
       </CldUploadWidget>
    </div>
  )
}

export default MediaUploader