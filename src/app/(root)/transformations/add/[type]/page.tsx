import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import React from 'react';

type TransformationType = keyof typeof transformationTypes;

interface SearchParamProps {
  params: {
    type: TransformationType;
  };
}

const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  const { type } = await params;
  
  const transformation = transformationTypes[type];

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <TransformationForm />
    </>
  );
};

export default AddTransformationTypePage;
