'use server'
import { revalidatePath } from 'next/cache'
import { updateOrderStatus, updateProductStatus } from '@/lib/admin-api'
import type { Order, Product } from '@/lib/types'

export async function setOrderStatus(orderId: string, status: Order['status']) {
  await updateOrderStatus(orderId, status)
  revalidatePath('/admin/orders')
  revalidatePath('/admin')
}

export async function setProductStatus(productId: number, status: Product['status']) {
  await updateProductStatus(productId, status)
  revalidatePath('/admin/products')
}
