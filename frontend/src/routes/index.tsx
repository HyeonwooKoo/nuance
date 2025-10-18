import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { VocaItem } from "../components/voca-item";
import { dummyItems as allVocaItems } from "../dummyItems";

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const [items, setItems] = useState(allVocaItems.slice(0, 20));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (items.length >= allVocaItems.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setItems(
        items.concat(allVocaItems.slice(items.length, items.length + 20))
      );
    }, 500);
  };

  return (
    <div className="mx-auto flex max-w-screen-sm flex-col gap-4 p-4">
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map((item) => (
          <VocaItem
            key={item.sentence}
            word={item.word}
            sentence={item.sentence}
            meaning={item.meaning}
          />
        ))}
      </InfiniteScroll>
    </div>
  )
}
