"use client";

import { useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type BbcodeTool =
  | {
      label: string;
      tag: string;
      type: "wrap";
      shortcut?: string;
    }
  | {
      label: string;
      snippet: string;
      type: "insert";
      shortcut?: string;
    }
  | {
      label: string;
      type: "listItem";
      shortcut?: string;
    };

type BbcodeTextareaProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
};

const bbcodeTools: BbcodeTool[] = [
  { label: "B", tag: "b", type: "wrap", shortcut: "Ctrl+B" },
  { label: "I", tag: "i", type: "wrap", shortcut: "Ctrl+I" },
  { label: "U", tag: "u", type: "wrap", shortcut: "Ctrl+U" },
  { label: "Quote", tag: "quote", type: "wrap", shortcut: "Ctrl+Q" },
  { label: "Code", tag: "code", type: "wrap", shortcut: "Ctrl+8" },
  { label: "List Item [*]", type: "listItem", shortcut: "Ctrl+9" },
  {
    label: "List",
    snippet: "[list]\n[*]\n[/list]",
    type: "insert",
    shortcut: "Ctrl+L",
  },
  { label: "URL", tag: "url", type: "wrap", shortcut: "Ctrl+Shift+U" },
];

/**
 * Rich-text BBCode editor stub for the paperwork forms.
 *
 * Exposes a toolbar that wraps the selection in [b]/[i]/[u]/[quote]/[code]
 * tags, inserts list scaffolding, and binds Ctrl-key shortcuts
 * (Ctrl+B/I/U/Q/8/9/L and Ctrl+Shift+U for URL). Wrapping/insertion is
 * performed imperatively on the underlying `<textarea>` so the caret is
 * repositioned after each tool application.
 *
 * Designed to be a drop-in replacement for a plain `<Textarea>`; it
 * forwards every prop to the underlying textarea via the className / value
 * / placeholder / readOnly props and an `onChange(string)` callback.
 */
export function BbcodeTextarea({
  value,
  onChange,
  className,
  placeholder,
  readOnly,
}: BbcodeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // requestAnimationFrame defers caret positioning until after the textarea
  // commits any pending `value` change triggered by the same call — without
  // it the browser would clobber our selection with the freshly-clamped value.
  const focusCaret = (position: number, selectionEnd = position) => {
    requestAnimationFrame(() => {
      if (!textareaRef.current) return;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(position, selectionEnd);
    });
  };

  const insertText = (
    text: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
    const nextValue =
      value.slice(0, selectionStart) + text + value.slice(selectionEnd);

    onChange(nextValue);
    focusCaret(selectionStart + text.length);
  };

  const insertListItem = (selectionStart: number) => {
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const nextValue = `${value.slice(0, lineStart)}[*] ${value.slice(
      lineStart,
    )}`;

    onChange(nextValue);
    const nextCaret = selectionStart + 3;
    focusCaret(nextCaret, nextCaret);
  };

  const wrapWithTag = (
    tag: string,
    selectionStart: number,
    selectionEnd: number,
  ) => {
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!textareaRef.current) return;
      if (document.activeElement !== textareaRef.current) return;
      if (readOnly) return;

      if (!e.ctrlKey) return;

      const key = e.key.toLowerCase();

      if (key === "b") {
        e.preventDefault();
        applyTool(bbcodeTools[0]);
      }
      if (key === "i") {
        e.preventDefault();
        applyTool(bbcodeTools[1]);
      }
      if (key === "u" && !e.shiftKey) {
        e.preventDefault();
        applyTool(bbcodeTools[2]);
      }
      if (key === "q") {
        e.preventDefault();
        applyTool(bbcodeTools[3]);
      }
      if (key === "8") {
        e.preventDefault();
        applyTool(bbcodeTools[4]);
      }
      if (key === "9") {
        e.preventDefault();
        applyTool(bbcodeTools[5]);
      }
      if (key === "l") {
        e.preventDefault();
        applyTool(bbcodeTools[6]);
      }
      if (key === "u" && e.shiftKey) {
        e.preventDefault();
        applyTool(bbcodeTools[7]);
      }
    };

    // Bind the handler at the window level so Ctrl-shortcuts work even when
    // focus is on sibling controls (toolbar buttons, etc.). We re-bind on
    // `value`/`readOnly` rather than every render so a keypress mid-flight
    // can't be lost when `applyTool` is re-created.
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // `applyTool` is derived from `value`, `readOnly`, and `textareaRef`,
    // which are already tracked here. Including it directly would force a
    // window-level listener tear-down + re-bind on every render (since
    // `applyTool` is not memoized) which loses keypresses mid-flight.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, readOnly]);

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

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
        {bbcodeTools.map((tool) => (
          <span key={tool.label} className="whitespace-nowrap">
            <span className="font-medium">{tool.label}</span>{" "}
            <span className="opacity-70">({tool.shortcut})</span>
          </span>
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
