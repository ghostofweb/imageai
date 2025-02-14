import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

type TransformationType = keyof typeof transformationTypes;

interface SearchParamProps {
  params: {
    type: TransformationType;
  };
}

// Note: Change the function to be `async` and receive `SearchParamProps` correctly
const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  const { type } = params; // Access params directly, no need for `await`

  const { userId } = await auth(); // Get userId from auth

  // Handle the case where userId might be null
  if (!userId) {
    redirect('/sign-in');
  }

  const transformation = transformationTypes[type];
  const user = await getUserById(userId);

  return (
    <>
      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <TransformationForm
        action="Add"
        userId={user._id}  // Pass only the userId, not the entire user object
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
        data={null} // Pass null for the data prop if you're creating a new transformation
      />
    </>
  );
};

export default AddTransformationTypePage;
