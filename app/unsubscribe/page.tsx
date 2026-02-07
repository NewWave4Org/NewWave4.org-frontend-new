import UnsubscribeResult from "@/components/UnsubscribePage/UnsubscribeResult";
import { redirect } from "next/navigation";

export default async function UnSubscribe({searchParams}: {searchParams: Promise<{id?: string}>}) {

  const { id } = await searchParams;

  if (!id) {
    redirect('/');
  }

  return (
    <UnsubscribeResult id={id} />
  );
}
