import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CodeBlock({ language, code }) {
  return (
    <SyntaxHighlighter
      language={language || "javascript"}
      style={oneDark}
      customStyle={{
        borderRadius: "10px",
        padding: "15px",
        fontSize: "14px"
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;