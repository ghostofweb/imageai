export const dynamic = 'force-dynamic';
import { Collection } from '@/components/shared/Collection';
import { navLinks } from '@/constants';
import { getAllImages } from '@/lib/actions/image.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Define the interface to match what Next.js gives you
export interface PageProps {
  params: {
    // If you have dynamic segments, they go here
    [key: string]: string;
  };
  searchParams: {
    query?: string;
    page?: string;
    // You can add more query params if needed
    [key: string]: string | undefined;
  };
}

const Home = async ({ searchParams }: PageProps) => {
  // No need to await searchParams because it's a plain object now
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const searchQuery = (params?.query as string) || '';

  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section className="home">
        <h1 className="home-heading">
          Unleash Your Creative Vision with ImageAi
        </h1>
        <ul className="flex-center w-full gap-20">
          {navLinks.slice(1, 5).map((link) => (
            <Link
              key={link.route}
              href={link.route}
              className="flex-center flex-col gap-2"
            >
              <li className="flex-center w-fit rounded-full bg-white p-4">
                <Image src={link.icon} alt="image" width={24} height={24} />
              </li>
              <p className="p-14-medium text-center text-white">
                {link.label}
              </p>
            </Link>
          ))}
        </ul>
      </section>

      <section className="sm:mt-12">
        <Collection 
          hasSearch={true}
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
