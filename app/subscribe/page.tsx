import SubscribeResult from "@/components/SubscribePage/SubscribeResult";
import { redirect } from "next/navigation";

export default async function Subscribe({searchParams}: {searchParams: Promise<{token?: string}>}) {

  const { token } = await searchParams;

  if (!token) {
    redirect('/');
  }

  return (
    <SubscribeResult token={token} />
  );
}
