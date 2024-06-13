'use client';
import BreadCrumb from '@/components/breadcrumb';
import Listbanner from '@/components/shared/list-banner';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import axios, { accessToken } from '@/lib/axios';
import Loading from '@/lib/loading';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from 'react-query';

const breadcrumbItems = [{ title: 'Banner', link: '/dashboard/banner' }];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function page({ searchParams }: paramsProps) {
  const [query, setQuery] = useState<string>('');
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['banner', query],
    queryFn: async () => {
      const response = await axios.get(`/banner?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.data.video;
      return data;
    }
  });

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Banner Video (${data ? data.length : 0})`}
            description="List of all banner video."
          />
          {/* 
          <Link
            href={'/dashboard/banner/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link> */}
        </div>
        <Separator />

        <div className="">
          <form className="mx-auto max-w-md">
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                <svg
                  className="h-4 w-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                id="default-search"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Search"
                required
              />
              <button
                type="submit"
                className="absolute bottom-2.5 end-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <ScrollArea className="h-[70vh] pb-24">
            <div className="grid grid-cols-2 gap-6">
              {data &&
                data.map((item: any) => (
                  <Listbanner
                    key={item.id}
                    data={item}
                    isLoading={isLoading}
                    refetch={refetch}
                  />
                ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </>
  );
}
