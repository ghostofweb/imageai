"use client"
import React, { useState, useTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CustomeField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils'
import { updateCredits } from '@/lib/actions/user.actions'
import MediaUploader from './MediaUploader'
import TransformedImage from './TransformedImage'
import { getCldImageUrl } from 'next-cloudinary'
import { addImage, updateImage } from '@/lib/actions/image.actions'
import { useRouter } from 'next/router'

type Transformations = {
  title: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  publicId: string;
  config?: { restore?: boolean; removeBackground?: boolean; fillBackground?: boolean; remove?: { prompt: string; removeShadow: boolean; multiple: boolean }; recolor?: { prompt: string; to: string; multiple: boolean } };
};

// Define form schema using Zod
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
})

type FormValues = z.infer<typeof formSchema>;

// Define a type for the transformation keys
export type TransformationType = keyof typeof transformationTypes;



const TransformationForm = ({
  action,
  userId,
  type,
  creditBalance,
  data = null,
  config = null
}: TransformationFormProps) => {
  // Now 'type' is correctly typed, so we can index transformationTypes safely.
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations["config"] | null>(null);
  const router = useRouter()
  const [isSubmitting, setisSubmitting] = useState(false)
  const [isTranforming, setisTranforming] = useState(false)
  const [transformationConfig, settransformationConfig] = useState(config)
  const [isPending,startTransition] = useTransition()
  const initialValues = data && action === 'Update'
    ? {
        title: data.title,
        aspectRatio: data.aspectRatio,
        color: data.color,
        prompt: data.prompt,
        publicId: data.publicId,
      }
    : defaultValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values:z.infer<typeof formSchema>){
  setisSubmitting(true)
  if(data || image){
    const transformationUrl = getCldImageUrl({
      width:image?.width,
      height:image?.height,
      src:image?.publicId,
      ...transformationConfig
    })

    const imageData = {
      title:values.title,
      publicId: image?.publicId,
      transformationType : type,
      width: image?.width,
      height: image?.height,
      config : transformationConfig,
      secureURL:image?.secureUrl,
      transformationURL:transformationUrl,
      aspectRatio: values.aspectRatio,
      prompt: values.prompt,
      color: values.color
    }
    if(action === 'Add'){
      // Add Image
      try {
        const newImage = await addImage({image:imageData,userId,path:'/'})
        if(newImage){
          form.reset()
          setImage(data)
          router.push(`/transformation/${newImage._id}`)

        }
      } catch (error) {
        console.error(error)
      }
    }

    if(action === 'Update'){
      // Add Image
      try {
        const updatedImage = await updateImage({image:{...imageData,_id:data._id},userId,path:`/transformation/${data._id}`})

        if(updatedImage){
          form.reset()
          setImage(data)
          router.push(`/transformation/${updatedImage._id}`)

        }
      } catch (error) {
        console.error(error)
      }
    }
  }
  
 }

  // Optional select field handler (if needed)
  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey]
    setImage((prevState:any)=>({
      ...prevState,
      aspectRatio:imageSize.aspectRatio,
      width:imageSize.width,
      height: imageSize.height
    }))
    setNewTransformation(transformationType.config);   
    return onChangeField(value)
  };

  const onInputChangeHandler = (fieldName:string,value:string,type:string,onChangeField:(value:string)=>void) => {
  debounce(()=>{
    setNewTransformation((prev:any)=>({
      ...prev,
      [type]:{
        ...prev?.[type],
        [fieldName === 'prompt' ? 'prompt' : 'to']:value
      }
    }))
  },1000)
  return onChangeField(value)
  }
  // TODO: Implement the updateCredits Handler
  const onTranformHandler = async ()=>{
    setisTranforming(true)
    deepMergeObjects(newTransformation,transformationConfig)
    setNewTransformation(null)

    startTransition(async () => {
      await updateCredits(userId,-1)
    })
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomField
            control={form.control}
            name="title"
            formLabel="Image Title"
            className="w-full"
            render={({ field }) => <Input {...field} className="input-field" />}
          />
          {type === 'fill' && (
            <CustomField
              control={form.control}
              name="aspectRatio"
              formLabel="Aspect Ratio"
              className="w-full"
              render={({ field }) => (
                <Select onValueChange={(value)=>{
                  onSelectFieldHandler(value,field.onChange)
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                 {Object.keys(aspectRatioOptions).map((key)=>(
                  <SelectItem key={key} value={key} className='select-item'>
                    {aspectRatioOptions[key as AspectRatioKey].label}
                  </SelectItem>
                 ))}
                  </SelectContent>
                </Select>
              )}
            />
          )}
          {(type === 'remove' || type ==='recolor')&&(
            <div className='prompt-field'>
              <CustomField
              control={form.control}
              name='prompt'
              formLabel={
                type === 'remove' ? 'Object to Remove' : "Object to Recolor"
              }
              className='w-full'
              render={(({field})=>(
                <Input 
                value={field.value}
                className='input-field'
                onChange={(e) => onInputChangeHandler(
                  'prompt',e.target.value,type,field.onChange
                )}

                />
              ))}
              />
              {type === 'recolor' && (
            <CustomField
            control={form.control}
            name='color'
            formLabel='Replacement Color'
            className='w-full'
            render={({field})=>(
              <Input
              value={field.value}
                className='input-field'
                onChange={(e) => onInputChangeHandler(
                  'color',e.target.value,'recolor',field.onChange
                )}
              />
            )}
            />
          )}
            </div>
          )}

          <div className='media-uploader-field'>
          <CustomField
          control={form.control}
          name='publicId'
          className='flex size-full flex-col'
          render={({field})=>(
            <MediaUploader
            onValueChange = {field.onChange}
            setImage={setImage}
            publicId={field.value}
            image={image}
            type={type}
            />
          )}
          />

          <TransformedImage
          image={image}
          type={type}
          title={form.getValues().title}
          isTransforming={isTranforming}
          setIsTransforming={setisTranforming}
          transformationConfig={transformationConfig}
          />
          </div>
          <div className='flex flex-col gap-4'>
          <Button type='submit' className='submit-button'
          disabled={isTranforming || newTransformation === null} onClick={onTranformHandler}>
            {isTranforming ? "Tranforming ...":"Apply Transformation"}
          </Button>
          <Button type='submit' className='submit-button'
          disabled={isSubmitting}>{isSubmitting ? "Submitting ...": "Save Image"}</Button>
          </div>
       
        </form>
      </Form>
    </div>
  );
};

export default TransformationForm;
