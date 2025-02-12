import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { streamKeySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function StreamKeyForm() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(streamKeySchema),
    defaultValues: {
      streamKey: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { streamKey: string }) => {
      await apiRequest("POST", "/api/stream/key", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stream/status"] });
      toast({
        title: "Success",
        description: "Stream key configured successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to configure stream key",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="streamKey"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter your YouTube stream key"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-[#CC0000]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Configuring..." : "Configure Stream"}
        </Button>
      </form>
    </Form>
  );
}
