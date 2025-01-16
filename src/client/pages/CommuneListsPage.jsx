import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import CommuneNavbar from "../components/CommuneNavbar";
import CommuneFixedNav from "../components/CommuneFixedNav";
import { useParams, Link } from "react-router-dom";
import { getAuthHeaders } from "../utils/Helper";
import { useCommuneMembership } from "../context/CommuneMembershipContext";
import { useAuth } from "../context/AuthContext";

const CommuneListsPage = () => {
  const { communeid } = useParams();
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getRole, communeData } = useCommuneMembership();
  const [showOptions, setShowOptions] = useState({});

  // Helper to transform rows
  const transformRows = (columns, rawRows) => {
    if (!columns || !rawRows) return [];
    const keys = columns.map((col) => col.attribute_name);
    const rowValues = keys.map((key) =>
      (rawRows.find((row) => row[key]) || {})[key]
        ?.split(",")
        .map((val) => val.trim())
    );

    // Transpose rows
    return rowValues[0]?.map((_, index) =>
      keys.reduce((acc, key, colIdx) => {
        acc[key] = rowValues[colIdx][index] || "-";
        return acc;
      }, {})
    );
  };

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await axios.get(`/api/commune/${communeid}/lists`, {
          headers: getAuthHeaders(),
        });
        // Transform rows before setting them
        const transformedLists = response.data.map((list) => ({
          ...list,
          rows: transformRows(list.columns, list.rows),
        }));
        setLists(transformedLists);
      } catch (err) {
        setError("Failed to fetch lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [communeid]);

  // Update the function to show or hide options for a specific list
  const handleOptionsClick = (listId) => {
    setShowOptions((prevShowOptions) => ({
      ...prevShowOptions,
      [listId]: prevShowOptions[listId] ? false : true, // Toggle visibility
    }));
  };

  const handleEditPost = (postId) => {
    // Implement edit post logic
  };

  const handleDeletePost = (postId) => {
    // Implement delete post logic
  };

  if (loading) {
    return (
      <Layout>
        <CommuneFixedNav />
        <CommuneNavbar name={`${communeData?.name}`} />
        <div className="w-full text-center py-20 text-gray-500">Loading...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <CommuneFixedNav />
        <CommuneNavbar name={`${communeData?.name}`} />
        <div className="w-full text-center py-20 text-red-500">{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CommuneFixedNav />
      <CommuneNavbar name={`${communeData?.name}`} />
      <div className="w-8/12 mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Lists for Commune {communeid}
        </h1>
        {lists.length === 0 ? (
          <p className="text-center text-gray-500">No lists available.</p>
        ) : (
          lists.map((list, index) => (
            <div
              key={index}
              className="mb-8 p-6 bg-gray-50 rounded-lg shadow-lg border"
            >
              <div className="flex justify-between">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  <Link
                    to={`/commune/${communeid}/list/${list.metaData.post_id}`}
                    className="hover:underline text-blue-500"
                  >
                    {list.metaData.title}
                  </Link>
                </h2>
              </div>
              <p className="text-gray-600 mb-4">{list.metaData.description}</p>
              {list.metaData.links && (
                <a
                  href={list.metaData.links}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {list.metaData.links}
                </a>
              )}
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      {list.columns.map((column, idx) => (
                        <th
                          key={idx}
                          className="border px-4 py-2 bg-gray-100 text-gray-600"
                        >
                          {column.attribute_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {list.rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={list.columns.length}
                          className="border px-4 py-2 text-center text-gray-500"
                        >
                          No data available.
                        </td>
                      </tr>
                    ) : (
                      list.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {list.columns.map((column, colIndex) => (
                            <td key={colIndex} className="border px-4 py-2">
                              {column.attribute_type === "link" ? (
                                row[column.attribute_name] ? (
                                  <a
                                    href={row[column.attribute_name]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                  >
                                    {row[column.attribute_name]}
                                  </a>
                                ) : (
                                  "-"
                                )
                              ) : (
                                row[column.attribute_name] || "-"
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default CommuneListsPage;
