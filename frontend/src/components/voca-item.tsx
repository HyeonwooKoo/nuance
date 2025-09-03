import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type VocaItemProps = {
  word: string;
  sentence: string;
  meaning: string;
};

export function VocaItem({ word, sentence, meaning }: VocaItemProps) {
  const [state, setState] = useState<"idle" | "descripted" | "checked">(
    "idle"
  );

  const trigger = sentence.replace(
    word,
    `<span class="underline">${word}</span>`
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
    <div
      className={cn(
        "flex items-center gap-4",
        state === "checked" && "filter grayscale"
      )}
    >
      <Accordion
        type="single"
        collapsible
        className="flex-1"
        onValueChange={handleAccordionChange}
        disabled={state === "checked"}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div dangerouslySetInnerHTML={{ __html: trigger }} />
          </AccordionTrigger>
          <AccordionContent className="ml-6">{meaning}</AccordionContent>
        </AccordionItem>
      </Accordion>
      
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCheck}
          className={cn(state === "descripted" && "invisible")}
        >
          <Check
            className={cn(
              "h-6 w-6",
              state === "checked" && "text-green-500"
            )}
          />
        </Button>
    </div>
  );
}
