"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { batchesApi, batchItemsApi, inventoryApi, currenciesApi } from "@/services/api";
import { InventoryItem, Currency, BatchItem } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { batchSchema, batchItemSchema, type BatchFormData, type BatchItemFormData } from "@/validation/schemas";

export default function BatchCreatePage() {
  const router = useRouter();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [formData, setFormData] = useState<BatchFormData>({
    containerNumber: '',
    eta: '',
    arrivalDate: '',
    status: 'pending',
    notes: ''
  });
  const [batchItems, setBatchItems] = useState<(BatchItemFormData & { id: string; sgdCost: number })[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadOptions = async () => {
    try {
      const [inventoryResult, currenciesResult] = await Promise.all([
        inventoryApi.getAll({ perPage: 1000 }),
        currenciesApi.getAll()
      ]);
      setInventoryItems(inventoryResult.data);
      setCurrencies(currenciesResult);
    } catch (error) {
      console.error('Failed to load options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addBatchItem = () => {
    const newItem = {
      id: Date.now().toString(),
      inventoryItemId: '',
      quantity: 1,
      cost: 0,
      currency: 'SGD',
      sgdCost: 0
    };
    setBatchItems(prev => [...prev, newItem]);
  };

  const removeBatchItem = (id: string) => {
    setBatchItems(prev => prev.filter(item => item.id !== id));
  };

  const updateBatchItem = (id: string, field: keyof BatchItemFormData, value: any) => {
    setBatchItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'currency' || field === 'cost') {
          const currency = currencies.find(c => c.code === updatedItem.currency);
          updatedItem.sgdCost = currency ? updatedItem.cost / currency.rate : updatedItem.cost;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotalValue = () => {
    return batchItems.reduce((sum, item) => sum + (item.sgdCost * item.quantity), 0);
  };

  const calculateTotalItems = () => {
    return batchItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const batchResult = batchSchema.safeParse({
      ...formData,
      arrivalDate: formData.arrivalDate || undefined
    });
    if (!batchResult.success) {
      const fieldErrors: Record<string, string> = {};
      batchResult.error.issues.forEach((error) => {
        if (typeof error.path[0] === 'string' || typeof error.path[0] === 'number') {
          fieldErrors[String(error.path[0])] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    const itemErrors: Record<string, string> = {};
    batchItems.forEach((item, index) => {
      const itemResult = batchItemSchema.safeParse(item);
      if (!itemResult.success) {
        itemResult.error.issues.forEach((error) => {
          if (typeof error.path[0] === 'string' || typeof error.path[0] === 'number') {
            itemErrors[`item-${index}-${String(error.path[0])}`] = error.message;
          }
        });
      }
    });
    if (Object.keys(itemErrors).length > 0) {
      setErrors(itemErrors);
      return;
    }
    if (batchItems.length === 0) {
      setErrors({ items: 'At least one batch item is required' });
      return;
    }
    setIsLoading(true);
    try {
      const batch = await batchesApi.create({
        ...batchResult.data,
        shopId: '1',
        createdBy: '1'
      });
      for (const item of batchItems) {
        await batchItemsApi.create({
          batchId: batch.id,
          inventoryItemId: item.inventoryItemId,
          quantity: item.quantity,
          cost: item.cost,
          currency: item.currency
        });
      }
      router.push('/batches');
    } catch (error) {
      console.error('Failed to create batch:', error);
      setErrors({
        containerNumber: error instanceof Error ? error.message : 'Failed to create batch'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = 'SGD') => {
    const currency = currencies.find(c => c.code === currencyCode);
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (isLoadingOptions) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => router.push('/batches')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Create Batch</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Container Number"
              name="containerNumber"
              value={formData.containerNumber}
              onChange={handleChange}
              error={errors.containerNumber}
              required
            />
            <Input
              label="ETA"
              name="eta"
              type="date"
              value={formData.eta}
              onChange={handleChange}
              error={errors.eta}
              required
            />
            <Input
              label="Arrival Date"
              name="arrivalDate"
              type="date"
              value={formData.arrivalDate}
              onChange={handleChange}
              error={errors.arrivalDate}
            />
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_transit', label: 'In Transit' },
                { value: 'arrived', label: 'Arrived' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              error={errors.status}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
            />
            {errors.notes && <div className="text-red-600 text-xs mt-1">{errors.notes}</div>}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Batch Items</h2>
            <Button type="button" size="sm" onClick={addBatchItem}>
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </div>
          {errors.items && <div className="text-red-600 text-sm mb-2">{errors.items}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-2 py-1 text-left">Inventory Item</th>
                  <th className="px-2 py-1 text-left">Quantity</th>
                  <th className="px-2 py-1 text-left">Cost</th>
                  <th className="px-2 py-1 text-left">Currency</th>
                  <th className="px-2 py-1 text-left">SGD Value</th>
                  <th className="px-2 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {batchItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">No items added.</td>
                  </tr>
                ) : (
                  batchItems.map((item, idx) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-2 py-1">
                        <Select
                          name="inventoryItemId"
                          value={item.inventoryItemId}
                          onChange={e => updateBatchItem(item.id, 'inventoryItemId', e.target.value)}
                          options={inventoryItems.map(i => ({ value: i.id, label: i.sku }))}
                          error={errors[`item-${idx}-inventoryItemId`]}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          name="quantity"
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => updateBatchItem(item.id, 'quantity', Number(e.target.value))}
                          error={errors[`item-${idx}-quantity`]}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          name="cost"
                          type="number"
                          min={0}
                          value={item.cost}
                          onChange={e => updateBatchItem(item.id, 'cost', Number(e.target.value))}
                          error={errors[`item-${idx}-cost`]}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Select
                          name="currency"
                          value={item.currency}
                          onChange={e => updateBatchItem(item.id, 'currency', e.target.value)}
                          options={currencies.map(c => ({ value: c.code, label: c.code }))}
                          error={errors[`item-${idx}-currency`]}
                        />
                      </td>
                      <td className="px-2 py-1">
                        {formatCurrency(item.sgdCost, 'SGD')}
                      </td>
                      <td className="px-2 py-1">
                        <Button type="button" variant="danger" size="sm" onClick={() => removeBatchItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-8 mt-4">
            <div className="text-sm text-gray-700">Total Items: <span className="font-semibold">{calculateTotalItems()}</span></div>
            <div className="text-sm text-gray-700">Total Value: <span className="font-semibold">{formatCurrency(calculateTotalValue(), 'SGD')}</span></div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push('/batches')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="w-4 h-4 mr-1" /> Create Batch
          </Button>
        </div>
      </form>
    </div>
  );
}
