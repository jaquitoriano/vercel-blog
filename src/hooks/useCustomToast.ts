'use client';

import { Toast, ToastProps } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export const useCustomToast = () => {
  const { toast } = useToast();

  return {
    toast: (props: ToastProps) => {
      toast(props);
    },
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: 'default',
      });
    },
    error: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: 'destructive',
      });
    },
  };
};