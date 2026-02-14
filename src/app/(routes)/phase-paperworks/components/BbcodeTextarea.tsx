"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type BbcodeTool = {
  label: string;
  tag?: string;
  snippet?: string;
};

type BbcodeTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
};

const bbcodeTools: BbcodeTool[] = [
  { label: "B", tag: "b" },
  { label: "I", tag: "i" },
  { label: "U", tag: "u" },
  { label: "Quote", tag: "quote" },
  { label: "Code", tag: "code" },
  { label: "List Item", snippet: "[*]" },
  { label: "List", snippet: "[list]\n[*]\n[/list]" },
  { label: "URL", snippet: "[url][/url]" },
];

export function BbcodeTextarea({
  value,
  onChange,
  className,
  placeholder,
  readOnly,
}: BbcodeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string, selectionStart: number, selectionEnd: number) => {
    const nextValue =
      value.slice(0, selectionStart) + text + value.slice(selectionEnd);

    onChange(nextValue);

    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      const caretPosition = selectionStart + text.length;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(caretPosition, caretPosition);
    });
  };

  const applyTool = (tool: BbcodeTool) => {
    if (!textareaRef.current || readOnly) return;

    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const selectedText = value.slice(selectionStart, selectionEnd);

    if (tool.tag) {
      const openTag = `[${tool.tag}]`;
      const closeTag = `[/${tool.tag}]`;

      const textToInsert = selectedText
        ? `${openTag}${selectedText}${closeTag}`
        : `${openTag}${closeTag}`;

      const nextValue =
        value.slice(0, selectionStart) + textToInsert + value.slice(selectionEnd);

      onChange(nextValue);

      requestAnimationFrame(() => {
        if (!textareaRef.current) return;

        textareaRef.current.focus();

        if (selectedText) {
          const selectedStart = selectionStart + openTag.length;
          const selectedEnd = selectedStart + selectedText.length;
          textareaRef.current.setSelectionRange(selectedStart, selectedEnd);
          return;
        }

        const caretPosition = selectionStart + openTag.length;
        textareaRef.current.setSelectionRange(caretPosition, caretPosition);
      });

      return;
    }

    if (tool.snippet) {
      insertText(tool.snippet, selectionStart, selectionEnd);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {bbcodeTools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            size="sm"
            variant="outline"
            onClick={() => applyTool(tool)}
            disabled={readOnly}
          >
            {tool.label}
          </Button>
        ))}
      </div>

      <Textarea
        ref={textareaRef}
        className={className}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
