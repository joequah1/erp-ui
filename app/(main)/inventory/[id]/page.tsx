import InventoryDetailPage from '../InventoryDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <InventoryDetailPage id={id} />;
}
