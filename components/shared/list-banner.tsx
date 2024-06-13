import axios from '@/lib/axios';
import Image from 'next/image';
import React, { useState } from 'react';

interface BannerData {
  _id: string;
  thumbnail: string;
  title: string;
  description: string;
  viewsId: string[];
  duration: string;
  language: string;
  is_active_video?: boolean;
  is_banner_video?: boolean;
  category: string;
}

interface ListBannerProps {
  data: BannerData;
  isLoading: boolean;
  refetch?: any;
}

const ListBanner: React.FC<ListBannerProps> = ({
  data,
  isLoading,
  refetch
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);

  const toggleActiveState = async (video_id: string) => {
    // setIsActive(!isActive);
    refetch();
    const response = await axios.post(`/banner/active/${video_id}`);
    if (response.status === 200) {
      setIsActive(!isActive);
      refetch();
    }
    refetch();
  };

  return (
    <div className="max-w-lg rounded-3xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <a href="#">
        <Image
          width={640}
          height={427}
          className="h-[300px] rounded-3xl object-cover"
          src={data.thumbnail}
          alt=""
        />
      </a>
      <div className="p-5">
        <a href="#">
          <h5 className="mb-2 line-clamp-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {data.title}
          </h5>
        </a>
        <p className="mb-3 line-clamp-3 font-normal text-gray-700 dark:text-gray-400">
          {data.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              {data.viewsId.length} views
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              {data.duration}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              {data.language}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-600 dark:text-gray-300">
              {data.category}
            </span>
          </div>
        </div>

        <div className="mt-3">
          <button
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              data.is_active_video
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
            onClick={() => toggleActiveState(data._id)}
          >
            {data.is_active_video ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListBanner;
