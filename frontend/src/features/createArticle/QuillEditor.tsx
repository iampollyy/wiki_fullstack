import { Button } from "@shared/ui/button/Button";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./quillEditor.module.scss";

export function QuillEditor() {
  const [title, setTitle] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [nationality, setNationality] = useState("");
  const [occupation, setOccupation] = useState("");
  const [knownFor, setKnownFor] = useState("");
  const [content, setContent] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Введите заголовок и содержимое статьи!");
      return;
    }

    const articleData = {
      title,
      birthYear,
      nationality,
      occupation,
      knownFor,
      content,
    };

    try {
      const response = await fetch("http://localhost:5000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        const result = await response.json();
        setTitle("");
        setBirthYear("");
        setNationality("");
        setOccupation("");
        setKnownFor("");
        setContent("");
      } else {
        alert("Error saving article");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className={styles.article__title}>Create a new article</h2>

      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded p-2 mb-3"
      />

      <div className={styles.metadata__inputs}>
        <input
          type="text"
          placeholder="Birth Year"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Profession"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Known for"
          value={knownFor}
          onChange={(e) => setKnownFor(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className={`h-64 mb-6 ${styles.quillEditor}`}
      />

      <Button size="sm" onClick={handleSubmit}>
        Add Article
      </Button>
    </div>
  );
}
