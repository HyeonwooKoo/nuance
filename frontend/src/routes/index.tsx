import { createFileRoute } from '@tanstack/react-router'

import { VocaItem } from "../components/voca-item";
import { useSentenceStore } from '../store/sentence';

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const sentences = useSentenceStore((state) => state.items);

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-4 p-4">
      {sentences.map((sentence) => (
        <VocaItem
          key={sentence.id}
          sentence={sentence}
        />
      ))}
    </div>
  )
}
