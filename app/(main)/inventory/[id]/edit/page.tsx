import InventoryEditPage from '../../InventoryEditPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <InventoryEditPage id={id} />;
}
