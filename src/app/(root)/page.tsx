export const dynamic = 'force-dynamic';

import { Collection } from '@/components/shared/Collection';
import { navLinks } from '@/constants';
import { getAllImages } from '@/lib/actions/image.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// Define a helper type so the values can be either plain or promises.
type Awaitable<T> = T | Promise<T>;

interface Props {
  params: Awaitable<{ [key: string]: string }>;
  searchParams: Awaitable<{ query?: string; page?: string }>;
}

const Home = async ({ params, searchParams }: Props) => {
  // Use Promise.resolve to handle both promise and plain object cases
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const page = Number(resolvedSearchParams.page) || 1;
  const searchQuery = resolvedSearchParams.query || '';

  // If you need params later, you can do the same:
  // const resolvedParams = await Promise.resolve(params);

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
