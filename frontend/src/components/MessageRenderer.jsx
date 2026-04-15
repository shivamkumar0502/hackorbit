import { useState } from "react";
import CodeBlock from "./CodeBlock";

function MessageRenderer({ text }) {

const regex = /`(\w+)?\n([\s\S]*?)`/g;

const parts = [];
let lastIndex = 0;
let match;

while ((match = regex.exec(text)) !== null) {


if (match.index > lastIndex) {
  parts.push({
    type: "text",
    content: text.slice(lastIndex, match.index)
  });
}

parts.push({
  type: "code",
  language: match[1] || "javascript",
  content: match[2]
});

lastIndex = regex.lastIndex;


}

if (lastIndex < text.length) {
parts.push({
type: "text",
content: text.slice(lastIndex)
});
}

return ( <div className="space-y-3">
{parts.map((part, index) => {


    if (part.type === "code") {
      return (
        <CodeSection
          key={index}
          language={part.language}
          code={part.content}
        />
      );
    }

    return (
      <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
        {part.content}
      </p>
    );

  })}
</div>


);
}

function CodeSection({ language, code }) {

const [copied, setCopied] = useState(false);

const copyCode = () => {
navigator.clipboard.writeText(code);
setCopied(true);


setTimeout(() => {
  setCopied(false);
}, 2000);


};

return ( <div className="relative">

  {/* Language label */}
  <div className="flex justify-between items-center bg-base-300 px-3 py-1 rounded-t-md text-xs">

    <span>{language}</span>

    <button
      onClick={copyCode}
      className="text-xs hover:text-primary"
    >
      {copied ? "Copied!" : "Copy"}
    </button>

  </div>

  <CodeBlock language={language} code={code} />

</div>


);
}

export default MessageRenderer;
