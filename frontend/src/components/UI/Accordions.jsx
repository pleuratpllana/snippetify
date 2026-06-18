import { useState } from "react";
import Accordion from "./Accordion";

const Accordions = ({ className }) => {
  const items = [
    {
      title: "What is Snippetify and how does it work?",
      content:
        "Snippetly is an intuitive and robust tool for managing your code snippets. Store your snippets with full syntax highlighting, categorize them with tags, and find what you need instantly. Think of it as your personal library for all the code you rely on.",
    },
    {
      title: "Is there a free plan available?",
      content:
        "Yes. Snippetify is completely free. You can create up to 50 snippets, organize them into 5 folders, and get 5 AI-generated prompt responses daily, with limits resetting every 24 hours. If you need more space or extra features, just reach out—I’ve got you covered.",
    },
    {
      title: "What coding languages are supported?",
      content:
        "Snippetly offers syntax highlighting for over 50 programming languages, including JavaScript, Python, Java, C++, HTML, CSS, SQL, and more. We’re always expanding the list, adding new languages based on what our users request.",
    },
    {
      title: "Does Snippetly support AI-generated snippets or suggestions?",
      content:
        "You can generate code snippets using AI and instantly save them to any folder for easy organization.",
    },
    {
      title: "Is there a mobile version or app?",
      content:
        "Absolutely. Snippetly is fully responsive, adapting seamlessly to mobile devices for an app-like experience.",
    },
    {
      title: "How do I export or backup my snippets?",
      content:
        "You can currently export your snippets as a JSON file. We’re also working on making it easy to share your collection directly to a GitHub repository.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    // Toggle current panel; close if already open
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`max-w-3xl mx-auto space-y-2 rounded-2xl text-left ${className}`}
    >
      {items.map((item, idx) => (
        <Accordion
          key={idx}
          title={item.title}
          content={item.content}
          isOpen={openIndex === idx}
          onClick={() => handleClick(idx)}
        />
      ))}
    </div>
  );
};

export default Accordions;
