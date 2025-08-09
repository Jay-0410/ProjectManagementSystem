import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export const tags = [
  "all",
  "fullstack",
  "frontend",
  "backend",
  "mobile",
  "devops",
  "data science",
  "design",
  "qa",
  "project management"
]
const Tags = () => {
  return (
    <div>
        <Card className="py-3">
        <div className="px-2 ">
          <p className="text-gray-700 pb-2 border-b">Use Combobox</p>
        </div>
        <div>
          <ScrollArea className="h-[25vh] px-3">
            <RadioGroup>
              {tags.map((tag, index) => {
                return (
                  <div className="flex items-center gap-2" key={index}>
                    <RadioGroupItem value={tag} id={`tag-${index}`} />
                    <Label htmlFor={`tag-${index}`}>{tag}</Label>

                  </div>
                )
              })}
            </RadioGroup>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};

export default Tags;
