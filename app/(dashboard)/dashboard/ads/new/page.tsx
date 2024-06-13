'use client';

import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(2).max(100),
  video: z.any(),
  link: z.string()
});

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios, { accessToken } from '@/lib/axios';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const page = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      video: '',
      link: ''
    }
  });
  const [video, setVideo] = useState<File | null>(null);
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formData = new FormData();
    formData.append('ads_video', video as File);
    formData.append('title', values.title);
    formData.append('link', values.link);
    const response = await axios.post(`/ads`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log(response);
    if (response.status === 201) {
      toast.success('Ads created successfully');
      router.push('/dashboard/ads');
    } else {
      toast.error(response.data.error);
    }
  }

  return (
    <div className="px-24 py-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ads Video</FormLabel>
                <FormControl>
                  <Input
                    className=""
                    onChange={async (e: any) => {
                      console.log('working', e.target.files[0]);
                      const video = e.target.files[0];
                      if (video) {
                        setVideo(e.target.files[0]);
                      }
                    }}
                    type="file"
                    placeholder={`Enter   a Ads Video`}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input placeholder="Link" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
