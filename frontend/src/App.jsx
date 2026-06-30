import { useEffect, useState } from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { api } from "./api";

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
      await api.post("/users", {
        name,
        city,
      });

      setName("");
      setCity("");
      await load();
    } catch (error) {
      console.error(error);
      alert("사용자 추가 실패");
    }
  }

  async function remove(id) {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }

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
    <>
      <div className="p-6">
        <h1>My App</h1>
        <p className="mt-2">CI/CD OK!!!!</p>
      </div>
      <Container className="py-4">
        <Row className="mb-3">
          <Col>
            <h3>사용자 관리</h3>
          </Col>
        </Row>

        <Row className="g-2 align-items-end mb-4">
          <Col md={4}>
            <Form.Label>이름</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
            />
          </Col>

          <Col md={4}>
            <Form.Label>도시</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Seoul"
            />
          </Col>

          <Col md={4}>
            <Button onClick={add}>추가</Button>
          </Col>
        </Row>

        <Row>
          <Col>
            {loading ? (
              <div>로딩중...</div>
            ) : (
              <Table striped hover bordered>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>이름</th>
                    <th>도시</th>
                    <th style={{ width: "120px" }}>액션</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.city}</td>
                        <td>
                          <Button
                            variant="outline-danger"
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
          </Col>
        </Row>
      </Container>
    </>
  );
}
