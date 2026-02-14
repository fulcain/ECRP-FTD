"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type BbcodeTool =
  | {
      label: string;
      tag: string;
      type: "wrap";
    }
  | {
      label: string;
      snippet: string;
      type: "insert";
    }
  | {
      label: string;
      type: "listItem";
    };

type BbcodeTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
};

const bbcodeTools: BbcodeTool[] = [
  { label: "B", tag: "b", type: "wrap" },
  { label: "I", tag: "i", type: "wrap" },
  { label: "U", tag: "u", type: "wrap" },
  { label: "Quote", tag: "quote", type: "wrap" },
  { label: "Code", tag: "code", type: "wrap" },
  { label: "List Item", type: "listItem" },
  { label: "List", snippet: "[list]\n[*]\n[/list]", type: "insert" },
  { label: "URL", snippet: "[url][/url]", type: "insert" },
];

export function BbcodeTextarea({
  value,
  onChange,
  className,
  placeholder,
  readOnly,
}: BbcodeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusCaret = (position: number, selectionEnd = position) => {
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(position, selectionEnd);
    });
  };

  const insertText = (text: string, selectionStart: number, selectionEnd: number) => {
    const nextValue =
      value.slice(0, selectionStart) + text + value.slice(selectionEnd);

    onChange(nextValue);
    focusCaret(selectionStart + text.length);
  };

  const insertListItem = (selectionStart: number) => {
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextValue = `${value.slice(0, lineStart)}[*]${value.slice(lineStart)}`;

    onChange(nextValue);
    const nextCaret = selectionStart + 3;
    focusCaret(nextCaret, nextCaret);
  };

  const wrapWithTag = (tag: string, selectionStart: number, selectionEnd: number) => {
    const selectedText = value.slice(selectionStart, selectionEnd);
    const openTag = `[${tag}]`;
    const closeTag = `[/${tag}]`;

    const textToInsert = selectedText
      ? `${openTag}${selectedText}${closeTag}`
      : `${openTag}${closeTag}`;

    const nextValue =
      value.slice(0, selectionStart) + textToInsert + value.slice(selectionEnd);

    onChange(nextValue);

    if (selectedText) {
      const wrappedStart = selectionStart + openTag.length;
      focusCaret(wrappedStart, wrappedStart + selectedText.length);
      return;
    }

    focusCaret(selectionStart + openTag.length);
  };

  const applyTool = (tool: BbcodeTool) => {
    if (!textareaRef.current || readOnly) return;

    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;

    if (tool.type === "wrap") {
      wrapWithTag(tool.tag, selectionStart, selectionEnd);
      return;
    }

    if (tool.type === "listItem") {
      insertListItem(selectionStart);
      return;
    }

    insertText(tool.snippet, selectionStart, selectionEnd);
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
            onMouseDown={(e) => e.preventDefault()}
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
