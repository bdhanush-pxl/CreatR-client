import React from 'react'
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const quillConfig = {
  modules: {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link", "blockquote", "code-block"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["image", "video"],
      ],
      handlers: { image: function () { } },
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "link",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "image",
    "video",
  ],
};

const PostEditorContent = ({ form, setQuillRef, onImageUpload }) => {
  const getQuillModules = () => ({
    ...quillConfig.modules,
    toolbar: {
      ...quillConfig.modules.toolbar,
      handlers: { image: () => onImageUpload("content") },
    },
  });

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-5">
          <div>
            <ReactQuill
              ref={setQuillRef}
              theme="snow"
              modules={getQuillModules()}
              formats={quillConfig.formats}
              placeholder="Tell your story... or use AI to generate content!"
              style={{
                minHeight: "400px",
                fontSize: "1.125rem",
                lineHeight: "1.7",
              }}
            />
          </div>
        </div>
      </main>

      <style jsx global>{`
        .ql-editor {
          color: white !important;
          font-size: 1.125rem !important;
          line-height: 1.7 !important;
          padding: 0 !important;
          min-height: 400px !important;
        }
        .ql-editor::before {
          color: rgb(100, 116, 139) !important;
        }
        .ql-toolbar {
          border: none !important;
          padding: 0 0 1rem 0 !important;
          position: sticky !important;
          top: 80px !important;
          background: rgb(15, 23, 42) !important;
          z-index: 30 !important;
          border-radius: 8px !important;
          margin-bottom: 1rem !important;
        }
        .ql-container {
          border: none !important;
        }
        .ql-snow .ql-tooltip {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
          color: white !important;
        }
        .ql-snow .ql-picker {
          color: white !important;
        }
        .ql-snow .ql-picker-options {
          background: rgb(30, 41, 59) !important;
          border: 1px solid rgb(71, 85, 105) !important;
        }
        .ql-snow .ql-fill,
        .ql-snow .ql-stroke.ql-fill {
          fill: white !important;
        }
        .ql-snow .ql-stroke {
          stroke: white !important;
        }
        .ql-editor h2 {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: white !important;
        }
        .ql-editor h3 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: white !important;
        }
        .ql-editor blockquote {
          border-left: 4px solid rgb(147, 51, 234) !important;
          color: rgb(203, 213, 225) !important;
          padding-left: 1rem !important;
          font-style: italic !important;
        }
        .ql-editor a {
          color: rgb(147, 51, 234) !important;
        }
        .ql-editor code {
          background: rgb(51, 65, 85) !important;
          color: rgb(248, 113, 113) !important;
          padding: 0.125rem 0.25rem !important;
          border-radius: 0.25rem !important;
        }
      `}</style>
    </>
  )
}

export default PostEditorContent
