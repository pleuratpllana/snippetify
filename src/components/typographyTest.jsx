function TypographyTest() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Headings */}
      <h1>Heading 1 - Space Grotesk</h1>
      <h2>Heading 2 - Space Grotesk</h2>
      <h3>Heading 3 - Space Grotesk</h3>
      <h4>Heading 4 - Space Grotesk</h4>
      <h5>Heading 5 - Space Grotesk</h5>
      <h6>Heading 6 - Space Grotesk</h6>

      {/* Paragraphs */}
      <p>
        This is a paragraph using Inter. It demonstrates your predefault body
        typography.
        <a href="#"> This is a link with accent color</a> inside the paragraph.
      </p>

      {/* Lists */}
      <ul>
        <li>Unordered list item one</li>
        <li>Unordered list item two</li>
        <li>Unordered list item three</li>
      </ul>

      <ol>
        <li>Ordered list item one</li>
        <li>Ordered list item two</li>
        <li>Ordered list item three</li>
      </ol>

      {/* Buttons */}
      <button>Primary Accent Button</button>

      {/* Accent examples */}
      <p>
        You can also use the <span className="accent">.accent</span> class for
        inline text and{" "}
        <span className="bg-accent px-2 py-1 rounded">.bg-accent</span> for
        background highlights.
      </p>
    </div>
  );
}

export default TypographyTest;
