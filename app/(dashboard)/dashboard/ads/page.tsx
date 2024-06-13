'use client';
import BreadCrumb from '@/components/breadcrumb';
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
import { toast } from 'sonner';
interface Ad {
  _id: string;
  title: string;
  link: string;
  video: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
const breadcrumbItems = [{ title: 'Ads', link: '/dashboard/ads' }];

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
      const response = await axios.get(`/ads?query=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.data;
      return data;
    }
  });
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await axios.put<Ad>(`/ads/active/${id}`, {
        id,
        active: !currentStatus
      });
      if (response.status === 200) {
        toast.success('Ad updated successfully');
        refetch();
      }
      refetch();
    } catch (error) {
      toast.error('Error updating ad');
      console.error('Error updating ad:', error);
    }
  };

  if (isLoading) return <Loading />;
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Banner Video (${data ? data.length : 0})`}
            description="List of all banner video."
          />

          <Link
            href={'/dashboard/ads/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
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
        <ScrollArea className="h-[60vh]">
          <section>
            <div className="container mx-auto p-4">
              <h1 className="mb-4 text-2xl font-bold">Ads Admin</h1>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((ad: any) => (
                  <div key={ad._id} className="rounded-lg border p-4 shadow-lg">
                    <h2 className="mb-2 text-xl font-semibold">{ad.title}</h2>
                    <p className="mb-2">{ad.link}</p>

                    <video
                      className="w-full"
                      src={ad.video}
                      controls
                      autoPlay
                      loop
                      muted
                    ></video>

                    <p className="mb-2">
                      <span className="font-semibold">Created At:</span>{' '}
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mb-2">
                      <span className="font-semibold">Updated At:</span>{' '}
                      {new Date(ad.updatedAt).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => toggleActive(ad._id, ad.active)}
                      className={`rounded-lg px-4 py-2 ${
                        ad.active ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}
                    >
                      {ad.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollArea>
      </div>
    </>
  );
}
