import { useRouter, useSearchParams } from "next/navigation";

export const useModalQuery = (paramkey: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get(paramkey);
  const isOpen = !!id;

  const openModal = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramkey, id);
    router.push(`?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramkey);
    router.push(`?${params.toString()}`);
  };

  return { id, isOpen, openModal, closeModal };
};
