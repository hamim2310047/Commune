import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { timeAgo } from "../utils/Helper";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("reviews"); // Default sorting
  const navigate = useNavigate();

  // Setup Axios default headers
  axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

  // Fetch posts and events
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?sort=${sortBy}&order=desc`);  // Adjusted endpoint
      setPosts(response.data.posts);
      setError(null); // Clear previous errors
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Failed to load posts.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Navigate to commune page
  const handleCommuneClick = (communeId) => {
    navigate(`/commune/${communeId}`);
  };

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <Layout>
      <div className="flex flex-col justify-center mt-8">
        <div className="w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Popular Posts and Events</h1>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="border rounded px-2 py-1"
            >
              <option value="reviews">Sort by Reviews</option>
              <option value="reactions">Sort by Reactions</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="loader spinner-border" role="status" />
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="border p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{post.title}</h2>
                  <button
                    onClick={() => handleCommuneClick(post.commune_id)}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    View Commune
                  </button>
                </div>
                <p className="text-gray-600 text-sm">
                  {timeAgo(post.created_at)}
                </p>
                <p className="text-gray-800">
                  {post.description || "No description available."}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 font-semibold">
                      {post.reviews || 0} Reviews
                    </span>
                    <span className="text-blue-500 font-semibold">
                      {post.reactions || 0} Reactions
                    </span>
                  </div>
                  <Link to={`/post/${post.id}`}>
                    <button className="text-blue-500 text-sm hover:underline">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No posts or events found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
