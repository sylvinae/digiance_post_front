import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Spinner,
  Pagination,
  ToastContainer,
  Toast,
} from "react-bootstrap";
import TopBar from "../Components/TopBar";
import SearchBar from "../Components/SearchBar";
import "./Homepage.css";
import axios from "axios";
import { useDebounce } from "../Hooks/UseDebounce";

interface HomepageProps {
  user: {
    username: string;
    email: string;
  } | null;
  onLogout: () => void;
}

interface ResponseData {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Post[];
}
interface Post {
  id: string;
  userId: string;
  title: string;
  body: string;
}

const Homepage: React.FC<HomepageProps> = ({ user, onLogout }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchTitlesOnly, setSearchTitlesOnly] = useState<boolean>(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedSearchTitles = useDebounce(searchTitlesOnly, 500);
  const [notifications, setNotifications] = useState<
    { id: number; message: string }[]
  >([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "https://localhost:7052/api/post/stream"
    );

    eventSource.onmessage = (event) => {
      const postData = JSON.parse(event.data);
      const { operation, count } = postData;

      let message = "";
      if (operation === "added") {
        message = `${count} new post${count > 1 ? "s" : ""}.`;
      } else if (operation === "updated") {
        message = `${count} post${count > 1 ? "s" : ""} updated.`;
      }

      setNotifications((prev) => [...prev, { id: Date.now(), message }]);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  const fetchPosts = async (page: number = currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get<ResponseData>(
        "https://localhost:7052/api/post",
        {
          params: {
            page: page,
            pageSize: 10,
            query: debouncedSearchQuery || undefined,
            searchTitles: debouncedSearchTitles,
          },
        }
      );
      setPosts(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, debouncedSearchQuery, debouncedSearchTitles]);

  useEffect(() => {
    if (debouncedSearchQuery || debouncedSearchTitles) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, debouncedSearchTitles]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (error) {
    return <div className="text-center my-5 text-danger py-3">{error}</div>;
  }

  return (
    <Container fluid className="d-flex flex-column p-0">
      <Container className="col-lg-8 col-xl-10 mt-3">
        <Container className="p-0 mt-1 sticky-top bg-light">
          <TopBar user={user} onLogout={onLogout} />
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchTitlesOnly={searchTitlesOnly}
            onSearchTitlesChange={setSearchTitlesOnly}
          />
        </Container>

        <Table hover className="rounded-bottom-2 overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th className="text-nowrap ">User ID</th>
              <th>Title</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : posts.length > 0 ? (
              posts.map((post, index) => (
                <tr
                  key={post.id}
                  className={index === posts.length - 1 ? "rounded-bottom" : ""}
                >
                  <td className="text-center">{post.id}</td>
                  <td className="text-center">{post.userId}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No posts available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <div
          className="position-sticky bottom-0 text-center py-2"
          style={{ backgroundColor: "#f2f4f7" }}
        >
          {posts.length > 0 && (
            <Pagination className="mb-0 d-inline-flex">
              <Pagination.Prev
                onClick={handlePrevious}
                disabled={currentPage === 1}
              />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={handleNext}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </div>

        <ToastContainer position="bottom-end" className="p-3">
          {notifications.map((notification) => (
            <Toast
              key={notification.id}
              onClose={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="w-auto"
            >
              <Toast.Body className="d-flex justify-content-between align-items-center gap-2 p-3">
                <span className="me-2">{notification.message}</span>
                <div className="d-flex align-items-center flex-shrink-0">
                  <button
                    className="btn btn-link p-0"
                    style={{
                      color: "#007bff",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}
                    onClick={async () => {
                      setCurrentPage(1);
                      await fetchPosts(1);
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      );
                    }}
                  >
                    Reload
                  </button>
                  <button
                    className="btn-close p-1 ms-2"
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== notification.id)
                      )
                    }
                    style={{
                      fontSize: "10px",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </div>
              </Toast.Body>
            </Toast>
          ))}
        </ToastContainer>
      </Container>
    </Container>
  );
};

export default Homepage;
