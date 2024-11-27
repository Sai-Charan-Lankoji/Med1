"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Paintbrush, Store } from "lucide-react";
import { Button } from "@medusajs/ui";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster, toast } from "@medusajs/ui";

const templates = [
  {
    id: "modern",
    name: "Modern Boutique",
    description: "A clean, modern design perfect for fashion and accessories",
  },
  {
    id: "minimal",
    name: "Minimal Store",
    description: "Minimalist design focusing on product presentation",
  },
  {
    id: "vintage",
    name: "Vintage Shop",
    description: "Classic design with a retro feel",
  },
];

const storeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Store name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  template: z.string({
    required_error: "Please select a template.",
  }),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

interface StoreCreationProps {
  onStoreCreated: () => void;
}

const   StoreCreation = ({ onStoreCreated }: StoreCreationProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: StoreFormValues) {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to create the store
      // For demo purposes, we&apos;ll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast.success("Success", {
        description: "Store Updated Successfully.",
        duration: 1000,
      });

      onStoreCreated();
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong.",
        duration: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-8">
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Create Your Store</h2>
        </div>
        <p className="text-muted-foreground mt-2">
          Set up your store and choose a template to get started.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your store name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be your store&apos;s URL and display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe your store"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  A brief description of your store and what you sell.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="template"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Template</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id}
                        className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <Paintbrush className="h-4 w-4" />
                        </span>
                        <div className="flex flex-col">
                          <span className="font-medium">{template.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {template.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose a template for your store&apos;s design.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Store..." : "Create Store"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default StoreCreation;