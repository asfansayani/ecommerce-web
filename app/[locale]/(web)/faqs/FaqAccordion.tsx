import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <Accordion className="border-t border-gray-200">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={`item-${item.id}`}
          className="border-gray-200"
        >
          <AccordionTrigger className="py-5 text-sm font-medium text-primary leading-snug hover:no-underline rounded-none **:data-[slot=accordion-trigger-icon]:text-[#A37C43]">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-600">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
