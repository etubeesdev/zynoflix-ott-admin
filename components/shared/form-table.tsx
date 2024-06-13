'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';
import { useRouter } from 'next/navigation';
import { formdata } from '@/components/constants/service-provider-form-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
// import { uploadImage } from '@/lib/upload-img';
import { format } from 'date-fns';
import axios from '@/lib/axios';
import MultiSelect from '../ui/multi-select';
import { getUserId } from '@/lib/user_id';

// import MultiSelect from '../ui/multi-select';

const dynamicFormSchema = z.object(
  formdata.reduce(
    (acc: any, field: any) => {
      if (field.tag === 'date') {
        acc[field.name] = field.required
          ? z.date({
              required_error: 'A date of birth is required.'
            })
          : z.any();
      } else if (field.tag === 'tags') {
        acc[field.name] = field.required
          ? z.string().min(2, {
              message: `${field.title} must be at least 2 characters.`
            })
          : z.string();
      } else if (field.tag === 'file') {
        acc[field.name] = field.required ? z.any() : z.any();
      } else if (field.tag === 'checkbox') {
        acc[field.name] = field.required
          ? z.boolean().refine((val) => val === true, {
              message: `${field.title} is required.`
            })
          : z.boolean();
      } else if (field.tag === 'select') {
        acc[field.name] = field.required
          ? z.array(z.string()).nonempty({
              message: `${field.title} is required.`
            })
          : z.any();
      } else if (field.tag === 'number') {
        acc[field.name] = field.required
          ? z.number().min(1, {
              message: `${field.title} must be at least 1.`
            })
          : z.number();
      } else {
        // Handle text and other input types as strings
        acc[field.name] = field.required
          ? z.string().min(2, {
              message: `${field.title} must be at least 2 characters.`
            })
          : z.string();
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  )
);

const CreateFormSubmit = ({ status, response }: any) => {
  const [thumbnail, setThumbnail] = useState<any>('');
  const [previewVideo, setPreviewVideo] = useState<any>('');
  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: Object.fromEntries(
      formdata.map((field: any) => [field.name, ''])
    )
  });

  const router = useRouter();
  async function onSubmit(values: z.infer<typeof dynamicFormSchema>) {
    try {
      console.log(values, 'value');
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('language', values.language);
      formData.append('duration', values.duration);
      // thumbnail
      formData.append('thumbnail', thumbnail as File);
      // preview video
      formData.append('preview_video', previewVideo as File);
      formData.append('is_banner_video', 'true');
      formData.append('created_by_id', getUserId());
      formData.append('created_by_name', 'admin');
      const response1 = await axios.post(`/create/banner-video`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response1.status === 201) {
        toast.success('Banner video added successfully');
        router.push('/dashboard/banner');
      } else {
        toast.error('Banner video added failed please try again');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <div>
      <div className="px-8 py-4">
        <h1 className="py-2 text-2xl font-semibold">Add Banner Video </h1>
        <ScrollArea className="h-[90vh]">
          <div className="px-2 pb-24 pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {formdata?.map((item: any, index: any) => (
                  <div key={index} className="text-base">
                    {item.tag === 'text' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'number' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                className="w-full"
                                type="number"
                                onChange={(e) => {
                                  field.onChange(+e.target.value as number);
                                }}
                                placeholder={`Enter ${item.title}`}
                                // {...field}
                                value={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'price' ? (
                      <div className="flex items-center gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency</FormLabel>
                              <FormDescription>
                                {item.description}
                              </FormDescription>
                              <Select>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a currencies" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <ScrollArea className="max-h-60">
                                    <SelectItem value="USD">
                                      United States Dollar - USD - $
                                    </SelectItem>
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          key={item.name}
                          control={form.control}
                          name={item.name}
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>{item.title}</FormLabel>
                              <FormDescription>
                                {item.description}
                              </FormDescription>
                              <FormControl>
                                <Input
                                  className="w-full"
                                  type="number"
                                  placeholder={`Enter ${item.title}`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : item.tag === 'checkbox' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                className="h-4 w-4"
                                type="checkbox"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'date' ? (
                      <FormField
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{item.title}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={'outline'}
                                    className={cn(
                                      'w-[240px] pl-3 text-left font-normal',
                                      !field.value && 'text-muted-foreground'
                                    )}
                                  >
                                    {field.value ? (
                                      status === 'update' ? (
                                        <span>{field.value}</span>
                                      ) : (
                                        format(field.value, 'PPP')
                                      )
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  defaultMonth={new Date()}
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date: any) =>
                                    date > new Date() ||
                                    date < new Date('1900-01-01')
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'file' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                onChange={async (e: any) => {
                                  console.log('working', e.target.files[0]);
                                  if (item.name === 'thumbnail') {
                                    setThumbnail(e.target.files[0]);
                                  }

                                  if (item.name === 'preview_video') {
                                    setPreviewVideo(e.target.files[0]);
                                  }
                                }}
                                type="file"
                                placeholder={`Enter ${item.title}`}
                              />
                            </FormControl>
                            {field.value && (
                              <img
                                src={field.value}
                                className="mt-6 h-[300px] w-[400px] rounded-3xl border object-cover shadow-lg"
                                alt=""
                              />
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'tags' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Input
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'textarea' ? (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Textarea
                                rows={6}
                                className="w-full"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : item.tag === 'select' ? (
                      <FormField
                        control={form.control}
                        name={item.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <MultiSelect
                              status={status}
                              field={field}
                              name={item.name}
                              options={item.options}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        key={item.name}
                        control={form.control}
                        name={item.name}
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>{item.title}</FormLabel>

                            <FormControl>
                              <Textarea
                                rows={6}
                                className="w-full"
                                placeholder={`Enter ${item.title}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                ))}

                <Button className="" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CreateFormSubmit;
