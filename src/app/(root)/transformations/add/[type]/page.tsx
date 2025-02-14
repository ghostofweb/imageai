import Header from '@/components/shared/Header';
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants';
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type TransformationType = keyof typeof transformationTypes;

type PageProps = any;

export default async function AddTransformationTypePage({
  params,
}: {
  params: { type: TransformationType };
} & PageProps) {
  const { type } = params;
  const { userId } = await auth();

  if (!userId) redirect('/sign-in');

  const user = await getUserById(userId);
  const transformation = transformationTypes[type as keyof typeof transformationTypes];

  return (
    <>
      <Header title={transformation.title} subtitle={transformation.subTitle} />
      <TransformationForm
        action="Add"
        userId={user._id}
        type={transformation.type as TransformationType}
        creditBalance={user.creditBalance}
        data={null}
      />
    </>
  );
}