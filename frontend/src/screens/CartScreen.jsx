import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // NOTE: no need for an async function here as we are not awaiting the
  // resolution of a Promise
  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 className="mb-4" style={{ fontWeight: 600, fontSize: '2rem' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id} className="d-flex align-items-center py-3">
                <Row className="w-100 align-items-center">
                  <Col md={2} className="d-flex justify-content-center">
                    <Image src={item.image} alt={item.name} fluid rounded style={{ maxHeight: '60px', background: '#fafafa', border: '1px solid #eee' }} />
                  </Col>
                  <Col md={3} className="d-flex align-items-center">
                    <Link to={`/product/${item._id}`} style={{ fontWeight: 500, color: '#007185' }}>{item.name}</Link>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">${item.price}</Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      style={{ minWidth: '60px' }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                      style={{ border: '1px solid #eee', background: '#fff' }}
                    >
                      <FaTrash style={{ color: '#d9534f' }} />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 600 }}>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
              <div style={{ fontSize: '1.1rem', margin: '10px 0' }}>
                ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block w-100'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
                style={{ padding: '10px 0', fontWeight: 500 }}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
