import React, { useState, useEffect } from "react";
import { useCommuneMembership } from "../context/CommuneMembershipContext";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import CommuneNavbar from "../components/CommuneNavbar";
import CommuneFixedNav from "../components/CommuneFixedNav";
import QuillEditor from "../components/QuillEditor";

const EditPostsPage = () => {
  const { user } = useAuth();
  const { communeid, postid } = useParams();
  const navigate = useNavigate();
  const { getRole, fetchCommuneData, communeData } = useCommuneMembership();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [links, setLinks] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const loadPostData = async () => {
      try {
        const response = await axios.get(`/api/commune/post/${postid}`);

        const { title, content, links, tags } = response.data.post;
        setTitle(title);
        setContent(content);
        setLinks(links);
        setTags(tags);
      } catch (error) {
        setErrorMessage("Failed to load post data.");
        console.error("Error loading post data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [communeid, postid, user.token]);

  const handleEditPost = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setErrorMessage("Title and content are required");
      return;
    }

    try {
      const role = getRole(communeid);
      if (role) {
        await axios.put(
          `/api/commune/post/${postid}`,
          {
            title,
            content,
            links: links,
            tags: tags,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        navigate(`/commune/${communeid}/posts`);
      } else {
        setErrorMessage(
          "You must be a member of this commune to edit the post."
        );
      }
    } catch (error) {
      setErrorMessage("Error updating post. Please try again.");
      console.error("Error updating post:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <CommuneFixedNav />
        <CommuneNavbar name={communeData?.name} />
        <div className="w-1/2 mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CommuneFixedNav />
      <CommuneNavbar name={communeData?.name} />
      <div className="w-1/2 mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleEditPost}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Post Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <div className="h-96 bg-gray-50 rounded-lg overflow-hidden shadow-inner">
              <QuillEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="links"
              className="block text-sm font-medium text-gray-700"
            >
              Links (separated by space)
            </label>
            <input
              id="links"
              type="text"
              value={links}
              onChange={(e) => setLinks(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Edit relevant links"
            />
            {links && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700">Links:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {links.split(" ").map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-100 text-green-800 text-xs font-semibold py-1 px-2 rounded-full hover:bg-green-200"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700"
            >
              Tags (separated by commas)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Edit tags"
            />
            {tags && (
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-700">Tags:</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-2 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPostsPage;
