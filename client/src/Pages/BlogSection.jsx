import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/url";

const BlogSection = ({ user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-blogs`);
   console.log("blogs",response)
      setBlogs(response.data.blogs);
    } catch (err) {
      toast.error("Failed to load blogs", {
        description: "Please refresh the page to try again.",
        duration: 5000,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setCreating(true);
console.log("creating")
    try {
        console.log(user)
      const response = await axios.post(
        `${BASE_URL}/create-blog/${user.userId}`,
        {
          title,
          content,
        }
      );
      console.log("creatingr", response);

      toast.success("Blog created successfully!", {
        description: "Your post is now visible to others.",
        duration: 3000,
      });

      setTitle("");
      setContent("");

      await fetchBlogs();
    } catch (err) {
      toast.error("Failed to create blog", {
        description: err.response?.data?.message || "Please try again later.",
        duration: 5000,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Blog</h2>
        <form onSubmit={handleCreateBlog}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows="5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {creating ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Blogs</h2>
        {loading ? (
          <div>Loading blogs...</div>
        ) : blogs.length===0? (
          <p>No blogs found. Be the first to post!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.content}</p>
              <div className="text-sm text-gray-500 mt-2">
                Posted by: {blog.userId?.username || "Unknown user"} •{" "}
                {new Date(blog.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogSection;
