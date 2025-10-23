"use client";
import { useParams } from 'next/navigation';
import InventoryDetailPage from '../InventoryDetailPage';

export default function Page() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id as string;
  return <InventoryDetailPage id={id} />;
}
