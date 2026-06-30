import { useToastStore, type ToastTone } from '@/store/toastStore'

export function showToast(message: string, tone: ToastTone = 'success') {
  useToastStore.getState().push(message, tone)
}
