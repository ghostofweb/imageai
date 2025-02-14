"use client"
import React from 'react'
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
import { defaultValues } from '@/constants'
import { CustomField } from './CustomeField'
// Define formSchema before using it in useForm
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  publicId: z.string(),
})

type FormValues = z.infer<typeof formSchema>;

interface TransformationFormProps {
  action: string;
  userId: string; // Expect userId to be a string, not the entire user object
  type: any;
  creditBalance: number;
  data: { title: string; aspectRatio?: string; color?: string; prompt?: string; publicId: string } | null;
}

const TransformationForm = ({ action, userId, type, creditBalance, data = null }: TransformationFormProps) => {
  const initialValues = data && action === 'Update' 
    ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
      }
    : defaultValues;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);  // Handle form submission here
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomField
          control={form.control}
          name="title"
          formLabel='Image Title'
          className='w-full'
          render={({field})=><Input {...field} className='input-field'/>}
          />
        </form>
      </Form>
    </div>
  );
};

export default TransformationForm
