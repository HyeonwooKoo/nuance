import { motion } from "framer-motion";
import _ from "lodash";
import { Bird, Check, Lightbulb } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { useSentenceStore } from "@/store/sentence";

import type { Rating,Sentence } from "../types/voca";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Toggle } from "./ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { UnderlinedSpan } from "./underlined-span";

type VocaItemProps = {
  sentence: Sentence;
};

type VocaItemState = "idle" | "descripted" | Rating;

export function VocaItem({ sentence }: VocaItemProps) {
  const [state, setState] = useState<VocaItemState>("idle");
  const [isReviewed, setIsReviewed] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const isDescripted = state !== "idle" && state !== "easy";

  const { pushItem, reviewItem } = useSentenceStore((state) => state.actions);

  const setRating = (state: "idle" | Rating) => {
    setState(state);
    if (state !== "idle")
      setIsReviewed(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const postReview = useCallback(
    _.debounce(async (rating: Rating) => {
      setIsConfirmed(true);
      reviewItem(sentence.word.id, sentence.id, rating);
      pushItem();
    }, 0),
    [sentence.id]
  );
  
  useEffect(() => {
    if (state === "idle" || state === "descripted")
      postReview.cancel();
    else {
      postReview(state);
    }
  }, [state, postReview]);

  useEffect(() => {
  }, [isReviewed, pushItem]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="my-5"
    >
      <div className="flex items-center gap-4">
        <UnderlinedSpan sentence={sentence.text} word={sentence.word.term} />
        <Toggle
          size="lg"
          onPressedChange={(pressed) => setRating(pressed ? "easy" : "idle")}
          className={cn(isDescripted && "invisible")}
          disabled={isConfirmed}
        >
          <Check className="h-6 w-6" />
        </Toggle>
      </div>

      <Accordion
        type="single"
        collapsible
        className="flex-1"
        onValueChange={(value: "descripted") => setState(value || "idle")}
        disabled={state !== "idle" && state !== "descripted"}
      >
        <AccordionItem value="descripted">
          <AccordionTrigger>{sentence.word.term}?</AccordionTrigger>
          <AccordionContent className="ml-6">
            <div className="pr-8">{sentence.word.definition}</div>

          <ToggleGroup 
            type="single"
            size="lg"
            className="mt-2 ml-auto"
            onValueChange={(value: Rating) => {setRating(value || "descripted")}}
            disabled={isConfirmed}
          >
            <ToggleGroupItem value="good">
              <Check />
            </ToggleGroupItem>
            <ToggleGroupItem value="hard">
              <Lightbulb />
            </ToggleGroupItem>
            <ToggleGroupItem value="again">
              <Bird />
            </ToggleGroupItem>
          </ToggleGroup>
            
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}
