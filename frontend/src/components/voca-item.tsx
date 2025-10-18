import { motion } from "framer-motion";

import { Bird, Check, Lightbulb } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Toggle } from "./ui/toggle";
import { UnderlinedSpan } from "./underlined-span";

type VocaItemProps = {
  word: string;
  sentence: string;
  meaning: string;
};

export function VocaItem({ word, sentence, meaning }: VocaItemProps) {
  const [state, setState] = useState<"idle" | "descripted" | "easy">(
    "idle"
  );
  const isEasy = state === "easy";
  const isDescripted = state === "descripted";

  const handleEasyToggle = () => {
    setState((prev) => (prev === "easy" ? "idle" : "easy"));
  };

  const handleAccordionChange = (value: string) => {
    setState(value ? "descripted" : "idle");
  };

  return (
    <motion.div layout className="my-10">
      <div className="flex items-center gap-4">
        <UnderlinedSpan sentence={sentence} word={word} />
        <Toggle
          size="lg"
          onClick={handleEasyToggle}
          className={cn(isDescripted && "invisible")}
        >
          <Check className="h-6 w-6" />
        </Toggle>
      </div>

      <Accordion
        type="single"
        collapsible
        className="flex-1"
        onValueChange={handleAccordionChange}
        disabled={isEasy}
      >
        <AccordionItem value="description">
          <AccordionTrigger>{word}?</AccordionTrigger>
          <AccordionContent className="ml-6">
            <div className="pr-8">{meaning}</div>

          <ToggleGroup type="single" size="lg" className="mt-2 ml-auto">
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
