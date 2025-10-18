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
import { Button } from "./ui/button";
import { UnderlinedSpan } from "./underlined-span";

type VocaItemProps = {
  word: string;
  sentence: string;
  meaning: string;
};

export function VocaItem({ word, sentence, meaning }: VocaItemProps) {
  const [state, setState] = useState<"idle" | "descripted" | "checked">(
    "idle"
  );

  const handleAccordionChange = (value: string) => {
    if (state === "checked") return;
    if (value) {
      setState("descripted");
    } else {
      setState("idle");
    }
  };

  const handleCheck = () => {
    if (state === "checked") {
      setState("idle");
    } else {
      setState("checked");
    }
  };

  return (
    <div className={cn("my-10", state === "checked" && "opacity-50")}>
      <div className="flex items-center gap-4">
        <UnderlinedSpan sentence={sentence} word={word} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCheck}
          className={cn(state === "descripted" && "invisible")}
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        className="flex-1"
        onValueChange={handleAccordionChange}
        disabled={state === "checked"}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>{word}?</AccordionTrigger>
          <AccordionContent className="ml-6">
            <div className="pr-8">{meaning}</div>

          <ToggleGroup type="single" size="lg" className="mt-2 ml-auto">
            <ToggleGroupItem value="expected">
              <Check />
            </ToggleGroupItem>
            <ToggleGroupItem value="aha">
              <Lightbulb />
            </ToggleGroupItem>
            <ToggleGroupItem value="bird">
              <Bird />
            </ToggleGroupItem>
          </ToggleGroup>
            
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
