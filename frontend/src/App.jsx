import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button, Spinner, Badge } from "react-bootstrap";
import { api } from "./api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap');

  :root {
    --ink: #1c1f26;
    --muted: #6b7280;
    --line: #e7e5e0;
    --paper: #faf9f6;
    --accent: #2d6a4f;
    --accent-soft: #e8f3ed;
    --danger: #b3413a;
  }

  .um-page {
    font-family: 'Inter', sans-serif;
    color: var(--ink);
    background: var(--paper);
    min-height: 100vh;
  }

  .um-header {
    border-bottom: 1px solid var(--line);
    padding-bottom: 1.5rem;
    margin-bottom: 2rem;
  }

  .um-eyebrow {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 0.35rem;
  }

  .um-title {
    font-family: 'Sora', sans-serif;
    font-weight: 800;
    font-size: 2rem;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .um-sub {
    color: var(--muted);
    font-size: 0.92rem;
    margin-top: 0.25rem;
  }

  .um-form-card {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 14px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }

  .um-form-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 0.4rem;
  }

  .um-input {
    border: 1px solid var(--line);
    border-radius: 9px;
    padding: 0.55rem 0.8rem;
    font-size: 0.95rem;
  }

  .um-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
  }

  .um-btn-primary {
    background: var(--ink);
    border: none;
    border-radius: 9px;
    padding: 0.55rem 1.4rem;
    font-weight: 600;
    font-size: 0.92rem;
    width: 100%;
  }

  .um-btn-primary:hover, .um-btn-primary:focus {
    background: var(--accent);
  }

  .um-table-wrap {
    background: #fff;
    border: 1px solid var(--line);
    border-radius: 14px;
    overflow: hidden;
  }

  .um-table {
    margin-bottom: 0;
  }

  .um-table thead th {
    background: var(--paper);
    border-bottom: 1px solid var(--line) !important;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    font-weight: 600;
    padding: 0.85rem 1rem;
  }

  .um-table tbody td {
    padding: 0.8rem 1rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--line);
    font-size: 0.92rem;
  }

  .um-table tbody tr:last-child td {
    border-bottom: none;
  }

  .um-table tbody tr:hover {
    background: var(--accent-soft);
  }

  .um-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    font-size: 0.72rem;
    font-weight: 700;
    margin-right: 0.6rem;
  }

  .um-id-badge {
    font-family: monospace;
    font-size: 0.78rem;
    color: var(--muted);
  }

  .um-empty {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--muted);
  }

  .um-delete-btn {
    border-radius: 7px;
    font-size: 0.8rem;
    border-color: var(--line);
    color: var(--danger);
  }

  .um-delete-btn:hover {
    background: var(--danger);
    border-color: var(--danger);
  }

  .um-count-badge {
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 600;
    font-size: 0.78rem;
    padding: 0.3rem 0.65rem;
    border-radius: 20px;
  }
`;

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("사용자 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    if (!name.trim() || !city.trim()) {
      alert("이름/도시를 입력하세요");
      return;
    }
    try {
      await api.post("/users", { name, city });
      setName("");
      setCity("");
      await load();
    } catch (error) {
      console.error(error);
      alert("사용자 추가 실패");
    }
  }

  async function remove(id) {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await api.delete(`/users/${id}`);
      await load();
    } catch (error) {
      console.error(error);
      alert("사용자 삭제 실패");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="um-page">
      <style>{styles}</style>
      <Container className="py-5" style={{ maxWidth: "880px" }}>
        <div className="um-header d-flex justify-content-between align-items-end">
          <div>
            <div className="um-eyebrow">User Directory</div>
            <h1 className="um-title">사용자 관리</h1>
            <div className="um-sub">팀 구성원의 이름과 도시를 등록하고 관리합니다.</div>
          </div>
          <span className="um-count-badge">{users.length}명 등록됨</span>
        </div>

        <div className="um-form-card">
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <div className="um-form-label">이름</div>
              <Form.Control
                className="um-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
              />
            </Col>
            <Col md={4}>
              <div className="um-form-label">도시</div>
              <Form.Control
                className="um-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Seoul"
              />
            </Col>
            <Col md={4}>
              <Button className="um-btn-primary" onClick={add}>
                + 사용자 추가
              </Button>
            </Col>
          </Row>
        </div>

        <div className="um-table-wrap">
          {loading ? (
            <div className="um-empty">
              <Spinner animation="border" size="sm" className="me-2" />
              불러오는 중...
            </div>
          ) : (
            <Table className="um-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                  <th>도시</th>
                  <th style={{ width: "100px" }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      <div className="um-empty">등록된 사용자가 없습니다.</div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="um-id-badge">#{user.id}</td>
                      <td>
                        <span className="um-avatar">
                          {user.name?.[0]?.toUpperCase() ?? "?"}
                        </span>
                        {user.name}
                      </td>
                      <td>{user.city}</td>
                      <td>
                        <Button
                          className="um-delete-btn"
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => remove(user.id)}
                        >
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Container>
    </div>
  );
}
