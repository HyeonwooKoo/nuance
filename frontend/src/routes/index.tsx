import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

import { useAuthStore } from '@/store/auth';

import { VocaItem } from "../components/voca-item";
import { Spinner } from "../components/ui/spinner";
import { useSentenceStore } from '../store/sentence';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const user = useAuthStore((state) => state.user);
  const items = useSentenceStore((state) => state.items);
  const isWaiting = useSentenceStore((state) => state.isWaiting);
  const init = useSentenceStore((state) => state.actions.init);

  useEffect(() => {
    if (user)
      init();
  }, [user, init]);

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-4 p-4">
      {items.map((sentence) => (
        <VocaItem
          key={sentence.id}
          sentence={sentence}
        />
      ))}
      {isWaiting && <Spinner className="mx-auto" />}
    </div>
  )
}
