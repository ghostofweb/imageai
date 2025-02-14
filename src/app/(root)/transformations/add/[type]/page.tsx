import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

type TransformationType = keyof typeof transformationTypes;

interface AddTransformationTypePageProps {
  params: { type: TransformationType };
}

export default async function AddTransformationTypePage({
  params,
}: AddTransformationTypePageProps) {
  const { type } = params;

  const { userId } = await auth(); 

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
        userId={user._id}
        type={transformation.type}
        creditBalance={user.creditBalance}
        data={null}
      />
    </>
  );
}