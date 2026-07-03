import { useToastStore } from '../store/toastStore'

/** Copy text to the clipboard and confirm with a toast. */
export function useCopyToClipboard() {
  const pushToast = useToastStore((s) => s.push)

  return async (value: string, label = 'Copied') => {
    try {
      await navigator.clipboard.writeText(value)
      pushToast(`${label} to clipboard`, 'success')
    } catch {
      pushToast('Could not copy — please try again', 'error')
    }
  }
}
