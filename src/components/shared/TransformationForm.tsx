"use client"
import React, { useState } from 'react'
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
import { defaultValues, transformationTypes } from '@/constants'
import { CustomField } from './CustomeField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Define a type for transformation data (you may adjust as needed)
type Transformations = {
  title: string;
  aspectRatio?: string;
  color?: string;
  prompt?: string;
  publicId: string;
};

// Define form schema using Zod
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  publicId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Define a type for the transformation keys
export type TransformationType = keyof typeof transformationTypes;

interface TransformationFormProps {
  action: string;
  userId: string; // Only the userId string
  type: TransformationType; // Use the proper key type here
  creditBalance: number;
  data: { title: string; aspectRatio?: string; color?: string; prompt?: string; publicId: string } | null;
}

const TransformationForm = ({
  action,
  userId,
  type,
  creditBalance,
  data = null,
}: TransformationFormProps) => {
  // Now 'type' is correctly typed, so we can index transformationTypes safely.
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data);  // Handle form submission here
  };

  // Optional select field handler (if needed)
  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    // Handle select change here
  };

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
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default TransformationForm;
