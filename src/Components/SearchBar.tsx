import { Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchTitles: boolean;
  onSearchTitlesChange: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  searchTitles,
  onSearchTitlesChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleCheckboxChange = () => {
    onSearchTitlesChange(!searchTitles);
  };

  return (
    <div
      className="d-flex align-items-center bg-white p-3 rounded-top-3 w-100 max-w-100 mb-2 shadow-sm"
      style={{ minWidth: "418px" }}
    >
      <InputGroup className="flex-grow-1 me-2">
        <InputGroup.Text className="bg-white border-0">
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search posts..."
          className="border-0"
        />
      </InputGroup>

      <Form.Check
        type="checkbox"
        label="Search Titles"
        checked={searchTitles}
        onChange={handleCheckboxChange}
        className="mb-0 ms-auto"
        style={{ whiteSpace: "nowrap" }}
      />
    </div>
  );
};
export default SearchBar;
